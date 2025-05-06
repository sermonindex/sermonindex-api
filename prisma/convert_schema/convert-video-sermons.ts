import {
  MediaFormat,
  MediaSource,
  MediaType,
  PrismaClient,
  SermonBibleReference,
} from '@prisma/client';
import AwokenRef from 'awoken-bible-reference';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import {
  extractTextBetween,
  findContributorId,
  findVideoTranscript,
  parseBibleReferences,
  upsertSermon,
} from './common';
import {
  featuredContributors,
  featuredSermonId,
  videoContributorNamesToIgnore,
  videoSermonsToIgnore,
} from './constants';

export const convertVideoSermons = async (prisma: PrismaClient) => {
  const contributorIdsToSkip: number[] = [];
  const uniqueContributors: Map<number, number[]> = new Map();

  let missingTranscriptCount = 0;
  let missingMetadataCount = 0;
  let failedToParseScriptureCount = 0;
  let duplicateSermonCount = 0;

  const videoContributors = JSON.parse(
    fs.readFileSync('prisma/data/xoops_myvideo_cat.json', 'utf8'),
  ).xoops_myvideo_cat;
  const videoSermons = JSON.parse(
    fs.readFileSync('prisma/data/xoops_myvideo_videos.json', 'utf8'),
  ).xoops_myvideo_videos;

  // Extract the video sermon descriptions (ai generated from csv file)
  const rawVideoSermonMetadata = await fs.promises.readFile(
    `prisma/data/video_sermon_metadata.csv`,
    'utf8',
  );
  const rawVideoSermonMetadataRows = rawVideoSermonMetadata.split('\n');
  const videoSermonMetadata = new Map();
  rawVideoSermonMetadataRows.map((row) => {
    const records = parse(row, { delimiter: ',' });
    if (!records[0]) return;

    const id = records[0][0];
    const description = records[0][1];
    const references = records[0][2];

    videoSermonMetadata.set(id, { description, references });
  });

  for (const videoContributor of videoContributors) {
    // Check if video contributor is in the list of video contributors to ignore
    if (videoContributorNamesToIgnore.includes(videoContributor.title)) {
      console.log(
        `Skipping video contributor: Name: ${videoContributor.title}, ID ${videoContributor.cid}`,
      );

      contributorIdsToSkip.push(videoContributor.cid);

      continue;
    }

    // Extract the src attribute from the <img> tag
    const imgSrcMatch = videoContributor.description.match(
      /<img[^>]+src="([^"]+)"/,
    );
    let imgSrc = imgSrcMatch ? imgSrcMatch[1] : null;
    imgSrc =
      imgSrc?.replace('img.sermonindex.net', 'sermonindex3.b-cdn.net') ?? null;

    // Just get the bulk of the description for now. We can parse the rest later.
    let description = extractTextBetween(
      videoContributor.description,
      '</h1>',
      '<br>',
    );
    description = description?.replace(/<a[^>]*>(.*?)<\/a>/g, '$1') ?? null;
    description = description?.replace('<p>', '') ?? null;
    description =
      description?.replace(
        /Watch video sermons by the speaker [\w\s.,'"]+ in youtube format\./,
        '',
      ) ?? null;

    const fullNameSlug = videoContributor.title
      .toLowerCase()
      .replace(/  /g, ' ')
      .replace(/ /g, '-')
      .replace(/\./g, '');

    const fullName = videoContributor.title.replace(/  /g, ' ');

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
          ? [...existingIds, videoContributor.cid]
          : [videoContributor.cid],
      );

      if (!existingContributor.imageUrl && imgSrc) {
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
    uniqueContributors.set(c.id, [videoContributor.cid]);
  }

  for (const videoSermon of videoSermons) {
    if (contributorIdsToSkip.includes(videoSermon.cid)) {
      continue;
    }

    const contributorId = findContributorId(
      videoSermon.cid,
      uniqueContributors,
    );
    if (!contributorId) {
      console.log(
        `Could not find contributor ID for text sermon: ${videoSermon.title}`,
      );
      continue;
    }

    // Get the video sermon source & youtube id
    let videoSrc, originalId;
    try {
      if (videoSermon.videoBlockText.includes('iframe')) {
        const videoSrcMatch =
          videoSermon.videoBlockText.match(/src="([^"?]+)"?/);
        videoSrc = videoSrcMatch ? videoSrcMatch[1] : null;

        const videoIdMatch = videoSrc.match(/embed\/([^?]+)/);
        originalId = videoIdMatch ? videoIdMatch[1] : null;
      } else {
        const videoSrcMatch = videoSermon.videoBlockText.match(
          /<embed[^>]+src="([^&?]+)&?/,
        );
        videoSrc = videoSrcMatch ? videoSrcMatch[1] : null;

        const videoIdMatch = videoSrc.match(/\/v\/([^&]+)/);
        originalId = videoIdMatch ? videoIdMatch[1] : null;
      }
    } catch (e) {
      console.log(e);
      console.log(
        `No video source found for video sermon id: ${videoSermon.lid}`,
      );
      console.log(videoSermon);
    }

    if (!videoSrc) {
      console.log(
        `No video source found for video sermon id: ${videoSermon.lid}`,
      );
      continue;
    }

    if (videoSermonsToIgnore.includes(originalId)) {
      console.log(
        `Skipping video sermon: ${videoSermon.title}, ID: ${videoSermon.lid}`,
      );
      continue;
    }

    const urls = [
      {
        url: videoSrc,
        type: MediaType.VIDEO,
        source: MediaSource.YOUTUBE,
        format: MediaFormat.NONE,
      },
      {
        url: `https://sermonindex2.b-cdn.net/${originalId}.mp4`,
        type: MediaType.VIDEO,
        source: MediaSource.BUNNY,
        format: MediaFormat.MP4,
      },
      {
        url: `https://sermonindex3.b-cdn.net/srt-video/${originalId}.srt`,
        type: MediaType.VIDEO,
        source: MediaSource.BUNNY,
        format: MediaFormat.SRT,
      },
      {
        url: `https://sermonindex3.b-cdn.net/vtt-video/${originalId}.vtt`,
        type: MediaType.VIDEO,
        source: MediaSource.BUNNY,
        format: MediaFormat.VTT,
      },
    ];

    // Get the video sermon transcript
    let transcript;
    try {
      transcript = findVideoTranscript(originalId);
    } catch (e) {
      console.log(`No transcript found for video ${originalId}`, videoSermon);
      missingTranscriptCount++;
    }

    // Get the description
    const metadata = videoSermonMetadata.get(originalId);
    let description = null;
    if (!metadata) {
      console.log(`No metadata found for video sermon id: ${originalId}`);
      missingMetadataCount++;
    } else {
      description = metadata.description;
    }

    // Get the bible references from the AI generated data
    const bibleReferences: Omit<
      SermonBibleReference,
      'id' | 'sermonId' | 'createdAt' | 'updatedAt'
    >[] = [];
    if (metadata && metadata.references != '') {
      const references = parseBibleReferences(metadata.references);
      if (!references) {
        console.log(
          `Could not parse bible references for video sermon: ${videoSermon.title}, ${metadata.references}, ${videoSermon.lid}`,
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
    let title = videoSermon.title;
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
      [],
      bibleReferences,
      title,
      videoSermon.hits,
      urls,
      videoSermon.lid === featuredSermonId ? true : false,
      MediaType.VIDEO,
      transcript,
      originalId,
      description,
    );

    if (!sermonId) {
      duplicateSermonCount++;
    }
  }

  console.log('Finished converting video sermons. Summary:');
  console.log(`- Duplicate sermons found: ${duplicateSermonCount}`);
  console.log(`- No transcript found for ${missingTranscriptCount} sermons`);
  console.log(`- No ai data found for ${missingMetadataCount} sermons`);
  console.log(
    `- Failed to parse ${failedToParseScriptureCount} bible references`,
  );
};
