import { Prisma } from '@prisma/client';

export enum ContributorSortBy {
  FullName = 'fullName',
  Sermons = 'sermons',
}

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
