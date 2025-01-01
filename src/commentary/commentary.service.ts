import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CommentaryService {
  constructor(private db: DatabaseService) {}

  getCommentaries(params: { where: Prisma.CommentaryWhereInput }) {
    return this.db.commentary.findMany({
      where: params.where,
    });
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
}
