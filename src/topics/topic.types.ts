import { Prisma } from '@prisma/client';

export type TopicInfoType = Prisma.TopicGetPayload<{
  include: {
    _count: {
      select: { sermon: true };
    };
  };
}>;

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
