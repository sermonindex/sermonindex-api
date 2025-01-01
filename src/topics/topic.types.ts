import { Prisma } from '@prisma/client';

export type TopicInfoType = Prisma.TopicGetPayload<{
  include: {
    _count: {
      select: { sermons: true };
    };
  };
}>;

export type TopicFullType = Prisma.TopicGetPayload<{
  include: {
    sermons: {
      include: {
        contributor: true;
        urls: true;
        bibleReferences: true;
      };
    };
  };
}>;
