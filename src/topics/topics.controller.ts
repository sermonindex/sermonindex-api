import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { TopicInfoResponse } from 'src/common/dtos/topic-info.response';
import { TopicResponse } from 'src/common/dtos/topic.response';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('/')
  async listTopics() {
    const topics = await this.topicsService.listTopics({
      orderBy: { name: 'asc' },
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
