import {
  OSIS_BOOK_CHAPTER_COUNT,
  OSIS_BOOK_ORDER,
} from 'src/bible/bible.types';

export interface AdjacentBibleChapters {
  chapter: number;
  book: string;
  nextBook: string | null;
  nextChapter: number | null;
  previousBook: string | null;
  previousChapter: number | null;
}

export const getAdjacentBibleChapters = (
  bookId: string,
  bookNumber: number,
  numberOfChapters: number,
  chapterNumber: number,
): AdjacentBibleChapters => {
  const nextBook =
    chapterNumber + 1 <= numberOfChapters
      ? bookId
      : OSIS_BOOK_ORDER.get(bookNumber + 1);
  const previousBook =
    chapterNumber - 1 > 0 ? bookId : OSIS_BOOK_ORDER.get(bookNumber - 1);

  const nextChapter =
    nextBook === bookId ? chapterNumber + 1 : nextBook ? 1 : null;
  const previousChapter =
    previousBook === bookId
      ? chapterNumber - 1
      : previousBook
        ? OSIS_BOOK_CHAPTER_COUNT.get(previousBook)
        : null;

  return {
    chapter: chapterNumber,
    book: bookId,
    nextBook: nextBook ?? null,
    nextChapter,
    previousBook: previousBook ?? null,
    previousChapter: previousChapter ?? null,
  };
};
