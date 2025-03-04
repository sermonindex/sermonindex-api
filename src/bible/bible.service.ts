import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BibleVerseRequest } from 'src/common/dtos/bible-verse.request';
import { BibleVerseResponse } from 'src/common/dtos/bible-verse.response';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BibleService {
  constructor(private db: DatabaseService) {}

  getVerseContext(targetVerse: number, data: any) {
    // Initialize an array to store the result
    let result: any[] = [];

    // Extract the content array from the JSON
    const content = data.content;

    // Variables to track current heading and verses
    let currentHeading = null;
    let previousVerse = null;
    let nextVerse = null;

    // Loop through the content array to find the relevant heading and verses
    for (let i = 0; i < content.length; i++) {
      const item = content[i];

      // Check for headings
      if (item.type === 'heading') {
        currentHeading = item; // Update current heading
      }

      // Check for verses
      if (item.type === 'verse' && item.number === targetVerse) {
        // Add the current heading to the result
        result.push(currentHeading);

        // Add the previous verse if it exists
        if (previousVerse && previousVerse.number === targetVerse - 1) {
          result.push(previousVerse);
        }

        // Add the target verse itself
        result.push(item);

        // Add the next verse if it exists and belongs to the same heading
        if (
          i + 1 < content.length &&
          content[i + 1].type === 'verse' &&
          content[i + 1].number === targetVerse + 1
        ) {
          nextVerse = content[i + 1];
          result.push(nextVerse);
        }

        break; // We found the target verse, no need to continue looping
      }

      // Update the previous verse for the next iteration
      if (item.type === 'verse') {
        previousVerse = item;
      }
    }

    return result;
  }

  async getLanguages() {
    return this.db.translation.findMany({
      distinct: ['language'],
      select: {
        language: true,
      },
    });
  }

  async getTranslations(params: { where?: Prisma.TranslationWhereInput }) {
    const { where } = params;

    return this.db.translation.findMany({
      where,
      include: { books: { orderBy: { order: 'asc' } } },
    });
  }

  async getTranslation(params: { where: Prisma.TranslationWhereInput }) {
    const { where } = params;

    return this.db.translation.findFirst({
      where,
      include: {
        books: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async searchVerses(params: {
    take?: number;
    where: Prisma.ChapterVerseWhereInput;
  }) {
    const { where, take } = params;

    return this.db.chapterVerse.findMany({
      where,
      take,
      include: {
        translation: true,
      },
    });
  }

  async getParallel(
    language: string,
    book: string,
    chapter: number,
    verse: number,
    query: BibleVerseRequest,
  ) {
    const verses = await this.db.chapterVerse.findMany({
      where: {
        translationId: {
          in: query.translations,
        },
        // TODO: Investigate why language significantly slows down the query
        // translation: {
        //   language,
        // },
        bookId: book,
        chapterNumber: chapter,
        number: verse,
      },
      include: {
        translation: true,
      },
      orderBy: {
        translationId: 'asc',
      },
    });

    const fullChapter = await this.db.chapter.findUnique({
      where: {
        translationId_bookId_number: {
          translationId: 'BSB',
          bookId: book,
          number: chapter,
        },
      },
    });

    // TODO: Rather than using the json data, we should add the heading as a
    // separate column in the database and get the verses directly via the join
    let contextJson = null;
    if (fullChapter) {
      const content = this.getVerseContext(verse, JSON.parse(fullChapter.json));
      contextJson = JSON.stringify({
        number: verse,
        content,
      });
    }

    return {
      book,
      chapter: chapter,
      verse: verse,
      verses: verses.map((verse) => BibleVerseResponse.fromDB(verse)),
      contextJson,
    };
  }

  async getVerse(
    language: string,
    book: string,
    chapter: number,
    verse: number,
    translation: string,
  ) {
    return this.db.chapterVerse.findUnique({
      where: {
        translationId_bookId_chapterNumber_number: {
          translationId: translation,
          bookId: book,
          chapterNumber: chapter,
          number: verse,
        },
        translation: {
          language: language,
        },
      },
    });
  }

  async getChapter(params: { where: Prisma.ChapterWhereInput }) {
    const { where } = params;

    const result = await this.db.chapter.findFirst({
      where,
      include: {
        verses: true,
        book: true,
        footnotes: true,
        translation: true,
      },
    });
    if (!result) return null;

    // We need to check if the next book exists because some translations are incomplete
    // TODO: Link to the next book and previous book if it exists in the database
    let nextChapterNumber: number | null = result.number + 1;
    let nextBookId: string | null = result.bookId;
    if (nextChapterNumber > result.book.numberOfChapters) {
      const nextBook = await this.db.book.findFirst({
        where: {
          translationId: result.translationId,
          order: result.book.order + 1,
        },
      });

      nextBookId = nextBook ? nextBook.id : null;
      nextChapterNumber = nextBook ? 1 : null;
    }

    let previousChapterNumber: number | null = result.number - 1;
    let previousBookId: string | null = result.bookId;
    if (previousChapterNumber < 1) {
      const previousBook = await this.db.book.findFirst({
        where: {
          translationId: result.translationId,
          order: result.book.order - 1,
        },
      });

      previousBookId = previousBook ? previousBook.id : null;
      previousChapterNumber = previousBook
        ? previousBook.numberOfChapters
        : null;
    }

    return {
      ...result,
      translationName: result.translation.name,
      nextChapterNumber,
      nextBookId,
      previousChapterNumber,
      previousBookId,
    };
  }
}
