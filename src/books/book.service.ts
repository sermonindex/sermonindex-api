import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ChapterResponse } from './dtos/book-chapter.response';
import { BookRequest } from './dtos/book.request';

@Injectable()
export class BookService {
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
    const { title, contributorId, contributorSlug, contributorFullName } = query;

    return this.db.publishedBook.findMany({
      where: {
        title: { contains: title, mode: 'insensitive' },
        contributor: {
          id: contributorId,
          slug: contributorSlug,
          fullName: contributorFullName,
        },
      },
      include: {
        contributor: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
  }
}
