import {
  MediaFormat,
  MediaSource,
  MediaType,
  PrismaClient,
  SermonMedia,
} from '@prisma/client';
import * as fs from 'fs';
import { audioBooks } from './audio-books';
import { getArchiveAudioUrl } from './common';

export const convertAudioBooks = async (prisma: PrismaClient) => {
  const uniqueContributors: Map<string, string> = new Map();

  let missingTranscriptCount = 0;
  let newBooks = 0;

  const audioContributors = new Set(Object.keys(audioBooks));

  for (const audioContributor of audioContributors) {
    const fullNameSlug = audioContributor
      .toLowerCase()
      .replace(/  /g, ' ')
      .replace(/ /g, '-')
      .replace(/\./g, '');

    // Check if this contributor already exists in the new schema
    const existingContributor = await prisma.contributor.findUnique({
      where: {
        fullName: audioContributor,
      },
    });
    if (existingContributor) {
      uniqueContributors.set(audioContributor, existingContributor.id);

      continue;
    }

    const c = await prisma.contributor.create({
      data: {
        slug: fullNameSlug,
        fullName: audioContributor,
      },
    });
    uniqueContributors.set(audioContributor, c.id);
  }

  for (const bookAuthor in audioBooks) {
    try {
      // @ts-ignore
      const books = audioBooks[bookAuthor];

      const contributorId = uniqueContributors.get(bookAuthor);
      if (!contributorId) {
        console.log(`Could not find contributor ID for author: ${bookAuthor}`);
        continue;
      }

      for (const book in books) {
        const chapters: {
          lid: number;
          title: string;
          url: string;
        }[] = books[book];

        const newBook = await prisma.publishedBook.create({
          data: {
            title: book,
            contributorId: contributorId,
            mediaType: MediaType.AUDIO,
          },
        });
        console.log('Converting book:', book, 'by', bookAuthor);
        newBooks++;

        let chapter_order = 1;
        for (const chapter of chapters) {
          const urls: Omit<SermonMedia, 'id' | 'sermonId'>[] = [];
          const archiveUrl = await getArchiveAudioUrl(chapter.lid, chapter.url);
          if (archiveUrl) {
            urls.push({
              url: archiveUrl,
              source: MediaSource.ARCHIVE,
              type: MediaType.AUDIO,
              format: MediaFormat.MP3,
            });
          }

          const pathMatch = chapter.url.match(/(\/\d+\/SID\d+)/);
          const path = pathMatch ? pathMatch[1] : null;
          if (path) {
            urls.push({
              url: `https://sermonindex1.b-cdn.net${path}.mp3`,
              source: MediaSource.BUNNY,
              type: MediaType.AUDIO,
              format: MediaFormat.MP3,
            });

            urls.push({
              url: `https://sermonindex3.b-cdn.net/srt${path}.srt`,
              source: MediaSource.BUNNY,
              type: MediaType.AUDIO,
              format: MediaFormat.SRT,
            });

            urls.push({
              url: `https://sermonindex3.b-cdn.net/vtt${path}.vtt`,
              source: MediaSource.BUNNY,
              type: MediaType.AUDIO,
              format: MediaFormat.VTT,
            });
          }

          let originalId = (chapter.url as any).split('/').pop().split('.')[0];

          let transcript;
          try {
            transcript = fs.readFileSync(
              `prisma/data/audio_transcripts/${originalId}.txt`,
              'utf8',
            );
          } catch (e) {
            console.log(`No transcript found for sermon ${originalId}`);
            missingTranscriptCount++;
          }

          await prisma.publishedChapter.create({
            data: {
              originalId: chapter.lid.toString(),
              originalMediaId: originalId,
              bookId: newBook.id,
              title: chapter.title,
              text: transcript ?? '',
              number: chapter_order,
              urls: {
                create: urls.map((url) => ({
                  url: url.url,
                  type: url.type,
                  format: url.format,
                  source: url.source,
                })),
              },
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
