import { Injectable } from '@nestjs/common';
import { Prisma, Sermon } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SermonsService {
  constructor(private db: DatabaseService) {}

  async sermon(
    sermonWhereUniqueInput: Prisma.SermonWhereUniqueInput,
  ): Promise<Sermon | null> {
    return this.db.sermon.findUnique({
      where: sermonWhereUniqueInput,
    });
  }

  async listSermons(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SermonWhereUniqueInput;
    where?: Prisma.SermonWhereInput;
    orderBy?: Prisma.SermonOrderByWithRelationInput;
  }): Promise<Sermon[]> {
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

  async listMinimalSermons(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SermonWhereUniqueInput;
    where?: Prisma.SermonWhereInput;
    orderBy?: Prisma.SermonOrderByWithRelationInput;
  }): Promise<
    // TODO: Fix this return type
    Partial<Sermon>[]
  > {
    const { skip, take, cursor, where, orderBy } = params;
    return this.db.sermon.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        description: true,
        hits: true,
        contributor: { select: { id: true, fullName: true } },
        bibleReferences: { select: { text: true } },
        topics: { select: { name: true } },
        createdAt: true,
      },
    });
  }

  async searchSermons() {
    throw new Error('Method not implemented.');
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
