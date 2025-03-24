import { Injectable } from '@nestjs/common';
import { Prisma, Sermon } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { SermonInfoResponse } from './dtos/sermon-info.response';
import { SermonFullType } from './sermon.types';

@Injectable()
export class SermonsService {
  constructor(private db: DatabaseService) {}

  async sermon(
    sermonWhereUniqueInput: Prisma.SermonWhereUniqueInput,
  ): Promise<SermonFullType | null> {
    return this.db.sermon.findUnique({
      where: sermonWhereUniqueInput,
      include: {
        contributor: true,
        urls: true,
        bibleReferences: true,
        topics: true,
        transcript: true,
      },
    });
  }

  async listSermons(params: {
    where?: Prisma.SermonWhereInput;
    orderBy?: Prisma.SermonOrderByWithRelationInput;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    const { where, orderBy, limit = 100, offset = 0 } = params;

    const [result, totalCount] = await this.db.$transaction([
      this.db.sermon.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy,
        include: {
          contributor: true,
          urls: true,
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

  async createSermon(data: Prisma.SermonCreateInput): Promise<Sermon> {
    return this.db.sermon.create({
      data,
    });
  }

  async updateSermon(params: {
    where: Prisma.SermonWhereUniqueInput;
    data: Prisma.SermonUpdateInput;
  }): Promise<Sermon> {
    const { data, where } = params;
    return this.db.sermon.update({
      data,
      where,
    });
  }

  async deleteSermon(where: Prisma.SermonWhereUniqueInput): Promise<Sermon> {
    return this.db.sermon.delete({
      where,
    });
  }
}
