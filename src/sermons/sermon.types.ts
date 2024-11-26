import { Prisma } from '@prisma/client';

export type SermonFullType = Prisma.SermonGetPayload<{
  include: {
    contributor: true;
    urls: true;
    bibleReferences: true;
    topics: true;
    transcript: true;
  };
}>;
