import { Prisma } from '@prisma/client';

export type TopicFullType = Prisma.TopicGetPayload<{
  include: {
    sermon: {
      include: {
        contributor: true;
        urls: true;
        bibleReferences: true;
      };
    };
  };
}>;
