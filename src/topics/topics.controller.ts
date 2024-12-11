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
      orderBy: { sermon: { _count: 'desc' } },
    });

    return {
      values: topics.map((topic) => TopicInfoResponse.fromDB(topic)),
    };
  }

  @Get('/topicName/:name')
  async getTopic(@Param('name') topicName: string) {
    const result = await this.topicsService.getTopic(topicName);

    if (!result) {
      throw NotFoundException;
    }

    return TopicResponse.fromDB(result);
  }
}
