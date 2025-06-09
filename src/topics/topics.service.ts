import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createSlug } from 'src/common/create-slug.fn';
import { DatabaseService } from 'src/database/database.service';
import { AddTopicRequest } from './dtos/add-topic.request';
import { TopicRequest } from './dtos/topic.request';
import { TopicSortBy } from './topic.types';

@Injectable()
export class TopicsService {
  constructor(private db: DatabaseService) {}

  async getTopic(params: { id?: string; slug?: string }) {
    const { id, slug } = params;

    return this.db.topic.findFirst({
      where: { id, slug },
      include: {
        sermons: {
          include: {
            contributor: true,
            urls: true,
            bibleReferences: true,
          },
        },
      },
    });
  }

  async listTopics(query: TopicRequest) {
    const { name, sortBy, sortOrder, limit } = query;

    let orderBy: Prisma.TopicOrderByWithRelationInput = { [sortBy]: sortOrder };
    if (sortBy === TopicSortBy.Sermons) {
      orderBy = {
        sermons: { _count: sortOrder },
      };
    }

    return this.db.topic.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
      },
      orderBy: orderBy,
      take: limit,
      include: {
        _count: {
          select: { sermons: true },
        },
      },
    });
  }

  async addTopic(data: AddTopicRequest) {
    const { name, summary } = data;
    const slug = createSlug(name);

    const existing = await this.db.topic.findUnique({
      where: { id: slug },
    });
    if (existing) {
      throw new ConflictException('Topic already exists');
    }

    return this.db.topic.create({
      data: {
        slug,
        name,
        summary,
      },
    });
  }

  async deleteTopic(id: string) {
    return this.db.topic.delete({
      where: { id },
    });
  }
}
