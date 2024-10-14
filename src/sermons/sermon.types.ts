import { Prisma } from '@prisma/client';

export type SermonFullType = Prisma.SermonGetPayload<{
  include: {
    contributor: true;
    bibleReferences: true;
    topics: true;
  };
}>;
