import { PrismaClient } from '@prisma/client';
import { getTextSermons } from './common';
import { textBooksZero } from './text-book-0';
import { textBookOne } from './text-book-1';
import { textBookTwo } from './text-book-2';
import { textBookThree } from './text-book-3';
import { textBookFour } from './text-book-4';
import { textBookFive } from './text-book-5';

export const convertTextSermonsToBooks = async (prisma: PrismaClient) => {
  const uniqueContributors: Map<string, string> = new Map();

  let missingTranscriptCount = 0;
  let newBooks = 0;

  const textSermonsThatAreBooks = {
    ...textBooksZero,
    ...textBookOne,
    ...textBookTwo,
    ...textBookThree,
    ...textBookFour,
    ...textBookFive,
  };

  const textContributors = new Set(Object.keys(textSermonsThatAreBooks));

  for (const textContributor of textContributors) {
    const fullNameSlug = textContributor
      .toLowerCase()
      .replace(/  /g, ' ')
      .replace(/ /g, '-')
      .replace(/\./g, '');

    // Check if this contributor already exists in the new schema
    const existingContributor = await prisma.contributor.findUnique({
      where: {
        fullName: textContributor,
      },
    });
    if (existingContributor) {
      uniqueContributors.set(textContributor, existingContributor.id);

      continue;
    }

    const c = await prisma.contributor.create({
      data: {
        slug: fullNameSlug,
        fullName: textContributor,
      },
    });
    uniqueContributors.set(textContributor, c.id);
  }

  for (const bookAuthor in textSermonsThatAreBooks) {
    try {
      // @ts-ignore
      const books = textSermonsThatAreBooks[bookAuthor];

      const contributorId = uniqueContributors.get(bookAuthor);
      if (!contributorId) {
        console.log(`Could not find contributor ID for author: ${bookAuthor}`);
        continue;
      }

      for (const book in books) {
        const chapters: {
          id: number;
          category_id: number;
          title: string;
          body: string;
        }[] = books[book];

        let existingBook = await prisma.publishedBook.findFirst({
          where: { title: book, contributorId: contributorId },
        });

        if (!existingBook) {
          existingBook = await prisma.publishedBook.create({
            data: {
              title: book,
              contributorId: contributorId,
            },
          });
        }else {
          continue; // Skip if the book already exists
        }
        console.log('Converting book:', book, 'by', bookAuthor);
        newBooks++;

        let chapter_order = 1;
        for (const chapter of chapters) {
          // Get the title and fix encodings
          let title = chapter.title;
          title = title.replace(/â€™/g, "'");
          title = title.replace(/â€”/g, '-');
          title = title.replace(/â€“/g, '-');
          title = title.replace(/â€œ/g, '"');
          title = title.replace(/â€‹/g, '');
          title = title.replace(/â€/g, '"');
          title = title.replace(/Â/g, '');
          title = title.replace(/”/g, '"');
          title = title.replace(/“/g, '"');
          title = title.replace(/´/g, "'");
          title = title.replace(/\\/g, '');

          // Get the transcript
          let transcript = chapter.body as string | undefined;
          let dirtyTranscript = false;
          try {
            if (
              transcript &&
              (transcript.includes('â') || transcript.includes('×'))
            ) {
              // Too many of these to log
              // console.log(
              //   `Found special characters in transcript: id ${textSermon.id}, title: ${textSermon.title}`,
              // );
              transcript = await getTextSermons(chapter.id);
            }
          } catch (e) {
            console.log(
              `WARNING: Failed to get clean transcript: id: ${chapter.id}, title: ${chapter.title}`,
            );
            missingTranscriptCount++;
            dirtyTranscript = true;
          }

          if (transcript?.includes('\\')) {
            transcript = transcript.replace(/\\/g, '');
          }

          await prisma.publishedChapter.create({
            data: {
              originalId: null,
              bookId: existingBook.id,
              title: title,
              text: dirtyTranscript ? chapter.body : (transcript as string),
              number: chapter_order,
            },
          });
          chapter_order++;
        }
      }
    } catch (e) {
      console.log(`Failed to convert book: ${bookAuthor}`);
      console.log(e);
    }
  }

  console.log('Finished converting books. Summary:');
  console.log(`- Books converted: ${newBooks}`);
  console.log(`- Failed to clean ${missingTranscriptCount} sermons`);
};
