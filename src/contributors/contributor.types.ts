import { Prisma } from '@prisma/client';

export enum ContributorContent {
  Sermons = 'SERMONS',
  Hymns = 'HYMNS',
}

export type ContributorFullType = Prisma.ContributorGetPayload<{
  include: {
    _count: {
      select: {
        sermons: true;
        hymns: true;
      };
    };
    images: true;
  };
}>;
