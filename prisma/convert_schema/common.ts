import { PrismaClient, SermonBibleReference, SermonUrl } from '@prisma/client';
import AwokenRef, { BibleRef } from 'awoken-bible-reference';
import * as fs from 'fs';
import { JSDOM } from 'jsdom';

const toTitleCase: any = require('titlecase');

export function extractTextBetween(
  input: string,
  startText: string,
  endTag: string,
): string | null {
  const regex = new RegExp(`${startText}(.*?)${endTag}`, 's');
  const match = input.match(regex);
  return match ? match[1].trim() : null;
}

export const findObject = <T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  value: any,
): any => {
  return array.find((obj) => obj[key] === value);
};

export const findContributorId = (
  id: number,
  contributors: Map<number, number[]>,
) => {
  for (const [contributorId, textContributorIds] of contributors) {
    if (textContributorIds.includes(id)) {
      return contributorId;
    }
  }
  return null;
};

export const findVideoTranscript = (videoId: string) => {
  // Loop through all the files in the video_transcripts directory
  const files = fs.readdirSync('prisma/data/video_transcripts');
  for (const file of files) {
    if (file.includes(videoId)) {
      return fs.readFileSync(`prisma/data/video_transcripts/${file}`, 'utf8');
    }
  }

  return undefined;
};

export const upsertTopics = async (
  prisma: PrismaClient,
  topics: string[],
): Promise<string[]> => {
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

export const upsertSermon = async (
  prisma: PrismaClient,
  contributorId: number,
  topics: string[],
  bibleReferences: Omit<
    SermonBibleReference,
    'id' | 'sermonId' | 'createdAt' | 'updatedAt'
  >[],
  title: string,
  hits: string,
  urls: Omit<SermonUrl, 'id' | 'sermonId'>[],
  featured: boolean,
  transcript?: string,
  originalId?: string,
  description?: string,
) => {
  const t = toTitleCase(title.trim().toLowerCase());

  const existingSermon = await prisma.sermon.findFirst({
    where: {
      title: t,
      contributorId: contributorId,
    },
  });

  if (existingSermon) {
    // const sermonUrls = await prisma.sermonUrl.findMany({
    //   where: {
    //     sermonId: existingSermon.id,
    //   },
    // });

    // for (const u of urls) {
    //   const existingUrl = sermonUrls.find((url) => url.url === u.url);
    //   if (!existingUrl) {
    //     await prisma.sermonUrl.create({
    //       data: {
    //         sermonId: existingSermon.id,
    //         url: u.url,
    //         type: u.type,
    //         source: u.source,
    //       },
    //     });
    //   }
    // }

    return null;
  }

  const newSermon = await prisma.sermon.create({
    data: {
      originalId,
      title: t,
      hits: parseInt(hits),
      description: description?.trim(),
      contributorId: contributorId,
      featured: featured,
      transcript: transcript
        ? {
            create: {
              text: transcript.trim(),
            },
          }
        : undefined,
      topics: {
        connect: topics.map((name) => ({ name })),
      },
      bibleReferences: {
        create: bibleReferences.map((reference) => ({
          bookId: reference.bookId,
          startChapter: reference.startChapter,
          endChapter: reference.endChapter,
          startVerse: reference.startVerse,
          endVerse: reference.endVerse,
          text: reference.text,
        })),
      },
      urls: {
        create: urls.map((url) => ({
          url: url.url,
          type: url.type,
          source: url.source,
        })),
      },
    },
  });

  return newSermon.id;
};

export async function getArchiveAudioUrl(lid: number, oldUrl: string) {
  // const url = `https://www.sermonindex.net/modules/mydownloads/visit.php?lid=${lid}`;

  // const result = await fetch(url, { redirect: 'manual' });
  // if (result.status === 302) {
  //   const redirectUrl = result.headers.get('Location');
  //   return redirectUrl;
  // } else {
  const match = oldUrl.match(/(SID[0-9]{4,5})(.[a-zA-Z0-9]{3})$/);

  if (match) {
    return `http://archive.org/download/SERMONINDEX_${match[1]}/${match[1]}${match[2]}`;
  }

  console.log(`WARNING: No match for ${lid}. Using old url: ${oldUrl}`);
  return oldUrl;
  // }
}

export async function getTextSermons(id: number) {
  const url = `https://www.sermonindex.net/modules/articles/index.php?view=article&aid=${id}`;
  const html = await (await fetch(url)).text();

  const dom = new JSDOM(html);
  const document = dom.window.document;

  let table = document.querySelector('table.bg1');
  if (table) {
    let firstAnchor = document.querySelector(
      `a[href="https://img.sermonindex.net/modules/articles/article_pdf.php?aid=${id}"]`,
    );

    let content = [];

    let currentNode: any = firstAnchor;
    while (currentNode) {
      if (currentNode.textContent == 'Open as PDF') {
        currentNode = currentNode.nextSibling;
        continue;
      }

      content.push(currentNode.textContent);
      currentNode = currentNode.nextSibling;
    }

    return content.join(' ').trim();
  }

  return undefined;
}

export function parseBibleReferences(text: string) {
  let refs: BibleRef[] = [];

  try {
    refs = AwokenRef.parseOrThrow(text.trim());
  } catch (error) {
    try {
      const split = text.split('-');
      refs = AwokenRef.parseOrThrow(split[0].trim());
    } catch (error) {
      try {
        const s = text.replace(/,/g, ';');
        refs = AwokenRef.parseOrThrow(s);
      } catch (error) {
        // console.log(`Error parsing reference: ${text}`, error);

        return;
      }
    }
  }

  try {
    const all = AwokenRef.format(refs, {
      combine_ranges: true,
    });

    let references: string[] = [];
    all.split(';').map((ref) => {
      const verses = ref.split(':')[1].split(',');
      const r = AwokenRef.parseOrThrow(ref.trim());
      if (r[0].is_range || verses.length < 3) {
        references.push(`${ref}`);
      } else {
        references.push(
          `${r[0]?.book} ${r[0].chapter}:${verses[0]}-${verses[verses.length - 1]}`,
        );
      }
    });

    return AwokenRef.parseOrThrow(references.join(';'));
  } catch (error) {
    // console.log(`Error formatting reference: ${text}`, error);
    return;
  }
}
