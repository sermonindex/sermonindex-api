import { Prisma } from '@prisma/client';

export enum TopicSortBy {
  Name = 'name',
  Sermons = 'sermons',
}

export type TopicInfoType = Prisma.TopicGetPayload<{
  include: {
    _count: {
      select: { sermons: true };
    };
  };
}>;

export type TopicFullType = Prisma.TopicGetPayload<{
  include: {
    _count: {
      select: { sermons: true };
    };
  };
}>;
