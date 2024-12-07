import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
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
      values: topics.map((topic) => topic.name),
    };
  }

  @Get('/:name')
  async getTopic(@Param('name') topicName: string) {
    const result = await this.topicsService.getTopic(topicName);

    if (!result) {
      throw NotFoundException;
    }

    return TopicResponse.fromDB(result);
  }
}
