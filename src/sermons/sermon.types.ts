import { Prisma } from '@prisma/client';

export enum SermonSortBy {
  Views = 'views',
  CreatedAt = 'createdAt',
}

export type SermonInfoType = Omit<SermonFullType, 'transcript'>;

export type SermonFullType = Prisma.SermonGetPayload<{
  include: {
    contributor: true;
    urls: true;
    bibleReferences: true;
    topics: true;
    transcript: true;
  };
}>;
