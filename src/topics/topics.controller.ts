import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TopicInfoResponse } from 'src/common/dtos/topic-info.response';
import { TopicResponse } from 'src/common/dtos/topic.response';
import { TopicRequest } from './dtos/topic.request';
import { TopicSortBy } from './topic.types';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('/')
  async listTopics(@Query() query: TopicRequest) {
    const { name, sortBy, sortOrder } = query;

    let orderBy: Prisma.TopicOrderByWithRelationInput = { [sortBy]: sortOrder };
    if (sortBy === TopicSortBy.Sermons) {
      orderBy = {
        sermons: { _count: sortOrder },
      };
    }

    const topics = await this.topicsService.listTopics({
      where: {
        name: { contains: name, mode: 'insensitive' },
      },
      orderBy: orderBy,
    });

    return {
      values: topics.map((topic) => TopicInfoResponse.fromDB(topic)),
    };
  }

  @Get('/popular')
  async listPopularTopics() {
    const topics = await this.topicsService.listTopics({
      take: 20,
      orderBy: { sermons: { _count: 'desc' } },
    });

    return {
      values: topics.map((topic) => TopicInfoResponse.fromDB(topic)),
    };
  }

  @Get('/slug/:slug')
  async getTopic(@Param('slug') slug: string) {
    const result = await this.topicsService.getTopic(slug);

    if (!result) {
      throw NotFoundException;
    }

    return TopicResponse.fromDB(result);
  }
}
