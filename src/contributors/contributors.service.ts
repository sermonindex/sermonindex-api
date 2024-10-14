import { Injectable } from '@nestjs/common';
import { Contributor, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ContributorsService {
  constructor(private db: DatabaseService) {}

  async getContributor(
    contributorWhereUniqueInput: Prisma.ContributorWhereUniqueInput,
  ): Promise<Contributor | null> {
    return this.db.contributor.findUnique({
      where: contributorWhereUniqueInput,
    });
  }

  async listContributors(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ContributorWhereUniqueInput;
    where?: Prisma.ContributorWhereInput;
    orderBy?: Prisma.ContributorOrderByWithRelationInput;
  }): Promise<Contributor[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.db.contributor.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
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
