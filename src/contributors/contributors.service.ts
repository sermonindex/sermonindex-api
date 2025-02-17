import { Injectable } from '@nestjs/common';
import { Contributor, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ContributorFullType } from './contributor.types';

@Injectable()
export class ContributorsService {
  constructor(private db: DatabaseService) {}

  async getContributor(
    contributorWhereUniqueInput: Prisma.ContributorWhereUniqueInput,
  ): Promise<ContributorFullType | null> {
    return this.db.contributor.findUnique({
      where: contributorWhereUniqueInput,
      include: {
        _count: {
          select: { sermons: true },
        },
        images: true,
      },
    });
  }

  async listContributors(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ContributorWhereUniqueInput;
    where?: Prisma.ContributorWhereInput;
    orderBy?: Prisma.ContributorOrderByWithRelationInput;
  }): Promise<ContributorFullType[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.db.contributor.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        _count: {
          select: { sermons: true },
        },
        images: true,
      },
    });
  }

  async createContributor(
    data: Prisma.ContributorCreateInput,
  ): Promise<Contributor> {
    return this.db.contributor.create({
      data,
    });
  }

  async updateContributor(params: {
    where: Prisma.ContributorWhereUniqueInput;
    data: Prisma.ContributorUpdateInput;
  }): Promise<Contributor> {
    const { where, data } = params;
    return this.db.contributor.update({
      data,
      where,
    });
  }

  async deleteContributor(
    where: Prisma.ContributorWhereUniqueInput,
  ): Promise<Contributor> {
    return this.db.contributor.delete({
      where,
    });
  }
}
