import { BibleVerseWithTranslationType } from 'src/bible/bible.types';

export class BibleVerseResponseData {
  book: string;
  chapter: number;
  verse: number;

  translationId: string;
  translationName: string;

  text: string;
  contentJson: string;
}

export class BibleVerseResponse extends BibleVerseResponseData {
  constructor(data: BibleVerseResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: BibleVerseWithTranslationType): BibleVerseResponse {
    return new BibleVerseResponse({
      book: data.bookId,
      chapter: data.chapterNumber,
      verse: data.number,
      translationId: data.translationId,
      translationName: data.translation.name,
      text: data.text,
      contentJson: data.contentJson,
    });
  }
}
