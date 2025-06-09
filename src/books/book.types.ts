import { Prisma } from '@prisma/client';

export type ChapterType = Prisma.PublishedChapterGetPayload<{
  include: {
    urls: true;
  };
}>;
