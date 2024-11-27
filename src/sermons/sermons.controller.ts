import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ListSermonsResponse } from 'src/common/dtos/list-sermons.response';
import { SermonRequest } from 'src/common/dtos/sermon.request';
import { SermonResponse } from 'src/common/dtos/sermon.response';
import { SermonsService } from './sermons.service';

@Controller('sermons')
export class SermonsController {
  constructor(private readonly sermonService: SermonsService) {}

  @Get('/')
  async listSermons(
    @Query() query: SermonRequest,
  ): Promise<ListSermonsResponse> {
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
    } = query;

    const result = await this.sermonService.listSermons({
      where: {
        id,
        title,
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
                  book: book,
                  startChapter: chapter ? { gte: chapter } : undefined,
                  endChapter: chapter ? { lte: chapter } : undefined,
                  startVerse: verse ? { gte: verse } : undefined,
                  endVerse: verse ? { lte: verse } : undefined,
                },
              }
            : undefined,
      },
      take: 5000,
      orderBy: {
        hits: 'desc',
      },
    });

    return {
      values: result.map((sermon) => SermonResponse.fromDB(sermon)),
    };
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
  async listRecentSermons(): Promise<ListSermonsResponse> {
    const result = await this.sermonService.listSermons({
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    return {
      values: result.map((sermon) => SermonResponse.fromDB(sermon)),
    };
  }

  @Get('/popular')
  async listPopularSermons(): Promise<ListSermonsResponse> {
    const result = await this.sermonService.listSermons({
      orderBy: { hits: 'desc' },
      take: 100,
    });

    return {
      values: result.map((sermon) => SermonResponse.fromDB(sermon)),
    };
  }

  @Get('/featured')
  async getFeaturedSermon(): Promise<SermonResponse> {
    const result = await this.sermonService.listSermons({
      where: { featured: true },
    });

    if (!result.length) {
      throw NotFoundException;
    }

    return SermonResponse.fromDB(result[0]);
  }

  @Get('/search')
  async searchSermons(
    @Query('title') title: string,
  ): Promise<ListSermonsResponse> {
    const result = await this.sermonService.listSermons({
      where: {
        title: { contains: title },
      },
    });

    return {
      values: result.map((sermon) => SermonResponse.fromDB(sermon)),
    };
  }
}
