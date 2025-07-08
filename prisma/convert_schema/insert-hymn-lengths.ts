import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

export const insertHymnLengths = async (prisma: PrismaClient) => {
  let hymnsUpdated = 0;

  const rawHymnLengths = await fs.promises.readFile(
    `prisma/data/hymn_lengths.csv`,
    'utf8',
  );
  const rawHymnLengthsRows = rawHymnLengths.split('\n');
  const hymnLengths = new Map<string, { hymnLength: string }>();
  rawHymnLengthsRows.map((row) => {
    const records = parse(row, {
      delimiter: ',',
    });
    if (!records[0]) return;

    const originalId = records[0][1];
    const seconds = records[0][3];

    hymnLengths.set(originalId, { hymnLength: seconds });
  });

  for (const [originalId, info] of hymnLengths) {
    try {
      if (!info.hymnLength) {
        console.log(`Skipping hymn length for ${originalId}`);

        continue;
      }

      const seconds = parseInt(info.hymnLength);

      const existing = await prisma.hymn.findMany({
        where: {
          originalMediaId: originalId,
        },
      });

      if (!existing || existing.length === 0) {
        console.log(`No hymn found for ${originalId}`);

        continue;
      }

      if (existing.length > 1) {
        console.log(`Multiple hymns found for ${originalId}`);

        continue;
      }

      await prisma.hymn.update({
        where: {
          id: existing[0].id,
        },
        data: {
          duration: seconds,
        },
      });
      console.log(`Updating hymn: ${originalId}`);
      hymnsUpdated++;
    } catch (error) {
      console.log(`Error parsing contributor: ${originalId}`, error);

      break;
    }
  }

  console.log(
    `Successfully updates ${hymnsUpdated} / ${hymnLengths.size} possible hymns`,
  );
};
