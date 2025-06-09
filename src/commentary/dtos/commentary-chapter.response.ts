import {
  CommentaryAuthors,
  CommentaryChapter,
} from 'src/commentary/commentary.types';

export class CommentaryChapterResponseData {
  id: string;
  name: string;
  author?: string;

  book: string;
  chapter: number;

  nextChapter?: number | null;
  nextBook?: string | null;
  previousChapter?: number | null;
  previousBook?: string | null;

  introduction: string | null;
  contentJson: string;
}

export class CommentaryChapterResponse extends CommentaryChapterResponseData {
  constructor(data: CommentaryChapterResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: CommentaryChapter): CommentaryChapterResponse {
    return new CommentaryChapterResponse({
      book: data.bookId,
      chapter: data.number,

      id: data.commentary.id,
      name: data.commentary.name,
      author:
        CommentaryAuthors[data.commentary.id as keyof typeof CommentaryAuthors],
      introduction: data.introduction,
      contentJson: data.json,

      nextChapter: data.nextChapter,
      nextBook: data.nextBook,
      previousChapter: data.previousChapter,
      previousBook: data.previousBook,
    });
  }
}
