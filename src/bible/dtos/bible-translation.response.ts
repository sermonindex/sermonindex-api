import { Book } from '@prisma/client';
import { BibleTranslationType } from 'src/bible/bible.types';

export class BibleTranslationResponseData {
  id: string;
  name: string;
  shortName: string | null;
  website: string;
  licenseUrl: string;
  language: string;
  textDirection: string;
  books: Omit<Book, 'sha256' | 'translationId' | 'commonName' | 'title'>[];
  isComplete: boolean;
}

export class BibleTranslationResponse extends BibleTranslationResponseData {
  constructor(data: BibleTranslationResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: BibleTranslationType): BibleTranslationResponse {
    return new BibleTranslationResponse({
      id: data.id,
      name: data.name,
      shortName: data.shortName,
      website: data.website,
      licenseUrl: data.licenseUrl,
      language: data.language,
      textDirection: data.textDirection,
      isComplete: data.books.length === 66,
      books: data.books.map((book) => ({
        id: book.id,
        name: book.name,
        order: book.order,
        numberOfChapters: book.numberOfChapters,
      })),
    });
  }
}
