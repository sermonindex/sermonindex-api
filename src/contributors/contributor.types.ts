import { Prisma } from '@prisma/client';

export enum ContributorSortBy {
  FullName = 'fullName',
  Sermons = 'sermons',
}

export type ContributorInfoType = Prisma.ContributorGetPayload<{
  include: {
    _count: {
      select: {
        sermons: true;
        hymns: true;
        books: true;
      };
    };
  };
}>;

export type ContributorFullType = Prisma.ContributorGetPayload<{
  include: {
    _count: {
      select: {
        sermons: true;
        hymns: true;
        books: true;
      };
    };
    images: true;
  };
}>;
