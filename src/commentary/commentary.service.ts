import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  AdjacentBibleChapters,
  getAdjacentBibleChapters,
} from 'src/common/adjacent-bible-chapters.fn';
import { DatabaseService } from 'src/database/database.service';
import { CommentaryChapterResponse } from './dtos/commentary-chapter.response';
import { ListCommentaryChapterResponse } from './dtos/list-commentary-chapter.response';

@Injectable()
export class CommentaryService {
  constructor(private db: DatabaseService) {}

  getCommentaries(params: { where: Prisma.CommentaryWhereInput }) {
    return this.db.commentary.findMany({
      where: params.where,
      include: {
        books: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async getCommentariesByChapter(params: {
    where: Prisma.CommentaryChapterWhereInput;
  }) {
    const { where } = params;

    const chapters = await this.db.commentaryChapter.findMany({
      where,
      include: {
        commentary: true,
        book: true,
      },
    });
    if (!chapters) return null;

    const adjacentChapters =
      chapters.length > 0
        ? getAdjacentBibleChapters(
            chapters[0].book.id,
            chapters[0].book.order,
            chapters[0].book.numberOfChapters,
            chapters[0].number,
          )
        : ({} as AdjacentBibleChapters);

    const result: ListCommentaryChapterResponse = {
      values: chapters.map((chapter) =>
        CommentaryChapterResponse.fromDB(chapter),
      ),
      ...adjacentChapters,
    };

    return result;
  }

  getCommentariesByVerse(params: {
    where: Prisma.CommentaryChapterVerseWhereInput;
    orderBy?: Prisma.CommentaryChapterVerseOrderByWithRelationInput;
  }) {
    const { where, orderBy } = params;

    return this.db.commentaryChapterVerse.findMany({
      where,
      orderBy,
      include: {
        commentary: true,
      },
    });
  }

  async getCommentaryByChapter(params: {
    where: Prisma.CommentaryChapterWhereInput;
  }) {
    const { where } = params;

    const result = await this.db.commentaryChapter.findFirst({
      where,
      include: {
        commentary: true,
        book: true,
      },
    });

    if (!result) return null;

    // We need to check if the next book exists because some commentaries are incomplete
    // TODO: Link to the next book and previous book if it exists in the database
    let nextChapter: number | null = result.number + 1;
    let nextBook: string | null = result.bookId;
    if (nextChapter > result.book.numberOfChapters) {
      const next = await this.db.commentaryBook.findFirst({
        where: {
          commentaryId: result.commentaryId,
          order: { gt: result.book.order },
        },
        orderBy: { order: 'asc' },
      });

      nextBook = next ? next.id : null;
      nextChapter = next ? 1 : null;
    }

    let previousChapter: number | null = result.number - 1;
    let previousBook: string | null = result.bookId;
    if (previousChapter < 1) {
      const previous = await this.db.commentaryBook.findFirst({
        where: {
          commentaryId: result.commentaryId,
          order: { lt: result.book.order },
        },
        orderBy: { order: 'desc' },
      });

      previousBook = previous ? previous.id : null;
      previousChapter = previous ? previous.numberOfChapters : null;
    }

    return {
      ...result,
      nextBook,
      nextChapter,
      previousBook,
      previousChapter,
    };
  }
}
