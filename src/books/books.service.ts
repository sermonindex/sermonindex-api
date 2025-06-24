import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ChapterResponse } from './dtos/book-chapter.response';
import { BookRequest } from './dtos/book.request';
import { BookInfoResponse } from './dtos/book.response';

@Injectable()
export class BooksService {
  constructor(private db: DatabaseService) {}

  async getBook(id: string) {
    return this.db.publishedBook.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        contributor: {
          select: {
            fullName: true,
          },
        },
        chapters: {
          select: {
            title: true,
            number: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
    });
  }

  async getBookChapter(id: string, chapter: number) {
    const result = await this.db.publishedChapter.findUnique({
      where: { bookId_number: { bookId: id, number: chapter } },
      include: { urls: true },
    });

    if (!result) {
      throw new NotFoundException('Book chapter not found');
    }

    return ChapterResponse.fromDB(result);
  }

  async getBooks(query: BookRequest) {
    const {
      title,
      contributorId,
      contributorSlug,
      contributorFullName,
      mediaType,
      limit = 25,
      offset = 0,
    } = query;

    const where: Prisma.PublishedBookWhereInput = {
      title: { contains: title, mode: 'insensitive' },
      contributor: {
        id: contributorId,
        slug: contributorSlug,
        fullName: contributorFullName,
      },
      mediaType: { in: mediaType },
    };

    const [result, totalCount] = await this.db.$transaction([
      this.db.publishedBook.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy: { title: 'asc' },
        include: {
          contributor: true,
        },
      }),
      this.db.publishedBook.count({ where }),
    ]);

    return {
      values: result.map((book) => BookInfoResponse.fromDB(book)),
      total: totalCount,
      limit,
      offset,
      nextPage: totalCount > offset + limit ? offset + limit : null,
    };
  }
}
