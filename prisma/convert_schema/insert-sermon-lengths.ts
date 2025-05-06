import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

export const insertSermonLengths = async (prisma: PrismaClient) => {
  let sermonsUpdated = 0;

  const rawSermonLengths = await fs.promises.readFile(
    `prisma/data/sermon_lengths.csv`,
    'utf8',
  );
  const rawSermonLengthsRows = rawSermonLengths.split('\n');
  const sermonLengths = new Map<string, { sermonLength: string }>();
  rawSermonLengthsRows.map((row) => {
    const records = parse(row, {
      delimiter: ',',
    });
    if (!records[0]) return;

    const originalId = records[0][0];
    const url = records[0][1];
    const seconds = records[0][2];

    sermonLengths.set(originalId, { sermonLength: seconds });
  });

  for (const [originalId, info] of sermonLengths) {
    try {
      if (!info.sermonLength) {
        console.log(`Skipping sermon length for ${originalId}`);

        continue;
      }

      const seconds = parseInt(info.sermonLength);

      const existing = await prisma.sermon.findMany({
        where: {
          originalId: originalId,
        },
      });

      if (!existing || existing.length === 0) {
        console.log(`No sermon found for ${originalId}`);

        continue;
      }

      if (existing.length > 1) {
        console.log(`Multiple sermons found for ${originalId}`);

        continue;
      }

      await prisma.sermon.update({
        where: {
          id: existing[0].id,
        },
        data: {
          length: seconds,
        },
      });
      console.log(`Updating sermon: ${originalId}`);
      sermonsUpdated++;
    } catch (error) {
      console.log(`Error parsing contributor: ${originalId}`, error);

      break;
    }
  }

  console.log(
    `Successfully updates ${sermonsUpdated} / ${sermonLengths.size} possible contributors`,
  );
};
