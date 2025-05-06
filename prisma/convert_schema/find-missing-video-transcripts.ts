import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

export const findMissingVideoTranscripts = async (prisma: PrismaClient) => {
  const files = fs.readdirSync('prisma/data/video_transcripts');

  const sermons = await prisma.sermon.findMany({
    where: {
      transcript: null,
    },
  });

  for (const sermon of sermons) {
    let modifiedId = sermon.originalId?.replace(/_/g, ' ');
    let transcript = null;

    for (const file of files) {
      if (modifiedId && file.includes(modifiedId)) {
        transcript = fs.readFileSync(
          `prisma/data/video_transcripts/${file}`,
          'utf8',
        );
        break;
      }
    }

    if (transcript) {
      console.log(`Found transcript for sermon ${sermon.title}`);

      await prisma.sermon.update({
        where: {
          id: sermon.id,
        },
        data: {
          transcript: {
            create: {
              text: transcript.trim(),
            },
          },
        },
      });
    }
  }
};
