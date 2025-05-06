import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Contributor, Prisma } from '@prisma/client';
import { ContributorRequest } from 'src/common/dtos/contributor.request';
import { ContributorResponse } from 'src/common/dtos/contributor.response';
import { ContributorContent, ContributorSortBy } from './contributor.types';
import { ContributorsService } from './contributors.service';
import { CreateContributorRequest } from './dtos/create-contributor.request';

@Controller('contributors')
export class ContributorsController {
  constructor(private readonly contributorsService: ContributorsService) {}

  @Get('/')
  async listContributors(@Query() query: ContributorRequest) {
    const { fullName, fullNameSlug, id, contentType, sortBy, sortOrder } =
      query;

    let orderBy: Prisma.ContributorOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };
    if (sortBy === ContributorSortBy.Sermons) {
      orderBy = {
        sermons: { _count: sortOrder },
      };
    }

    const result = await this.contributorsService.listContributors({
      where: {
        fullName: { contains: fullName, mode: 'insensitive' },
        fullNameSlug: fullNameSlug,
        id: id,
        hymns:
          contentType && contentType.includes(ContributorContent.Hymns)
            ? { some: {} }
            : undefined,
        sermons:
          contentType && contentType.includes(ContributorContent.Sermons)
            ? { some: {} }
            : undefined,
      },
      orderBy: orderBy,
    });

    return {
      values: result.map((contributor) =>
        ContributorResponse.fromDB(contributor),
      ),
    };
  }

  @Get('/id/:id')
  async getContributorById(@Param('id') id: number) {
    const result = await this.contributorsService.getContributor({ id });

    if (!result) {
      throw NotFoundException;
    }

    return ContributorResponse.fromDB(result);
  }

  @Get('/featured')
  async listFeaturedContributors() {
    const result = await this.contributorsService.listContributors({
      where: { featured: true },
      orderBy: { fullName: 'asc' },
    });

    return {
      values: result.map((contributor) =>
        ContributorResponse.fromDB(contributor),
      ),
    };
  }

  @Post('/')
  async createContributor(@Body() data: CreateContributorRequest) {
    return this.contributorsService.createContributor(data);
  }

  @Put('/')
  async updateContributor(@Query('id') id: number, @Body() data: Contributor) {
    return this.contributorsService.updateContributor({
      where: { id },
      data,
    });
  }
}
