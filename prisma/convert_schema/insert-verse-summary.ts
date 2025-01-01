import { PrismaClient } from '@prisma/client';
import AwokenRef, { BibleVerse } from 'awoken-bible-reference';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

export const insertVerseSummaries = async (prisma: PrismaClient) => {
  // Extract the bible verse summaries (ai generated from csv file)
  const rawBibleVerseSummaries = await fs.promises.readFile(
    `prisma/data/bible_verse_summary.csv`,
    'utf8',
  );
  const rawBibleVerseSummariesRows = rawBibleVerseSummaries.split('\n');
  const bibleVerseSummaries = new Map<string, string>();
  rawBibleVerseSummariesRows.map((row) => {
    const records = parse(row, {
      delimiter: ',',
    });
    if (!records[0]) return;

    const reference = records[0][0];
    const summary = records[0][1];

    bibleVerseSummaries.set(reference, summary);
  });

  for (const [reference, summary] of bibleVerseSummaries) {
    try {
      const refs = AwokenRef.parseOrThrow(reference.trim());

      if (refs.length === 0 || refs.length > 1) {
        console.log(
          `Error parsing reference: ${reference}. Parsed ${refs.length} references`,
        );
        continue;
      }

      const ref = refs[0] as BibleVerse;

      const existingVerseSummary = await prisma.chapterVerseSummary.findUnique({
        where: {
          language_bookId_chapterNumber_verseNumber: {
            language: 'eng',
            bookId: ref.book,
            chapterNumber: ref.chapter,
            verseNumber: ref.verse,
          },
        },
      });

      if (existingVerseSummary) {
        console.log(`Verse summary already exists for ${reference}`);
        continue;
      }

      await prisma.chapterVerseSummary.create({
        data: {
          language: 'eng',
          bookId: ref.book,
          chapterNumber: ref.chapter,
          verseNumber: ref.verse,
          text: summary,
        },
      });
    } catch (error) {
      console.log(`Error parsing reference: ${reference}`, error);

      break;
    }
  }

  console.log(`Successfully inserted all verse summaries`);
};
