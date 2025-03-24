import { ConflictException, Injectable } from '@nestjs/common';
import { Contributor, ContributorType, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ContributorFullType } from './contributor.types';
import { CreateContributorRequest } from './dtos/create-contributor.request';

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
          select: { sermons: true, hymns: true },
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
          select: { sermons: true, hymns: true },
        },
        images: true,
      },
    });
  }

  async createContributor(
    data: CreateContributorRequest,
  ): Promise<Contributor> {
    const fullNameSlug = data.fullName
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, '-')
      .toLocaleLowerCase();

    const existingRecord = await this.db.contributor.findFirst({
      where: { fullNameSlug },
    });
    if (existingRecord) {
      throw new ConflictException('Contributor already exists');
    }

    return this.db.contributor.create({
      data: {
        ...data,
        fullNameSlug,
        type: ContributorType.INDIVIDUAL,
      },
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
