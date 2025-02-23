import { Prisma } from '@prisma/client';

// TODO: Put the author names in the Commentary table
export enum CommentaryAuthors {
  ['adam-clarke'] = 'Adam Clarke',
  ['jamieson-fausset-brown'] = 'Jamieson-Fausset-Brown',
  ['john-gill'] = 'John Gill',
  ['keil-delitzsch'] = 'Keil-Delitzsch',
  ['matthew-henry'] = 'Matthew Henry',
  ['tyndale'] = 'Tyndale',
}

export type CommentaryType = Prisma.CommentaryGetPayload<{
  include: {
    books: true;
  };
}>;

export type CommentaryChapter = Prisma.CommentaryChapterGetPayload<{
  include: {
    commentary: true;
    book: true;
  };
}> & {
  // TODO: add these as columns in the database
  nextChapter?: number | null;
  nextBook?: string | null;
  previousChapter?: number | null;
  previousBook?: string | null;
};

export type CommentaryVerse = Prisma.CommentaryChapterVerseGetPayload<{
  include: {
    commentary: true;
  };
}>;
