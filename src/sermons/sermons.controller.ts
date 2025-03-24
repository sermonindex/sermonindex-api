import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ListSermonResponse } from './dtos/list-sermon.response';
import { SermonInfoResponse } from './dtos/sermon-info.response';
import { SermonRequest } from './dtos/sermon.request';
import { SermonResponse } from './dtos/sermon.response';
import { SermonsService } from './sermons.service';

@Controller('sermons')
export class SermonsController {
  constructor(private readonly sermonService: SermonsService) {}

  @ApiOperation({
    summary: 'Retrieve a list of sermons with optional filters (max 100).',
    operationId: 'listSermons',
  })
  @Get('/')
  async listSermons(
    @Query() query: SermonRequest,
  ): Promise<ListSermonResponse> {
    const {
      id,
      title,
      fullName,
      fullNameSlug,
      contributorId,
      topic,
      book,
      chapter,
      verse,
      mediaType,
      limit,
      offset,
    } = query;

    const result = await this.sermonService.listSermons({
      where: {
        id,
        // TODO: Prisma supports full-text search
        // https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search#enabling-full-text-search-for-postgresql
        title: { contains: title, mode: 'insensitive' },
        contributor: {
          id: contributorId,
          fullName: fullName,
          fullNameSlug: fullNameSlug,
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
      },
      // TODO: make orderBy a query parameter. That would remove endpoints for popular and recent sermons
      orderBy: {
        hits: 'desc',
      },
      limit,
      offset,
    });

    return result;
  }

  @Get('/id/:id')
  async getSermonById(@Param('id') sermonId: number): Promise<SermonResponse> {
    const result = await this.sermonService.sermon({ id: sermonId });

    if (!result) {
      throw NotFoundException;
    }

    return SermonResponse.fromDB(result);
  }

  @Get('/recent')
  async listRecentSermons(): Promise<ListSermonResponse> {
    const result = await this.sermonService.listSermons({
      orderBy: { createdAt: 'desc' },
      limit: 15,
      offset: 0,
    });

    return result;
  }

  @Get('/popular')
  async listPopularSermons(): Promise<ListSermonResponse> {
    const result = await this.sermonService.listSermons({
      orderBy: { hits: 'desc' },
    });

    return result;
  }

  @Get('/featured')
  async getFeaturedSermon(): Promise<SermonInfoResponse> {
    const result = await this.sermonService.listSermons({
      where: { featured: true },
    });

    if (!result.values.length) {
      throw NotFoundException;
    }

    return result.values[0];
  }

  // TODO: Get rid of this endpoint. It's not useful
  @Get('/search')
  async searchSermons(
    @Query('title') title: string,
  ): Promise<ListSermonResponse> {
    const result = await this.sermonService.listSermons({
      where: {
        // TODO: Prisma supports full-text search
        // https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search#enabling-full-text-search-for-postgresql
        title: { contains: title, mode: 'insensitive' },
      },
      orderBy: { hits: 'desc' },
    });

    return result;
  }
}
