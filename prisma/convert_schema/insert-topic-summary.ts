import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

export const insertTopicSummaries = async (prisma: PrismaClient) => {
  // Extract the topic summaries (ai generated from csv file)
  const rawTopicSummaries = await fs.promises.readFile(
    `prisma/data/topic_descriptions.csv`,
    'utf8',
  );
  const rawTopicSummariesRows = rawTopicSummaries.split('\n');
  const topicSummaries = new Map<string, string>();
  rawTopicSummariesRows.map((row) => {
    const records = parse(row, {
      delimiter: ',',
    });
    if (!records[0]) return;

    const reference = records[0][1];
    const summary = records[0][2];

    topicSummaries.set(reference, summary);
  });

  for (const [reference, summary] of topicSummaries) {
    try {
      const existingTopic = await prisma.topic.findUnique({
        where: {
          name: reference,
        },
      });

      if (existingTopic?.summary) {
        console.log(`Topic summary already exists for ${reference}`);
        continue;
      }

      await prisma.topic.update({
        where: {
          name: reference,
        },
        data: {
          summary,
        },
      });
    } catch (error) {
      console.log(`Error parsing topic: ${reference}`, error);

      break;
    }
  }

  console.log(`Successfully inserted all topic summaries`);
};
