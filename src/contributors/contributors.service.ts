import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Contributor,
  ContributorContent,
  ContributorType,
  Prisma,
} from '@prisma/client';
import { createSlug } from 'src/common/create-slug.fn';
import { DatabaseService } from 'src/database/database.service';
import { ContributorSortBy } from './contributor.types';
import { AddContributorRequest } from './dtos/add-contributor.request';
import { ContributorInfoResponse } from './dtos/contributor-info.response';
import { ContributorRequest } from './dtos/contributor.request';

@Injectable()
export class ContributorsService {
  constructor(private db: DatabaseService) {}

  async getContributor(params: { id?: string; slug?: string }) {
    const { id, slug } = params;

    return this.db.contributor.findUnique({
      where: { id, slug },
      include: {
        _count: {
          select: { sermons: true, hymns: true, books: true },
        },
        images: true,
      },
    });
  }

  async listContributors(query: ContributorRequest) {
    const {
      id,
      slug,
      fullName,
      content,
      sortBy,
      sortOrder,
      limit = 100,
      offset = 0,
    } = query;

    let orderBy: Prisma.ContributorOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };
    if (sortBy === ContributorSortBy.Sermons) {
      orderBy = {
        sermons: { _count: sortOrder },
      };
    }

    const where: Prisma.ContributorWhereInput = {
      id,
      slug,
      fullName: { contains: fullName, mode: 'insensitive' },
      hymns:
        content && content === ContributorContent.HYMNS
          ? { some: {} }
          : undefined,
      sermons:
        content && content === ContributorContent.SERMONS
          ? { some: {} }
          : undefined,
      books:
        content && content === ContributorContent.BOOKS
          ? { some: {} }
          : undefined,
    };

    const [result, totalCount] = await this.db.$transaction([
      this.db.contributor.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy: orderBy,
        include: {
          _count: {
            select: { sermons: true, hymns: true, books: true },
          },
        },
      }),
      this.db.contributor.count({ where }),
    ]);

    return {
      values: result.map((contributor) =>
        ContributorInfoResponse.fromDB(contributor),
      ),
      total: totalCount,
      limit,
      offset,
      nextPage: totalCount > offset + limit ? offset + limit : null,
    };
  }

  async listFeaturedContributors(content: ContributorContent) {
    const featuredContributors = await this.db.featuredContributor.findMany({
      where: {
        content: content,
      },
      include: {
        contributor: {
          include: {
            _count: {
              select: { sermons: true, hymns: true, books: true },
            },
          },
        },
      },
    });

    return {
      values: featuredContributors.map((featuredContributor) =>
        ContributorInfoResponse.fromDB(featuredContributor.contributor),
      ),
    };
  }

  async addContributor(data: AddContributorRequest): Promise<Contributor> {
    const { fullName, bio, imageUrl } = data;
    const slug = createSlug(fullName);

    const existing = await this.db.contributor.findFirst({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException('Contributor already exists');
    }

    return this.db.contributor.create({
      data: {
        slug,
        fullName,
        bio,
        imageUrl,
        type: ContributorType.INDIVIDUAL,
      },
    });
  }

  async updateContributor(
    id: string,
    data: Partial<AddContributorRequest>,
  ): Promise<Contributor> {
    const { fullName, bio, imageUrl } = data;
    const slug = createSlug(fullName);

    const existing = await this.db.contributor.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Contributor does not exist');
    }

    return this.db.contributor.update({
      data: { slug, fullName, bio, imageUrl },
      where: { id },
    });
  }

  async updateFeaturedContributorList(id: string, content: ContributorContent) {
    const existing = await this.db.featuredContributor.findFirst({
      where: { contributorId: id, content },
    });
    if (existing) {
      throw new ConflictException(
        'Contributor already exists in featured list',
      );
    }

    return this.db.featuredContributor.create({
      data: {
        contributorId: id,
        content,
      },
    });
  }

  async deleteContributor(id: string): Promise<Contributor> {
    return this.db.contributor.delete({
      where: { id },
    });
  }

  async deleteFeaturedContributor(id: string, content: ContributorContent) {
    const existing = await this.db.featuredContributor.findFirst({
      where: { contributorId: id, content },
    });
    if (!existing) {
      throw new NotFoundException('Featured contributor does not exist');
    }

    return this.db.featuredContributor.delete({
      where: { id: existing.id },
    });
  }
}
