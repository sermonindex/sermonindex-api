import { PrismaClient, SermonBibleReference } from '@prisma/client';
import AwokenRef from 'awoken-bible-reference';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import { parseBibleReferences, upsertTopics } from './common';

export const insertMissingMetadata = async (prisma: PrismaClient) => {
  let failedToParseMetadataCount = 0;
  let failedToParseScriptureCount = 0;
  let failedToFindSermonCount = 0;

  // Extract the sermon metadata (ai generated from csv file)
  const rawSermonMetadata = await fs.promises.readFile(
    `prisma/data/missing_sermon_metadata_2.csv`,
    'utf8',
  );
  const rawAudioSermonMetadataRows = rawSermonMetadata.split('\n');
  const sermonMetadata = new Map();
  rawAudioSermonMetadataRows.map((row) => {
    const records = parse(row, {
      delimiter: ',',
    });
    if (!records[0]) return;

    const id = records[0][1];
    const description = records[0][2];
    const references = records[0][3];
    const topics = records[0][4];

    sermonMetadata.set(id, { description, references, topics });
  });

  // Loop through the items in the sermon metadata map
  for (const [id, metadata] of sermonMetadata) {
    try {
      let sermon = await prisma.sermon.findFirst({
        where: {
          AND: {
            originalId: id,
            originalMediaId: id,
          },
        },
      });
      if (!sermon) {
        sermon = await prisma.sermon.findFirst({
          where: {
            originalMediaId: id,
          },
        });
      }
      if (!sermon) {
        console.log(`Sermon with id ${id} not found in database`);
        failedToFindSermonCount++;
        continue;
      }

      let topics = metadata.topics
        .split(',')
        .map((topic: string) => topic.trim());
      if (topics?.length > 0) {
        topics = await upsertTopics(prisma, topics as string[]);
      }

      // Get the description
      // let metadata = sermonMetadata.get(originalId);
      let description = metadata.description;

      const bibleReferences: Omit<
        SermonBibleReference,
        'id' | 'sermonId' | 'createdAt' | 'updatedAt'
      >[] = [];
      if (metadata && metadata.references != '') {
        const references = parseBibleReferences(metadata.references);
        if (!references) {
          console.log(
            `Could not parse bible references for audio sermon: ${id}: ${metadata.references}`,
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

      await prisma.sermon.update({
        where: { id: sermon.id },
        data: {
          description: description?.trim(),
          topics: {
            connect: topics.map((name: string) => ({ name })),
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
        },
      });
    } catch (error) {
      console.error(`Error processing sermon with id ${id}:`, error);
      failedToParseMetadataCount++;
    }
  }

  console.log('Finished converting metadata. Summary:');
  console.log(`- Total items: ${sermonMetadata.size}`);
  console.log(`- Failed to find ${failedToFindSermonCount} sermons`);
  console.log(
    `- Failed to parse ${failedToParseScriptureCount} bible references`,
  );
  console.log(`- Failed to parse ${failedToParseMetadataCount} metadata items`);
};
