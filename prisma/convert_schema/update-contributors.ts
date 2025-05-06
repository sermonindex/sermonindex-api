import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

export const updateContributors = async (prisma: PrismaClient) => {
  let contributorsUpdate = 0;

  const rawContributors = await fs.promises.readFile(
    `prisma/data/all_contributors.csv`,
    'utf8',
  );
  const rawContributorsRows = rawContributors.split('\n');
  const contributors = new Map<
    string,
    { imageName: string; description: string }
  >();
  rawContributorsRows.map((row) => {
    // console.log(row);
    const records = parse(row, {
      delimiter: ',',
    });
    if (!records[0]) return;

    const slug = records[0][2];
    const description = records[0][3];
    const imageName = records[0][4];

    contributors.set(slug, { imageName, description });
  });

  for (const [slug, info] of contributors) {
    try {
      if (!info.imageName && !info.description) {
        continue;
      }

      await prisma.contributor.update({
        where: {
          fullNameSlug: slug,
        },
        data: {
          imageUrl: info.imageName ?? null,
          description: info.description ?? null,
        },
      });
      //   console.log(`Updating contributor: ${slug}`);
      contributorsUpdate++;
    } catch (error) {
      console.log(`Error parsing contributor: ${slug}`, error);

      break;
    }
  }

  console.log(
    `Successfully updates ${contributorsUpdate} / ${contributors.size} possible contributors`,
  );
};
