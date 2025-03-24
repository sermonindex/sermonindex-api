import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TopicsService {
  constructor(private db: DatabaseService) {}

  listTopics(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TopicWhereUniqueInput;
    where?: Prisma.TopicWhereInput;
    orderBy?: Prisma.TopicOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    return this.db.topic.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        _count: {
          select: { sermons: true },
        },
      },
    });
  }

  getTopic(slug: string) {
    return this.db.topic.findFirst({
      where: {
        slug,
      },
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
}
