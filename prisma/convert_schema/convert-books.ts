import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { findContributorId } from './common';

export const convertBooks = async (prisma: PrismaClient) => {
  const uniqueContributors: Map<string, number[]> = new Map();
  const bookIds: Map<number, string> = new Map();

  const bookReference: { [key: string]: string } = {};
  const chapterReference: { [key: string]: string } = {};

  let existingContributors = 0;
  let newContributors = 0;
  let newBooks = 0;

  const bookContributors = JSON.parse(
    fs.readFileSync('prisma/data/xoops_book_author.json', 'utf8'),
  ).xoops_book_author;
  const books = JSON.parse(
    fs.readFileSync('prisma/data/xoops_book.json', 'utf8'),
  ).xoops_book;
  const bookChapters = JSON.parse(
    fs.readFileSync('prisma/data/xoops_book_chapter.json', 'utf8'),
  ).xoops_book_chapter;

  // Add book contributors
  for (const contributor of bookContributors) {
    const { id, name } = contributor;

    const existing = await prisma.contributor.findFirst({
      where: { fullName: { contains: name.trim(), mode: 'insensitive' } },
    });

    if (existing) {
      const existingIds = uniqueContributors.get(existing.id);

      uniqueContributors.set(
        existing.id,
        existingIds ? [...existingIds, id] : [id],
      );

      existingContributors++;
    } else {
      const fullNameSlug = name
        .toLowerCase()
        .replace(/  /g, ' ')
        .replace(/ /g, '-')
        .replace(/\./g, '');

      const c = await prisma.contributor.create({
        data: {
          slug: fullNameSlug,
          fullName: name,
        },
      });
      uniqueContributors.set(c.id, [id]);

      newContributors++;
    }
  }

  // Add books
  for (const book of books) {
    const { id, name, author_id } = book;

    const contributorId = findContributorId(author_id, uniqueContributors);
    if (!contributorId) {
      throw new Error(
        'Could not find contributor ID for author ID ' + author_id,
      );
    }

    // Check if the book already exists
    const existingBook = await prisma.publishedBook.findFirst({
      where: { originalId: String(id) },
    });

    if (existingBook) {
      bookIds.set(id, existingBook.id);
    } else {
      const newBook = await prisma.publishedBook.create({
        data: {
          originalId: String(id),
          title: name,
          contributorId: contributorId,
        },
      });
      bookIds.set(id, newBook.id);
      bookReference[id.toString()] = newBook.id;
    }

    newBooks++;
  }

  for (const chapter of bookChapters) {
    const { id, book_id, name, chapter_text, chapter_order } = chapter;

    const bookId = bookIds.get(book_id);
    if (!bookId) {
      throw new Error('Could not find book ID for book ID ' + book_id);
    }

    let text = chapter_text.replace(/\|/g, '"');
    let title = name.replace(/à/g, '');
    if (title.includes('</span>')) {
      let match = title.match(/<span[^>]*>(.*?)<\/span>/);
      title = match ? match[1] : title;
    }

    const previousChapter = await prisma.publishedChapter.findFirst({
      where: { bookId: bookId },
      orderBy: { number: 'desc' },
    });
    const order = previousChapter ? previousChapter.number + 1 : 1;

    await prisma.publishedChapter.create({
      data: {
        originalId: String(id),
        bookId: bookId,
        title: title,
        text: text,
        number: order,
      },
    });
    chapterReference[id.toString()] = `/books/${bookId}/contents/${order}`;
  }

  const bookReferenceJSON = JSON.stringify(bookReference, null, 2);
  fs.writeFileSync('bookReference.json', bookReferenceJSON, 'utf8');
  const chapterReferenceJSON = JSON.stringify(chapterReference, null, 2);
  fs.writeFileSync('chapterReference.json', chapterReferenceJSON, 'utf8');

  console.log('Finished converting books. Summary:');
  console.log(
    `- Added ${newContributors} new contributors and found ${existingContributors} existing contributors.`,
  );
  console.log(`- Added ${newBooks} new books.`);
};
