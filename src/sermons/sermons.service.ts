import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MediaFormat,
  MediaSource,
  MediaType,
  Prisma,
  Sermon,
} from '@prisma/client';
import AwokenRef from 'awoken-bible-reference';
import { PaginationRequest } from 'src/common/dtos/pagination.request';
import { getMediaFormat } from 'src/common/get-media-format.fn';
import { DatabaseService } from 'src/database/database.service';
import { AddSermonRequest } from './dtos/add-sermon.request';
import { SermonInfoResponse } from './dtos/sermon-info.response';
import { SermonRequest } from './dtos/sermon.request';

@Injectable()
export class SermonsService {
  constructor(private db: DatabaseService) {}

  private getMediaUrls(
    mediaType: MediaType,
    youtubeUrl: string | null | undefined,
    bunnyUrl: string | null | undefined,
    archiveUrl: string | null | undefined,
    srtUrl: string | null | undefined,
    vttUrl: string | null | undefined,
  ) {
    const sources = [
      {
        url: youtubeUrl,
        source: MediaSource.YOUTUBE,
        format: getMediaFormat(youtubeUrl),
      },
      {
        url: bunnyUrl,
        source: MediaSource.BUNNY,
        format: getMediaFormat(bunnyUrl),
      },
      {
        url: archiveUrl,
        source: MediaSource.ARCHIVE,
        format: getMediaFormat(archiveUrl),
      },
      { url: srtUrl, source: MediaSource.BUNNY, format: MediaFormat.SRT },
      { url: vttUrl, source: MediaSource.BUNNY, format: MediaFormat.VTT },
    ];

    return sources
      .filter(({ url }) => !!url)
      .map(({ url, source, format }) => ({
        url: url as string,
        type: mediaType,
        format,
        source,
      }));
  }

  private async verifyTopicsExist(topics: string[]) {
    for (const topic of topics) {
      const exists = await this.db.topic.findFirst({
        where: { name: topic },
      });

      if (!exists) {
        throw new NotFoundException(
          `Topic not found: ${topic}. Please create it first.`,
        );
      }
    }

    return true;
  }

  private parseBibleReferences(bibleReferences: string[]) {
    return bibleReferences.map((text) => {
      try {
        const result = AwokenRef.parseOrThrow(text.trim());
        for (const reference of result) {
          if (reference.is_range) {
            return {
              bookId: reference.start.book,
              startChapter: reference.start.chapter,
              endChapter: reference.end.chapter,
              startVerse: reference.start.verse,
              endVerse: reference.end.verse,
              text: AwokenRef.format(reference, {
                combine_ranges: true,
                compact: true,
              }),
            };
          } else {
            return {
              bookId: reference.book,
              startChapter: reference.chapter,
              endChapter: reference.chapter,
              startVerse: reference.verse,
              endVerse: reference.verse,
              text: AwokenRef.format(reference, {
                combine_ranges: true,
                compact: true,
              }),
            };
          }
        }
      } catch (e) {
        throw new BadRequestException(`Invalid bible reference: ${text}`);
      }
    });
  }

  async getSermon(id: string) {
    return this.db.sermon.findUnique({
      where: { id },
      include: {
        contributor: true,
        urls: true,
        bibleReferences: true,
        topics: true,
        transcript: true,
      },
    });
  }

  async listSermons(query: SermonRequest) {
    const {
      id,
      title,
      contributorFullName,
      contributorSlug,
      contributorId,
      topic,
      book,
      chapter,
      verse,
      mediaType,
      limit = 25,
      offset = 0,
      sortBy,
      sortOrder,
    } = query;

    const where: Prisma.SermonWhereInput = {
      id,
      // TODO: Prisma supports full-text search
      // https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search#enabling-full-text-search-for-postgresql
      title: { contains: title, mode: 'insensitive' },
      contributor: {
        id: contributorId,
        slug: contributorSlug,
        fullName: contributorFullName,
      },
      topics: topic ? { some: { name: topic } } : undefined,
      bibleReferences:
        book || chapter || verse
          ? {
              some: {
                bookId: book,
                startChapter: chapter ? { gte: chapter } : undefined,
                endChapter: chapter ? { lte: chapter } : undefined,
                startVerse: verse ? { gte: verse } : undefined,
                endVerse: verse ? { lte: verse } : undefined,
              },
            }
          : undefined,
      mediaType: { in: mediaType },
    };

    const [result, totalCount] = await this.db.$transaction([
      this.db.sermon.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy: { [sortBy]: sortOrder },
        include: {
          contributor: true,
          bibleReferences: true,
          topics: true,
        },
      }),
      this.db.sermon.count({ where }),
    ]);

    return {
      values: result.map((sermon) => SermonInfoResponse.fromDB(sermon)),
      total: totalCount,
      limit,
      offset,
      nextPage: totalCount > offset + limit ? offset + limit : null,
    };
  }

  async listFeaturedSermons(query: PaginationRequest) {
    const { limit = 25, offset = 0 } = query;

    const [result, totalCount] = await this.db.$transaction([
      this.db.featuredSermon.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sermon: {
            include: {
              contributor: true,
              bibleReferences: true,
              topics: true,
            },
          },
        },
      }),
      this.db.featuredSermon.count(),
    ]);

    return {
      values: result.map((featured) =>
        SermonInfoResponse.fromDB(featured.sermon),
      ),
      total: totalCount,
      limit,
      offset,
      nextPage: totalCount > offset + limit ? offset + limit : null,
    };
  }

  async listRecentlyViewedSermons(query: PaginationRequest) {
    const { limit = 25, offset = 0 } = query;

    const [result, total] = await this.db.$transaction([
      this.db.recentSermonView.findMany({
        skip: offset,
        take: limit,
        distinct: ['sermonId'],
        orderBy: { createdAt: 'desc' },
        include: {
          sermon: {
            include: {
              contributor: true,
              bibleReferences: true,
              topics: true,
            },
          },
        },
      }),
      this.db.$queryRaw`
        SELECT COUNT(DISTINCT rv."sermonId")
        FROM "RecentSermonView" rv;
      `,
    ]);
    const totalCount = Number((total as { count: BigInt }[])[0]?.count) || 0;

    return {
      values: result.map((view) => SermonInfoResponse.fromDB(view.sermon)),
      total: totalCount,
      limit,
      offset,
      nextPage: totalCount > offset + limit ? offset + limit : null,
    };
  }

  async listRecentlyUploadedSermons(query: PaginationRequest) {
    const { limit = 25, offset = 0 } = query;

    const [result, totalCount] = await this.db.$transaction([
      this.db.sermon.findMany({
        skip: offset,
        take: limit,
        where: {
          createdAt: {
            gte: new Date('2025-08-08T00:00:00Z'),
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          contributor: true,
          bibleReferences: true,
          topics: true,
        },
      }),
      this.db.featuredSermon.count(),
    ]);

    return {
      values: result.map((sermon) => SermonInfoResponse.fromDB(sermon)),
      total: totalCount,
      limit,
      offset,
      nextPage: totalCount > offset + limit ? offset + limit : null,
    };
  }

  async recordSermonView(id: string, ip: string) {
    const recentlyViewed = await this.db.recentSermonView.findFirst({
      where: {
        sermonId: id,
        ipAddress: ip,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!recentlyViewed) {
      await this.db.recentSermonView.create({
        data: {
          sermonId: id,
          ipAddress: ip,
        },
      });

      await this.db.sermon.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    return { status: 'OK' };
  }

  async addSermon(data: AddSermonRequest) {
    const {
      contributorId,
      title,
      description,
      mediaType,
      duration,
      thumbnailUrl,
      audio,
      video,
      bibleReferences,
      topics,
      transcript,
    } = data;

    const audioSources = this.getMediaUrls(
      MediaType.AUDIO,
      audio?.youtubeUrl,
      audio?.bunnyUrl,
      audio?.archiveUrl,
      audio?.srtUrl,
      audio?.vttUrl,
    );

    const videoSources = this.getMediaUrls(
      MediaType.VIDEO,
      video?.youtubeUrl,
      video?.bunnyUrl,
      video?.archiveUrl,
      video?.srtUrl,
      video?.vttUrl,
    );

    // Construct SermonMedia objects from the urls
    const sources = [...audioSources, ...videoSources];

    // Verify all topics exist
    await this.verifyTopicsExist(topics);

    // Parse the bible references and create SermonBibleReference objects
    const references = this.parseBibleReferences(bibleReferences);

    return this.db.sermon.create({
      data: {
        title,
        description,
        contributorId,
        mediaType,
        duration,
        thumbnailUrl,
        transcript: {
          create: {
            text: transcript.trim(),
          },
        },
        topics: {
          connect: topics.map((name) => ({ name })),
        },
        bibleReferences: {
          create: references
            .filter((ref): ref is NonNullable<typeof ref> => ref !== undefined)
            .map((reference) => ({
              bookId: reference.bookId,
              startChapter: reference.startChapter,
              endChapter: reference.endChapter,
              startVerse: reference.startVerse,
              endVerse: reference.endVerse,
              text: reference.text,
            })),
        },
        urls: {
          create: sources.map((url) => ({
            url: url.url,
            type: url.type,
            format: url.format,
            source: url.source,
          })),
        },
      },
    });
  }

  async updateFeaturedSermonList(id: string) {
    const existingRecord = await this.db.featuredSermon.findFirst({
      where: { sermonId: id },
    });
    if (existingRecord) {
      await this.db.featuredSermon.delete({
        where: { id: existingRecord.id },
      });
    }

    return this.db.featuredSermon.create({
      data: { sermonId: id },
    });
  }

  async deleteSermon(id: string): Promise<Sermon> {
    return this.db.sermon.delete({
      where: { id },
    });
  }
}
