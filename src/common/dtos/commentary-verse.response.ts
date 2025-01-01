import {
  CommentaryAuthors,
  CommentaryVerse,
} from 'src/commentary/commentary.types';

export class CommentaryVerseResponseData {
  book: string;
  chapter: number;
  verse: number;

  commentaryId: string;
  commentaryName: string;
  commentaryAuthor?: string;

  text: string;
  contentJson: string;
}

export class CommentaryVerseResponse extends CommentaryVerseResponseData {
  constructor(data: CommentaryVerseResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: CommentaryVerse): CommentaryVerseResponse {
    return new CommentaryVerseResponse({
      book: data.bookId,
      chapter: data.chapterNumber,
      verse: data.number,
      commentaryId: data.commentary.id,
      commentaryName: data.commentary.name,
      commentaryAuthor:
        CommentaryAuthors[data.commentary.id as keyof typeof CommentaryAuthors],
      text: data.text,
      contentJson: data.contentJson,
    });
  }
}
