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

export type CommentaryVerse = Prisma.CommentaryChapterVerseGetPayload<{
  include: {
    commentary: true;
  };
}>;
