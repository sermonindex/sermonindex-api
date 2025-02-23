import {
  CommentaryAuthors,
  CommentaryVerse,
} from 'src/commentary/commentary.types';

export class CommentaryVerseResponseData {
  id: string;
  name: string;
  author?: string;
  book: string;
  chapter: number;
  verse: number;
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
      id: data.commentary.id,
      name: data.commentary.name,
      author:
        CommentaryAuthors[data.commentary.id as keyof typeof CommentaryAuthors],
      text: data.text,
      contentJson: data.contentJson,
    });
  }
}
