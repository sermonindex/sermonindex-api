import { PrismaClient } from '@prisma/client';

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
  // await convertBooks(prisma);
  // await convertTextSermonsToBooks(prisma);
  // await convertAdhocTextSermonsToBooks(prisma);
  // await convertAudioBooks(prisma);
  // await insertVerseSummaries(prisma);
  // await insertTopicSummaries(prisma);
  // await insertSermonLengths(prisma);
  // await insertHymnLengths(prisma);
  // await updateContributors(prisma);
  // await findMissingVideoTranscripts(prisma);
  // await addFeaturedContributors(prisma);
};

convertSchema().then(() => {
  console.log('done');
});
