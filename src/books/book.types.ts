import { Prisma } from '@prisma/client';

export type BookType = Prisma.PublishedBookGetPayload<{
  select: {
    id: true;
    title: true;
    mediaType: true;
    contributor: {
      select: {
        fullName: true;
        slug: true;
        imageUrl: true;
      };
    };
    chapters: {
      select: {
        title: true;
        number: true;
      };
    };
  };
}>;

export type BookInfoType = Prisma.PublishedBookGetPayload<{
  select: {
    id: true;
    title: true;
    mediaType: true;
    contributor: {
      select: {
        slug: true;
        fullName: true;
        imageUrl: true;
      };
    };
  };
}>;

export type BookChapterType = Prisma.PublishedChapterGetPayload<{
  select: {
    title: true;
    number: true;
    text: true;
    urls: {
      select: {
        type: true;
        url: true;
        source: true;
      };
    };
  };
}>;
