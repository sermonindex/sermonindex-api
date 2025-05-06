import {
  MediaFormat,
  MediaSource,
  MediaType,
  PrismaClient,
  SermonBibleReference,
  SermonMedia,
} from '@prisma/client';
import AwokenRef from 'awoken-bible-reference';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import {
  extractTextBetween,
  findContributorId,
  getArchiveAudioUrl,
  parseBibleReferences,
  upsertSermon,
  upsertTopics,
} from './common';
import {
  audioContributorNamesToIgnore,
  audioSermonsToIgnore,
  featuredContributors,
  featuredSermonId,
} from './constants';

export const convertAudioSermons = async (prisma: PrismaClient) => {
  const contributorIdsToSkip: number[] = [];
  const uniqueContributors: Map<number, number[]> = new Map();

  let missingTranscriptCount = 0;
  let missingMetadataCount = 0;
  let failedToParseScriptureCount = 0;
  let duplicateSermonCount = 0;

  const audioContributors = JSON.parse(
    fs.readFileSync('prisma/data/xoops_mydownloads_cat.json', 'utf8'),
  ).xoops_mydownloads_cat;
  const audioSermons = JSON.parse(
    fs.readFileSync('prisma/data/xoops_mydownloads_downloads.json', 'utf8'),
  ).xoops_mydownloads_downloads;

  // Extract the text sermon descriptions (ai generated from csv file)
  const rawAudioSermonMetadata = await fs.promises.readFile(
    `prisma/data/audio_sermon_metadata.csv`,
    'utf8',
  );
  const rawAudioSermonMetadataRows = rawAudioSermonMetadata.split('\n');
  const audioSermonMetadata = new Map();
  rawAudioSermonMetadataRows.map((row) => {
    const records = parse(row, {
      delimiter: ',',
    });
    if (!records[0]) return;

    const id = records[0][0];
    const description = records[0][1];
    const references = records[0][2];

    audioSermonMetadata.set(id, { description, references });
  });

  for (const audioContributor of audioContributors) {
    // Check if audio contributor is in the list of audio contributors to ignore
    if (audioContributorNamesToIgnore.includes(audioContributor.title)) {
      console.log(
        `Skipping audio contributor: Name: ${audioContributor.title}, ID ${audioContributor.cid}`,
      );

      contributorIdsToSkip.push(audioContributor.cid);

      continue;
    }

    // Extract the src attribute from the <img> tag
    const imgSrcMatch = audioContributor.description.match(
      /<img[^>]+src="([^"]+)"/,
    );
    let imgSrc = imgSrcMatch ? imgSrcMatch[1] : null;
    imgSrc =
      imgSrc?.replace('img.sermonindex.net', 'sermonindex3.b-cdn.net') ?? null;

    // Just get the bulk of the description for now. We can parse the rest later.
    let description = extractTextBetween(
      audioContributor.description,
      '</h1>',
      '<br>',
    );
    description = description?.replace(/<a[^>]*>(.*?)<\/a>/g, '$1') ?? null;
    description = description?.replace('<p>', '') ?? null;
    description =
      description?.replace(
        /Listen to freely downloadable audio sermons by the speaker [\w\s.,'"]+ in mp3 format\./,
        '',
      ) ?? null;

    const fullNameSlug = audioContributor.title
      .toLowerCase()
      .replace(/  /g, ' ')
      .replace(/ /g, '-')
      .replace(/\./g, '');

    const fullName = audioContributor.title.replace(/  /g, ' ');

    // Check if this contributor already exists in the new schema
    const existingContributor = await prisma.contributor.findUnique({
      where: {
        fullName: fullName,
      },
    });
    if (existingContributor) {
      const existingIds = uniqueContributors.get(existingContributor.id);

      uniqueContributors.set(
        existingContributor.id,
        existingIds
          ? [...existingIds, audioContributor.cid]
          : [audioContributor.cid],
      );

      if (existingContributor.imageUrl !== imgSrc) {
        await prisma.contributor.update({
          where: {
            id: existingContributor.id,
          },
          data: {
            fullNameSlug,
            fullName: fullName,
            description: description,
            imageUrl: imgSrc,
            featured: featuredContributors.includes(fullName),
          },
        });
      }
      continue;
    }

    const c = await prisma.contributor.create({
      data: {
        fullNameSlug,
        fullName: fullName,
        description: description,
        imageUrl: imgSrc,
        featured: featuredContributors.includes(fullName),
      },
    });
    uniqueContributors.set(c.id, [audioContributor.cid]);
  }

  for (const audioSermon of audioSermons) {
    try {
      if (contributorIdsToSkip.includes(audioSermon.cid)) {
        continue;
      }

      const contributorId = findContributorId(
        audioSermon.cid,
        uniqueContributors,
      );
      if (!contributorId) {
        console.log(
          `Could not find contributor ID for text sermon: ${audioSermon.title}`,
        );
        continue;
      }

      const urls: Omit<SermonMedia, 'id' | 'sermonId'>[] = [];
      const archiveUrl = await getArchiveAudioUrl(
        audioSermon.lid,
        audioSermon.url,
      );
      if (archiveUrl) {
        urls.push({
          url: archiveUrl,
          source: MediaSource.ARCHIVE,
          type: MediaType.AUDIO,
          format: MediaFormat.MP3,
        });
      }

      const pathMatch = audioSermon.url.match(/(\/\d+\/SID\d+)/);
      const path = pathMatch ? pathMatch[1] : null;
      if (path) {
        urls.push({
          url: `https://sermonindex1.b-cdn.net${path}.mp3`,
          source: MediaSource.BUNNY,
          type: MediaType.AUDIO,
          format: MediaFormat.MP3,
        });

        urls.push({
          url: `https://sermonindex3.b-cdn.net/srt${path}.srt`,
          source: MediaSource.BUNNY,
          type: MediaType.AUDIO,
          format: MediaFormat.SRT,
        });

        urls.push({
          url: `https://sermonindex3.b-cdn.net/vtt${path}.vtt`,
          source: MediaSource.BUNNY,
          type: MediaType.AUDIO,
          format: MediaFormat.VTT,
        });
      }

      let originalId = audioSermon.url.split('/').pop().split('.')[0];
      if (audioSermonsToIgnore.includes(originalId)) {
        console.log(
          `Skipping audio sermon: ${audioSermon.title}, ID: ${originalId}`,
        );
        continue;
      }

      let transcript;
      try {
        transcript = fs.readFileSync(
          `prisma/data/audio_transcripts/${originalId}.txt`,
          'utf8',
        );
      } catch (e) {
        console.log(`No transcript found for sermon ${originalId}`);
        missingTranscriptCount++;
      }

      let topics = audioSermon.topic
        .split(',')
        .map((topic: string) => topic.trim());
      if (topics?.length > 0) {
        topics = await upsertTopics(prisma, topics as string[]);
      }

      // Get the description
      let metadata = audioSermonMetadata.get(originalId);
      let description = null;
      if (!metadata) {
        console.log(
          `Could not find metadata for sermon ${originalId}, ${audioSermon.title}`,
        );
        missingMetadataCount++;
      } else {
        description = metadata.description;
      }

      const bibleReferences: Omit<
        SermonBibleReference,
        'id' | 'sermonId' | 'createdAt' | 'updatedAt'
      >[] = [];
      if (metadata && metadata.references != '') {
        const references = parseBibleReferences(metadata.references);
        if (!references) {
          console.log(
            `Could not parse bible references for audio sermon: ${audioSermon.title}, ${metadata.references}, ${audioSermon.lid}`,
          );
          failedToParseScriptureCount++;
        } else {
          for (const reference of references) {
            if (reference.is_range) {
              bibleReferences.push({
                bookId: reference.start.book,
                startChapter: reference.start.chapter,
                endChapter: reference.end.chapter,
                startVerse: reference.start.verse,
                endVerse: reference.end.verse,
                text: AwokenRef.format(reference, {
                  combine_ranges: true,
                  compact: true,
                }),
              });
            } else {
              bibleReferences.push({
                bookId: reference.book,
                startChapter: reference.chapter,
                endChapter: reference.chapter,
                startVerse: reference.verse,
                endVerse: reference.verse,
                text: AwokenRef.format(reference, {
                  combine_ranges: true,
                  compact: true,
                }),
              });
            }
          }
        }
      }

      const contributor = await prisma.contributor.findUnique({
        where: {
          id: contributorId,
        },
      });
      let title = audioSermon.title;
      if (contributor) {
        if (title.includes(`by ${contributor.fullName}`)) {
          title = title.replace(`by ${contributor.fullName}`, '');
        } else if (title.includes(`By ${contributor.fullName}`)) {
          title = title.replace(`By ${contributor.fullName}`, '');
        }

        if (title.includes(`- ${contributor.fullName}`)) {
          title = title.replace(`- ${contributor.fullName}`, '');
        }
      }

      const sermonId = await upsertSermon(
        prisma,
        contributorId,
        topics,
        bibleReferences,
        title,
        audioSermon.hits,
        urls,
        audioSermon.lid === featuredSermonId ? true : false,
        MediaType.AUDIO,
        transcript,
        originalId,
        description,
      );

      if (!sermonId) {
        duplicateSermonCount++;
      }
    } catch (e) {
      console.log(`Failed to convert sermon: ${audioSermon.title}`);
      console.log(e);

      throw e;
    }
  }

  console.log('Finished converting audio sermons. Summary:');
  console.log(`- Duplicate sermons found: ${duplicateSermonCount}`);
  console.log(`- No transcript found for ${missingTranscriptCount} sermons`);
  console.log(`- No ai data found for ${missingMetadataCount} sermons`);
  console.log(
    `- Failed to parse ${failedToParseScriptureCount} bible references`,
  );
};
