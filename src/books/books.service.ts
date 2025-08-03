import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { BookChapterResponse } from './dtos/book-chapter.response';
import { BookInfoResponse } from './dtos/book-info.response';
import { BookRequest } from './dtos/book.request';
import { BookResponse } from './dtos/book.response';

@Injectable()
export class BooksService {
  constructor(private db: DatabaseService) {}

  async getBook(id: string) {
    const result = await this.db.publishedBook.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        mediaType: true,
        contributor: {
          select: {
            fullName: true,
            slug: true,
            imageUrl: true,
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

    if (!result) {
      throw new NotFoundException('Book not found');
    }

    return BookResponse.fromDB(result);
  }

  async getBookChapter(id: string, chapter: number) {
    const result = await this.db.publishedChapter.findUnique({
      where: { bookId_number: { bookId: id, number: chapter } },
      select: {
        title: true,
        number: true,
        text: true,
        urls: {
          select: {
            type: true,
            url: true,
            source: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Book chapter not found');
    }

    return BookChapterResponse.fromDB(result);
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
        select: {
          id: true,
          title: true,
          mediaType: true,
          contributor: {
            select: {
              slug: true,
              fullName: true,
              imageUrl: true,
            },
          },
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
