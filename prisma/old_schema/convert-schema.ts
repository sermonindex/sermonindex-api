import { BibleReference, Contributor, PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

const featuredContributors = [
  'A.W. Tozer',
  'Alan Redpath',
  'Art Katz',
  'Bakht Singh',
  'Bill McLeod',
  'Carter Conlon',
  'Chuck Smith',
  'Corrie Ten Boom',
  'David Wilkerson',
  'Duncan Campbell',
  'Erlo Stegen',
  'George Verwer',
  'George Warnock',
  'Hans R. Waldvogel',
  'J. Edwin Orr',
  'J. Glyn Owen',
  'J. Vernon McGee',
  'Jackie Pullinger',
  'Jim Cymbala',
  'Keith Daniel',
  'Leonard Ravenhill',
  'Major Ian Thomas',
  'Manley Beasley',
  'Milton Green',
  'Oswald J. Smith',
  'Paris Reidhead',
  'Paul Washer',
  'Rolfe Barnard',
  'Roy Hession',
  'Shane Idleman',
  'Stephen Kaung',
  'T. Austin Sparks',
  'Vance Havner',
  'Warren Wiersbe',
  'William MacDonald',
  'Zac Poonen',
];

const featuredSermonId = 14801;

interface TransientContributor {
  contributor: Contributor;
  audioId: number[];
  videoId: number[];
}

function extractTextBetween(
  input: string,
  startText: string,
  endTag: string,
): string | null {
  const regex = new RegExp(`${startText}(.*?)${endTag}`, 's');
  const match = input.match(regex);
  return match ? match[1].trim() : null;
}

const findObject = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  value: any,
): any => {
  return array.find((obj) => obj[key] === value);
};

const findObjects = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  value: any,
): any[] => {
  return array.filter((obj) => obj[key] === value);
};

const findContributor = (contributors: TransientContributor[], id: number) => {
  return contributors.find((contributor) => {
    return contributor.audioId.includes(id) || contributor.videoId.includes(id);
  });
};

const upsertTopics = async (topics: string[]): Promise<string[]> => {
  const topicNames: string[] = [];

  for (const topic of topics) {
    if (!topic) continue;

    const existingTopic = await prisma.topic.findFirst({
      where: {
        name: topic,
      },
    });

    if (existingTopic) {
      topicNames.push(existingTopic.name);
      continue;
    }

    const newTopic = await prisma.topic.create({
      data: {
        name: topic,
      },
    });

    topicNames.push(newTopic.name);
  }

  return topicNames;
};

const upsertSermon = async (
  contributorId: number,
  topics: string[],
  bibleReferences: Omit<
    BibleReference,
    'id' | 'sermonId' | 'createdAt' | 'updatedAt'
  >[],
  title: string,
  hits: string,
  url: string,
  type: 'audio' | 'video',
  featured: boolean,
  mysqlId?: number,
  description?: string,
) => {
  const existingSermon = await prisma.sermon.findFirst({
    where: {
      title: title,
      contributorId: contributorId,
    },
  });

  if (existingSermon) {
    return existingSermon.id;
  }

  const newSermon = await prisma.sermon.create({
    data: {
      mysqlId: mysqlId,
      title: title,
      hits: parseInt(hits),
      audioUrl: type === 'audio' ? url : null,
      videoUrl: type === 'video' ? url : null,
      description: description,
      contributorId: contributorId,
      featured: featured,
      topics: {
        connect: topics.map((name) => ({ name })),
      },
      bibleReferences: {
        create: bibleReferences.map((reference) => ({
          book: reference.book,
          startChapter: reference.startChapter,
          endChapter: reference.endChapter,
          startVerse: reference.startVerse,
          endVerse: reference.endVerse,
          text: reference.text,
        })),
      },
    },
  });

  return newSermon.id;
};

export const convertSchema = async () => {
  var contributors: TransientContributor[] = [];

  const audioContributors = JSON.parse(
    fs.readFileSync('prisma/old_schema/xoops_mydownloads_cat.json', 'utf8'),
  ).xoops_mydownloads_cat;
  const audioSermons = JSON.parse(
    fs.readFileSync(
      'prisma/old_schema/xoops_mydownloads_downloads.json',
      'utf8',
    ),
  ).xoops_mydownloads_downloads;
  const audioSermonDescriptions = JSON.parse(
    fs.readFileSync('prisma/old_schema/xoops_mydownloads_text.json', 'utf8'),
  ).xoops_mydownloads_text;
  const videoContributors = JSON.parse(
    fs.readFileSync('prisma/old_schema/xoops_myvideo_cat.json', 'utf8'),
  ).xoops_myvideo_cat;
  const videoSermons = JSON.parse(
    fs.readFileSync('prisma/old_schema/xoops_myvideo_videos.json', 'utf8'),
  ).xoops_myvideo_videos;
  const videoSermonDescriptions = JSON.parse(
    fs.readFileSync('prisma/old_schema/xoops_myvideo_text.json', 'utf8'),
  ).xoops_myvideo_text;

  for (const audioContributor of audioContributors) {
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
    description = description?.replace('â€™', "'") ?? null;

    // Find this contributor in the video contributors.
    // Note: there could be multiple contributors with the same name
    const sameVideoContributors = findObjects(
      videoContributors,
      'title',
      audioContributor.title,
    );

    // Find more audio contributors with the same name
    const sameAudioContributors = findObjects(
      audioContributors,
      'title',
      audioContributor.title,
    );

    try {
      let existingContributor = await prisma.contributor.findFirst({
        where: {
          fullName: audioContributor.title,
        },
      });

      if (!existingContributor) {
        existingContributor = await prisma.contributor.create({
          data: {
            firstName: '',
            lastName: '',
            fullName: audioContributor.title,
            description: description,
            imageUrl: imgSrc,
            featured: featuredContributors.includes(audioContributor.title),
          },
        });
      }

      contributors.push({
        contributor: existingContributor,
        audioId: sameAudioContributors.map((c: any) => c.cid),
        videoId: sameVideoContributors.map((c: any) => c.cid),
      });
    } catch (e) {
      console.log('Failed to create contributor: ');
      console.log(e);
    }
  }

  for (const videoContributor of videoContributors) {
    // Check if this contributor is in the audio contributors
    const audioContributor = findObjects(
      audioContributors,
      'title',
      videoContributor.title,
    );

    if (audioContributor.length > 0) {
      // This contributor is already added
      continue;
    }

    const imgSrc = videoContributor.imgurl ?? null;

    // Just get the bulk of the description for now. We can parse the rest later.
    let description = extractTextBetween(
      videoContributor.description,
      '</h1>',
      '<br>',
    );
    description = description?.replace(/<a[^>]*>(.*?)<\/a>/g, '$1') ?? null;
    description = description?.replace('<p>', '') ?? null;
    description = description?.replace('â€™', "'") ?? null;

    // Find this contributor in the video contributors.
    // Note: there could be multiple contributors with the same name
    const sameVideoContributors = findObjects(
      videoContributors,
      'title',
      videoContributor.title,
    );

    try {
      let existingContributor = await prisma.contributor.findFirst({
        where: {
          fullName: videoContributor.title,
        },
      });

      if (!existingContributor) {
        existingContributor = await prisma.contributor.create({
          data: {
            firstName: '',
            lastName: '',
            fullName: videoContributor.title,
            description: description,
            imageUrl: imgSrc,
            featured: featuredContributors.includes(videoContributor.title),
          },
        });
      }

      contributors.push({
        contributor: existingContributor,
        audioId: [],
        videoId: sameVideoContributors.map((c: any) => c.cid),
      });
    } catch (e) {
      console.log('Failed to create contributor: ');
      console.log(e);
    }
  }

  for (const audioSermon of audioSermons) {
    const contributor = findContributor(contributors, audioSermon.cid);
    if (!contributor) {
      console.log(
        `No contributor found for audio sermon id: ${audioSermon.lid} with cid ${audioSermon.cid}`,
      );
      continue;
    }

    let audioSermonDescription = findObject(
      audioSermonDescriptions,
      'lid',
      audioSermon.lid,
    );
    if (
      !audioSermonDescription ||
      !audioSermonDescription.description ||
      audioSermonDescription.description == 'nill' ||
      audioSermonDescription.description == 'nil'
    ) {
      audioSermonDescription = { description: '' };
    }

    let topics = audioSermon.topic
      .split(',')
      .map((topic: string) => topic.trim());
    if (topics?.length > 0) {
      topics = await upsertTopics(topics as string[]);
    }

    const bibleReferences: Omit<
      BibleReference,
      'id' | 'sermonId' | 'createdAt' | 'updatedAt'
    >[] = [];
    if (audioSermon.scripture != '') {
      const references = audioSermon?.scripture?.split(/[,;&]/);

      for (let reference of references) {
        reference = reference.trim();
        reference = reference.replace(/:\s+/g, ':');
        reference = reference.replace(/-\s+/g, '-');
        reference = reference.replace(/(\d+)\s*-\s*/g, '$1-');

        if (reference == '' || reference == 'Fear Of God') continue; // Skip empty references

        const parts = reference
          .split(' ')
          .filter((part: string) => part !== '');
        let book, startChapter, endChapter, startVerse, endVerse;

        if (reference.includes('Song of Solomon')) {
          book = 'Song of Solomon';
        } else if (reference.includes('Song Of Solomon')) {
          book = 'Song Of Solomon';
        } else if (parts.length === 3) {
          // The book includes a number
          book = parts[0] + ' ' + parts[1];
        } else {
          if (
            !reference.includes(':') &&
            !reference.includes('-') &&
            parts.length === 2
          ) {
            book = parts[0] + ' ' + parts[1];
          } else {
            book = parts[0];
          }
        }
        book = book.trim();

        if (reference == book) {
          // No chapters or verses specified
          bibleReferences.push({
            book: book,
            startChapter: null,
            endChapter: null,
            startVerse: null,
            endVerse: null,
            text: reference,
          });

          continue;
        }

        if (!reference.includes(':')) {
          // No verse specified
          if (!reference.includes('-')) {
            // No range specified
            startChapter = endChapter = parseInt(parts[parts.length - 1]);
          } else {
            // Range specified
            const chapters = parts[parts.length - 1].split('-');
            startChapter = parseInt(chapters[0]);
            endChapter = parseInt(chapters[1]);
          }
        }

        if (!startChapter && !endChapter) {
          // Verse specified
          const chapterVerse = reference.replace(book, '').trim().split(':');
          startChapter = endChapter = parseInt(chapterVerse[0]);

          if (chapterVerse[1].includes('-')) {
            const verses = chapterVerse[1].split('-');
            startVerse = parseInt(verses[0]);
            endVerse = parseInt(verses[1]);
          } else {
            startVerse = endVerse = parseInt(chapterVerse[1]);
          }
        }

        bibleReferences.push({
          book: book,
          startChapter: startChapter ?? null,
          endChapter: endChapter ?? null,
          startVerse: startVerse ?? null,
          endVerse: endVerse ?? null,
          text: reference,
        });
      }
    }

    const sermonId = await upsertSermon(
      contributor.contributor.id,
      topics,
      bibleReferences,
      audioSermon.title,
      audioSermon.hits,
      audioSermon.url,
      'audio',
      audioSermon.lid === featuredSermonId ? true : false,
      audioSermon.lid,
      audioSermonDescription.description,
    );
  }

  for (const videoSermon of videoSermons) {
    const contributor = findContributor(contributors, videoSermon.cid);
    if (!contributor) {
      console.log(
        `No contributor found for audio sermon id: ${videoSermon.lid} with cid ${videoSermon.cid}`,
      );
      continue;
    }

    let videoSermonDescription = findObject(
      videoSermonDescriptions,
      'lid',
      videoSermon.lid,
    );
    if (
      !videoSermonDescription ||
      !videoSermonDescription.description ||
      videoSermonDescription.description == 'nill'
    ) {
      videoSermonDescription = { description: null };
    }

    const videoSrcMatch = videoSermon.videoBlockText.match(
      /<embed[^>]+src="([^"]+)"/,
    );
    const videoSrc = videoSrcMatch ? videoSrcMatch[1] : null;

    const sermonId = await upsertSermon(
      contributor.contributor.id,
      [],
      [],
      videoSermon.title,
      videoSermon.hits,
      videoSrc,
      'video',
      videoSermon.lid === featuredSermonId ? true : false,
      videoSermon.lid,
      videoSermonDescription.description,
    );
  }

  return;
};

convertSchema().then(() => {
  console.log('done');
});
