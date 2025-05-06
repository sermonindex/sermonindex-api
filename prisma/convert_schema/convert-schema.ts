import { PrismaClient } from '@prisma/client';
import { insertSermonLengths } from './insert-sermon-lengths';
// import { convertHymns } from './convert-hymns';
// import { convertAudioSermons } from './convert-audio-sermons';
// import { convertTextSermons } from './convert-text-sermons';
// import { convertVideoSermons } from './convert-video-sermons';

const prisma = new PrismaClient();

const convertSchema = async () => {
  // await convertAudioSermons(prisma);
  // await convertVideoSermons(prisma);
  // await convertTextSermons(prisma);
  // Get all the contributors with no sermons
  // const contributors = await prisma.contributor.findMany({
  //   where: {
  //     sermons: {
  //       none: {},
  //     },
  //   },
  // });
  // // Delete all contributors with no sermons
  // for (const contributor of contributors) {
  //   console.log(
  //     `Deleting contributor: ${contributor.fullName} (${contributor.id})`,
  //   );
  //   await prisma.contributor.delete({
  //     where: {
  //       id: contributor.id,
  //     },
  //   });
  // }
  // await convertImages(prisma);
  // await convertHymns(prisma);
  // await insertVerseSummaries(prisma);
  // await insertTopicSummaries(prisma);
  await insertSermonLengths(prisma);
  // await updateContributors(prisma);
  // await findMissingVideoTranscripts(prisma);
};

convertSchema().then(() => {
  console.log('done');
});
