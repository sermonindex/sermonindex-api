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
import { Contributor } from '@prisma/client';
import { ContributorRequest } from 'src/common/dtos/contributor.request';
import { ContributorResponse } from 'src/common/dtos/contributor.response';
import { ContributorsService } from './contributors.service';

@Controller('contributors')
export class ContributorsController {
  constructor(private readonly contributorsService: ContributorsService) {}

  @Get('/')
  async listContributors(@Query() query: ContributorRequest) {
    const { fullName, id } = query;

    const result = await this.contributorsService.listContributors({
      where: { fullName: fullName, id: id },
      orderBy: { fullName: 'asc' },
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
  async createContributor(@Body() data: Contributor) {
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
