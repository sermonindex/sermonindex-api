import {
  HymnMedia,
  MediaFormat,
  MediaSource,
  MediaType,
  PrismaClient,
} from '@prisma/client';
import * as fs from 'fs';
import {
  extractTextBetween,
  findContributorId,
  getArchiveAudioUrl,
  upsertHymn,
} from './common';
import { audioContributorsThatAreHyms, hymnsToIgnore } from './constants';

export const convertHymns = async (prisma: PrismaClient) => {
  const contributorIdsToSkip: number[] = [];
  const uniqueContributors: Map<string, number[]> = new Map();

  let missingLyricsCount = 0;
  let hymnsCreated = 0;
  let duplicateHymnCount = 0;

  const audioContributors = JSON.parse(
    fs.readFileSync('prisma/data/xoops_mydownloads_cat.json', 'utf8'),
  ).xoops_mydownloads_cat;
  const audioSermons = JSON.parse(
    fs.readFileSync('prisma/data/xoops_mydownloads_downloads.json', 'utf8'),
  ).xoops_mydownloads_downloads;

  for (const audioContributor of audioContributors) {
    if (!audioContributorsThatAreHyms.includes(audioContributor.title)) {
      contributorIdsToSkip.push(audioContributor.cid);
      continue;
    }

    // Extract the src attribute from the <img> tag
    const imgSrcMatch = audioContributor.description.match(
      /<img[^>]+src="([^"]+)"/,
    );
    const imgSrc = imgSrcMatch ? imgSrcMatch[1] : null;

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
      .replace(/\./g, '')
      .replace(/\'/g, '')
      .replace(/ & /g, '')
      .replace(/ - /g, '')
      .replace(/  /g, ' ')
      .replace(/ /g, '-');
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

      continue;
    }

    const c = await prisma.contributor.create({
      data: {
        slug: fullNameSlug,
        fullName: fullName,
        bio: description,
        imageUrl: imgSrc,
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

      const urls: Omit<HymnMedia, 'id' | 'hymnId'>[] = [];
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
      }

      let originalId = audioSermon.url.split('/').pop().split('.')[0];
      if (hymnsToIgnore.includes(originalId)) {
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
        console.log(`No transcript found for hymn ${originalId}`);
        missingLyricsCount++;
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

      const hymnId = await upsertHymn(
        prisma,
        contributorId,
        title,
        audioSermon.hits,
        urls,
        MediaType.AUDIO,
        transcript,
        originalId,
        audioSermon.lid.toString(),
      );
      hymnsCreated++;

      if (!hymnId) {
        duplicateHymnCount++;
      }
    } catch (e) {
      console.log(`Failed to convert hymn: ${audioSermon.title}`);
      console.log(e);

      throw e;
    }
  }

  console.log('Finished converting audio hymn. Summary:');
  console.log(`- Hymns created: ${hymnsCreated}`);
  console.log(`- No lyrics found for ${missingLyricsCount} hymns`);
};
