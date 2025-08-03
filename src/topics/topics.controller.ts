import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { ApiKeyAuthGuard } from 'src/auth/api-key-auth.guard';
import { AddTopicRequest } from './dtos/add-topic.request';
import { ListTopicsResponse } from './dtos/list-topics.response';
import { TopicRequest } from './dtos/topic.request';
import { TopicResponse } from './dtos/topic.response';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Retrieve a list of topics with optional filters',
    operationId: 'listTopics',
  })
  @ApiOkResponse({
    type: ListTopicsResponse,
  })
  async listTopics(@Query() query: TopicRequest) {
    return this.topicsService.listTopics(query);
  }

  @Get('/id/:id')
  @ApiOperation({
    summary: 'Retrieve a topic by its ID',
    operationId: 'getTopicById',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the topic to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: TopicResponse,
  })
  async getTopicById(@Param('id') id: string) {
    const result = await this.topicsService.getTopic({ id });

    if (!result) {
      throw NotFoundException;
    }

    return TopicResponse.fromDB(result);
  }

  @Get('/slug/:slug')
  @ApiOperation({
    summary: 'Retrieve a topic by its slug',
    operationId: 'getTopicBySlug',
  })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the topic to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: TopicResponse,
  })
  async getTopicByslug(@Param('slug') slug: string) {
    const result = await this.topicsService.getTopic({ slug });

    if (!result) {
      throw new NotFoundException(`Topic with slug ${slug} not found`);
    }

    return TopicResponse.fromDB(result);
  }

  @Post('/')
  @ApiSecurity('Api-Key')
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({
    summary: 'Add a topic.',
    operationId: 'addTopic',
  })
  async addTopic(@Body() data: AddTopicRequest) {
    return this.topicsService.addTopic(data);
  }

  @Delete('/id/:id')
  @ApiSecurity('Api-Key')
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({
    summary: 'Delete a topic.',
    description:
      '⚠️ WARNING: This action is irreversible and will permanently delete the topic and all associated data.',
    operationId: 'deleteTopic',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the topic to delete',
    type: String,
  })
  async deleteTopic(@Param('id') id: string) {
    return this.topicsService.deleteTopic(id);
  }
}
