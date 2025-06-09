import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CommentaryService } from './commentary.service';
import { CommentaryChapterResponse } from './dtos/commentary-chapter.response';
import { CommentaryVerseResponse } from './dtos/commentary-verse.response';
import { CommentaryResponse } from './dtos/commentary.response';
import { ListCommentaryResponse } from './dtos/list-commentary.response';

@Controller('commentary')
@ApiExcludeController()
export class CommentaryController {
  constructor(private readonly commentaryService: CommentaryService) {}

  @Get('/')
  async getCommentaryBooks(
    @Query('language') language: string,
  ): Promise<ListCommentaryResponse> {
    const result = await this.commentaryService.getCommentaries({
      where: {
        language: language,
      },
    });

    return {
      values: result.map((commentary) => CommentaryResponse.fromDB(commentary)),
    };
  }

  @Get('/:language/parallel/:book/:chapter')
  async getCommentariesByChapter(
    @Param('language') language: string,
    @Param('book') book: string,
    @Param('chapter') chapter: number,
  ) {
    const result = await this.commentaryService.getCommentariesByChapter({
      where: {
        commentary: {
          language: language,
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

  @Get('/:language/parallel/:book/:chapter/:verse')
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

    if (!result) {
      throw NotFoundException;
    }

    return {
      values: result.map((verse) => CommentaryVerseResponse.fromDB(verse)),
    };
  }

  @Get('/:language/:commentaryId/:book/:chapter')
  async getCommentaryByChapter(
    @Param('language') language: string,
    @Param('commentaryId') commentaryId: string,
    @Param('book') book: string,
    @Param('chapter') chapter: number,
  ) {
    const result = await this.commentaryService.getCommentaryByChapter({
      where: {
        commentary: {
          language: language,
          id: commentaryId,
        },
        bookId: book,
        number: chapter,
      },
    });

    if (!result) {
      throw NotFoundException;
    }

    return CommentaryChapterResponse.fromDB(result);
  }
}
