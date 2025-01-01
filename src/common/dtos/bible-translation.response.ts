import { BibleTranslationType } from 'src/bible/bible.types';

export class BibleTranslationResponseData {
  id: string;
  name: string;
  website: string;
  licenseUrl: string;
  language: string;
  textDirection: string;
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
      website: data.website,
      licenseUrl: data.licenseUrl,
      language: data.language,
      textDirection: data.textDirection,
    });
  }
}
