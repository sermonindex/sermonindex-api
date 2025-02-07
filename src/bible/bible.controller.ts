import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import { BibleTranslationRequest } from 'src/common/dtos/bible-translation.request';
import { BibleTranslationResponse } from 'src/common/dtos/bible-translation.response';
import { BibleVerseRequest } from 'src/common/dtos/bible-verse.request';
import { ListBibleLanguageResponse } from 'src/common/dtos/list-bible-language.response';
import { ListBibleTranslationResponse } from 'src/common/dtos/list-bible-translation.response';
import { BibleService } from './bible.service';

@Controller('bible')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get('/languages')
  async getLanguages(): Promise<ListBibleLanguageResponse> {
    const result = await this.bibleService.getLanguages();

    return {
      values: result.map((data) => data.language),
    };
  }

  @Get('/translations')
  async getTranslations(
    @Query() query: BibleTranslationRequest,
  ): Promise<ListBibleTranslationResponse> {
    const result = await this.bibleService.getTranslations({
      where: {
        language: query.language,
      },
    });

    return {
      values: result.map((translation) =>
        BibleTranslationResponse.fromDB(translation),
      ),
    };
  }

  @Get('/:language/:translation')
  async getTranslation(
    @Param('language') language: string,
    @Param('translation') translation: string,
  ) {
    const result = await this.bibleService.getTranslation({
      where: {
        language,
        shortName: translation,
      },
    });

    if (!result) {
      throw NotFoundException;
    }

    return BibleTranslationResponse.fromDB(result);
  }

  @Get('/:language/parallel/:book/:chapter/:verse')
  async getParallel(
    @Param('language') language: string,
    @Param('book') book: string,
    @Param('chapter') chapter: number,
    @Param('verse') verse: number,
    @Query() query: BibleVerseRequest,
  ) {
    const result = await this.bibleService.getParallel(
      language,
      book,
      chapter,
      verse,
      query,
    );

    if (!result) {
      throw NotFoundException;
    }

    return result;
  }

  @Get('/:language/:translation/:book/:chapter/:verse')
  async getVerse(
    @Param('language') language: string,
    @Param('translation') translation: string,
    @Param('book') book: string,
    @Param('chapter') chapter: number,
    @Param('verse') verse: number,
  ) {
    const result = this.bibleService.getVerse(
      language,
      book,
      chapter,
      verse,
      translation,
    );

    if (!result) {
      throw NotFoundException;
    }

    return result;
  }

  @Get('/:language/:translation/:book/:chapter')
  async getChapter(
    @Param('language') language: string,
    @Param('translation') translation: string,
    @Param('book') book: string,
    @Param('chapter') chapter: number,
  ) {
    const result = this.bibleService.getChapter({
      where: {
        translation: {
          language,
          shortName: translation,
        },
        bookId: book,
        number: chapter,
      },
    });

    if (!result) {
      throw NotFoundException;
    }

    return result;
  }
}
