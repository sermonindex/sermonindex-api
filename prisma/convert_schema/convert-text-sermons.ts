import { MediaType, PrismaClient, SermonBibleReference } from '@prisma/client';
import AwokenRef from 'awoken-bible-reference';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import {
  extractTextBetween,
  findContributorId,
  getTextSermons,
  parseBibleReferences,
  upsertSermon,
} from './common';
import {
  partialTextSermonTitlesToIgnore,
  textContributorIdsToIgnore,
  textContributorNamesToIgnore,
  textSermonsToIgnore,
} from './constants';

export const convertTextSermons = async (prisma: PrismaClient) => {
  const uniqueContributors: Map<number, number[]> = new Map();
  const contributorIdsToSkip: number[] = [];

  let missingTranscriptCount = 0;
  let missingMetadataCount = 0;
  let failedToParseScriptureCount = 0;
  let duplicateSermonCount = 0;

  const textContributors = JSON.parse(
    fs.readFileSync('prisma/data/xoops_sermon_category.json', 'utf8'),
  ).xoops_sermon_category;
  const textSermons = JSON.parse(
    fs.readFileSync('prisma/data/xoops_sermon_text.json', 'utf8'),
  ).xoops_sermon_text;

  // Extract the text sermon descriptions (ai generated from csv file)
  const rawTextSermonDescriptions = await fs.promises.readFile(
    `prisma/data/text_sermon_metadata.csv`,
    'utf8',
  );
  const rawTextSermonDescriptionRows = rawTextSermonDescriptions.split('\n');
  const textSermonMetadata = new Map();
  rawTextSermonDescriptionRows.map((row) => {
    const records = parse(row, { delimiter: ',' });
    if (!records[0]) return;

    const id = records[0][0];
    const description = records[0][1];
    const references = records[0][2];

    textSermonMetadata.set(id, { description, references });
  });

  const textSermonIdsToIgnore = textSermonsToIgnore.map((sermon) => sermon.id);

  for (const textContributor of textContributors) {
    // Check if text contributor is in the list of text contributors to ignore
    if (
      textContributorIdsToIgnore.includes(textContributor.id) ||
      textContributorNamesToIgnore.includes(textContributor.name)
    ) {
      console.log(
        `Skipping text contributor: Name: ${textContributor.name}, ID ${textContributor.id}`,
      );

      contributorIdsToSkip.push(textContributor.id);

      continue;
    }

    const fullNameSlug = textContributor.name
      .toLowerCase()
      .replace(/  /g, ' ')
      .replace(/ /g, '-')
      .replace(/\./g, '');

    const fullName = textContributor.name.replace(/  /g, ' ');

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
          ? [...existingIds, textContributor.id]
          : [textContributor.id],
      );

      continue;
    }

    // Extract the src attribute from the <img> tag
    const imgSrcMatch = textContributor.description.match(
      /<img[^>]+src="([^"]+)"/,
    );
    let imgSrc = imgSrcMatch ? imgSrcMatch[1] : null;
    imgSrc =
      imgSrc?.replace('img.sermonindex.net', 'sermonindex3.b-cdn.net') ?? null;

    // Just get the bulk of the description for now. We can parse the rest later.
    let description = extractTextBetween(
      textContributor.description,
      '</h1>',
      '<br>',
    );
    description = description?.replace(/<a[^>]*>(.*?)<\/a>/g, '$1') ?? null;
    description = description?.replace('<p>', '') ?? null;
    description =
      description?.replace(
        /Read freely text sermons and articles by the speaker [\w\s.,'"]+ in text and pdf format\./,
        '',
      ) ?? null;

    const c = await prisma.contributor.create({
      data: {
        fullNameSlug,
        fullName: fullName,
        description: description,
        imageUrl: imgSrc,
      },
    });
    uniqueContributors.set(c.id, [textContributor.id]);
  }

  for (const textSermon of textSermons) {
    try {
      if (textSermon.id === 39742 || textSermon.id === 39770) {
        // The encoding on these two sermons breaks writing to console
        // We skip them anyway because they are apart of a book
        continue;
      }

      if (contributorIdsToSkip.includes(textSermon.category_id)) {
        continue;
      }

      let skipTextSermon = false;
      for (const partialTitle of partialTextSermonTitlesToIgnore) {
        if (textSermon.title.includes(partialTitle)) {
          skipTextSermon = true;
          break;
        }
      }
      if (skipTextSermon) {
        console.log(
          `Skipping text sermon: Title: ${textSermon.title}, ID ${textSermon.id}`,
        );
        continue;
      }

      if (textSermonIdsToIgnore.includes(textSermon.id)) {
        console.log(
          `Skipping text sermon: Title: "${textSermon.title}", ID ${textSermon.id}`,
        );
        continue;
      }

      const contributorId = findContributorId(
        textSermon.category_id,
        uniqueContributors,
      );
      if (!contributorId) {
        console.log(
          `Could not find contributor ID for text sermon: ${textSermon.title}`,
        );
        continue;
      }

      // const s = await prisma.sermon.findFirst({
      //   where: {
      //     originalId: textSermon.id.toString(),
      //   },
      // });
      // if (s) {
      //   continue;
      // }

      // Get the title and fix encodings
      let title = textSermon.title;
      title = title.replace(/â€™/g, "'");
      title = title.replace(/â€”/g, '-');
      title = title.replace(/â€“/g, '-');
      title = title.replace(/â€œ/g, '"');
      title = title.replace(/â€‹/g, '');
      title = title.replace(/â€/g, '"');
      title = title.replace(/Â/g, '');
      title = title.replace(/”/g, '"');
      title = title.replace(/“/g, '"');
      title = title.replace(/´/g, "'");
      title = title.replace(/\\/g, '');

      const contributor = await prisma.contributor.findUnique({
        where: {
          id: contributorId,
        },
      });
      if (contributor) {
        if (title.includes(`by ${contributor.fullName}`)) {
          title = title.replace(`by ${contributor.fullName}`, '');
        } else if (title.includes(`By ${contributor.fullName}`)) {
          title = title.replace(`By ${contributor.fullName}`, '');
        }
      }

      // Get the description
      let metadata = textSermonMetadata.get(String(textSermon.id));
      let description = null;
      if (!metadata) {
        // Too many of these to log
        // console.log(
        //   `Could not find metadata for sermon ${textSermon.id}, ${textSermon.title}`,
        // );
        missingMetadataCount++;
      } else {
        description = metadata.description;
      }

      // Get the transcript
      let transcript = textSermon.body as string | undefined;
      try {
        if (
          transcript &&
          (transcript.includes('â') || transcript.includes('×'))
        ) {
          // Too many of these to log
          // console.log(
          //   `Found special characters in transcript: id ${textSermon.id}, title: ${textSermon.title}`,
          // );
          transcript = await getTextSermons(textSermon.id);
        }
      } catch (e) {
        console.log(
          `WARNING: Failed to get clean transcript: id: ${textSermon.id}, title: ${textSermon.title}`,
        );
        missingTranscriptCount++;
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
            `Could not parse bible references for audio sermon: "${textSermon.title}", ${metadata.references}, ${textSermon.id}`,
          );
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

      if (transcript?.includes('\\')) {
        transcript = transcript.replace(/\\/g, '');
      }

      const sermonId = await upsertSermon(
        prisma,
        contributorId,
        [],
        bibleReferences,
        title,
        '0',
        [],
        false,
        MediaType.TEXT,
        transcript,
        textSermon.id.toString(),
        description ?? null,
      );

      if (!sermonId) {
        duplicateSermonCount++;
      }
    } catch (e) {
      console.log(`Failed to convert text sermon: ${textSermon.id}`);
      console.log(e);
    }
  }

  console.log('Finished converting text sermons. Summary:');
  console.log(`- Duplicate sermons found: ${duplicateSermonCount}`);
  console.log(`- Failed to clean ${missingTranscriptCount} sermons`);
  console.log(`- No ai data found for ${missingMetadataCount} sermons`);
  console.log(
    `- Failed to parse ${failedToParseScriptureCount} bible references`,
  );
};

//A Bottle in the Ocean
//AW TOZER
