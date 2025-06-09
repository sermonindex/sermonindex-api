import { CommentaryBook } from '@prisma/client';
import {
  CommentaryAuthors,
  CommentaryType,
} from 'src/commentary/commentary.types';

export class CommentaryResponseData {
  id: string;
  name: string;
  author?: string;
  website: string;
  licenseUrl: string;
  language: string;
  textDirection: string;
  books: Omit<CommentaryBook, 'sha256' | 'commentaryId' | 'commonName'>[];
  isComplete: boolean;
}

export class CommentaryResponse extends CommentaryResponseData {
  constructor(data: CommentaryResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: CommentaryType): CommentaryResponse {
    return new CommentaryResponse({
      id: data.id,
      name: data.name,
      author: CommentaryAuthors[data.id as keyof typeof CommentaryAuthors],
      website: data.website,
      licenseUrl: data.licenseUrl,
      language: data.language,
      textDirection: data.textDirection,
      isComplete: data.books.length === 66,
      books: data.books.map((book) => ({
        id: book.id,
        name: book.name,
        introduction: book.introduction,
        order: book.order,
        numberOfChapters: book.numberOfChapters,
      })),
    });
  }
}
