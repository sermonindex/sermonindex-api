import { Injectable } from '@nestjs/common';
import { Prisma, Sermon } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
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
        bibleReferences: true,
        topics: true,
      },
    });
  }

  async listSermons(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SermonWhereUniqueInput;
    where?: Prisma.SermonWhereInput;
    orderBy?: Prisma.SermonOrderByWithRelationInput;
  }): Promise<SermonFullType[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.db.sermon.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        contributor: true,
        bibleReferences: true,
        topics: true,
      },
    });
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
