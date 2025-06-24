import { Prisma } from '@prisma/client';

export type BookInfoType = Prisma.PublishedBookGetPayload<{
  include: {
    contributor: true;
  };
}>;

export type ChapterType = Prisma.PublishedChapterGetPayload<{
  include: {
    urls: true;
  };
}>;
