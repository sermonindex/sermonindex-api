import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommentaryVerseResponse } from 'src/common/dtos/commentary-verse.response';
import { CommentaryService } from './commentary.service';

@Controller('commentary')
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @Get('/')
  async getCommentaryBooks(@Query('language') language: string) {
    const result = await this.commentaryService.getCommentaries({
      where: {
        language: language,
      },
    });

    return result;
  }

  @Get('/:language/:book/:chapter/:verse')
  async getCommentariesByVerse(
    @Param('language') language: string,
    @Param('book') book: string,
    @Param('chapter') chapter: number,
    @Param('verse') verse: number,
  ) {
    const result = await this.commentaryService.getCommentariesByVerse({
      where: {
        commentary: {
          language: language,
        },
        bookId: book,
        chapterNumber: chapter,
        number: verse,
      },
      orderBy: {
        commentary: {
          name: 'asc',
        },
      },
    });

    return {
      values: result.map((verse) => CommentaryVerseResponse.fromDB(verse)),
    };
  }
}
