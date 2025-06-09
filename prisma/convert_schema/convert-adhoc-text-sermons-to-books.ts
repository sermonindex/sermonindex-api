// import { PrismaClient } from '@prisma/client';
// import * as fs from 'fs';
// import { adhocTextBooks } from './adhoc-text-book';
// import { getTextSermons } from './common';

// function findTextSermon(
//   id: number,
//   textSermons: {
//     id: number;
//     category_id: number;
//     title: string;
//     body: string;
//   }[],
// ) {
//   return textSermons.find((sermon) => sermon.id === id);
// }

// export const convertAdhocTextSermonsToBooks = async (prisma: PrismaClient) => {
//   const uniqueContributors: Map<string, string> = new Map();

//   let missingTranscriptCount = 0;
//   let newBooks = 0;

//   const textSermonsThatAreBooks = {
//     ...adhocTextBooks,
//   };

//   const textContributors = new Set(Object.keys(textSermonsThatAreBooks));

//   const textSermons = JSON.parse(
//     fs.readFileSync('prisma/data/xoops_sermon_text.json', 'utf8'),
//   ).xoops_sermon_text;

//   for (const textContributor of textContributors) {
//     const fullNameSlug = textContributor
//       .toLowerCase()
//       .replace(/  /g, ' ')
//       .replace(/ /g, '-')
//       .replace(/\./g, '');

//     // Check if this contributor already exists in the new schema
//     const existingContributor = await prisma.contributor.findUnique({
//       where: {
//         fullName: textContributor,
//       },
//     });
//     if (existingContributor) {
//       uniqueContributors.set(textContributor, existingContributor.id);

//       continue;
//     }

//     const c = await prisma.contributor.create({
//       data: {
//         slug: fullNameSlug,
//         fullName: textContributor,
//       },
//     });
//     uniqueContributors.set(textContributor, c.id);
//   }

//   for (const bookAuthor in textSermonsThatAreBooks) {
//     try {
//       // @ts-ignore
//       const books = textSermonsThatAreBooks[bookAuthor];

//       const contributorId = uniqueContributors.get(bookAuthor);
//       if (!contributorId) {
//         console.log(`Could not find contributor ID for author: ${bookAuthor}`);
//         continue;
//       }

//       for (const book in books) {
//         const chapters: {
//           id: number;
//           category_id: number;
//           title: string;
//           body: string;
//         }[] = books[book];

//         let existingBook = await prisma.publishedBook.findFirst({
//           where: { title: book },
//         });

//         if (!existingBook) {
//           existingBook = await prisma.publishedBook.create({
//             data: {
//               title: book,
//               contributorId: contributorId,
//             },
//           });
//         }
//         console.log('Converting book:', book, 'by', bookAuthor);
//         newBooks++;

//         let chapter_order = 1;
//         for (const chapter of chapters) {
//           // Get the title and fix encodings
//           let title = chapter.title;
//           title = title.replace(/â€™/g, "'");
//           title = title.replace(/â€”/g, '-');
//           title = title.replace(/â€“/g, '-');
//           title = title.replace(/â€œ/g, '"');
//           title = title.replace(/â€‹/g, '');
//           title = title.replace(/â€/g, '"');
//           title = title.replace(/Â/g, '');
//           title = title.replace(/”/g, '"');
//           title = title.replace(/“/g, '"');
//           title = title.replace(/´/g, "'");
//           title = title.replace(/\\/g, '');

//           // Need to get the body
//           const textSermon = findTextSermon(chapter.id, textSermons);

//           // Get the transcript
//           let transcript = textSermon?.body as string | undefined;
//           let dirtyTranscript = false;
//           try {
//             if (
//               !transcript ||
//               (transcript &&
//                 (transcript.includes('â') || transcript.includes('×')))
//             ) {
//               // Too many of these to log
//               // console.log(
//               //   `Found special characters in transcript: id ${textSermon.id}, title: ${textSermon.title}`,
//               // );
//               transcript = await getTextSermons(chapter.id);
//             }
//           } catch (e) {
//             console.log(
//               `WARNING: Failed to get clean transcript: id: ${chapter.id}, title: ${chapter.title}`,
//             );
//             missingTranscriptCount++;
//             dirtyTranscript = true;
//             continue;
//           }

//           if (transcript?.includes('\\')) {
//             transcript = transcript.replace(/\\/g, '');
//           }

//           if (!transcript) {
//             console.log(
//               `WARNING: No transcript found for chapter: id: ${chapter.id}, title: ${chapter.title}`,
//             );
//             missingTranscriptCount++;
//             continue;
//           }

//           await prisma.publishedChapter.create({
//             data: {
//               originalId: null,
//               bookId: existingBook.id,
//               title: title,
//               text: transcript,
//               number: chapter_order,
//             },
//           });
//           chapter_order++;
//         }
//       }
//     } catch (e) {
//       console.log(`Failed to convert book: ${bookAuthor}`);
//       console.log(e);
//     }
//   }

//   console.log('Finished converting books. Summary:');
//   console.log(`- Books converted: ${newBooks}`);
//   console.log(`- Failed to clean ${missingTranscriptCount} sermons`);
// };
