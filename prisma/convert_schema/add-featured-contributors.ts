import { PrismaClient } from '@prisma/client';
import { featuredContributors } from './constants';

export const addFeaturedContributors = async (prisma: PrismaClient) => {
  for (const featuredContributor of featuredContributors) {
    console.log(featuredContributor);

    const existingContributor = await prisma.contributor.findFirst({
      where: {
        fullName: featuredContributor,
      },
    });

    if (!existingContributor) {
      console.log(`No contributor found for ${featuredContributor}`);
      continue;
    }

    await prisma.featuredContributor.create({
      data: {
        contributorId: existingContributor.id,
        content: 'SERMONS',
      },
    });
  }

  console.log('Successfully added featured contributors');
};
