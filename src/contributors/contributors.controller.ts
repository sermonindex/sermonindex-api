import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { Contributor } from '@prisma/client';
import { GetContributorDto } from 'src/common/dtos/get-contributor.dto';
import { ContributorsService } from './contributors.service';

@Controller('contributors')
export class ContributorsController {
  constructor(private readonly contributorsService: ContributorsService) {}

  @Get('/')
  async listContributors(@Query() query?: GetContributorDto) {
    return this.contributorsService.listContributors({
      where: { fullName: query?.fullName, id: query?.id },
      orderBy: { fullName: 'asc' },
    });
  }

  @Get('/minimal')
  async listMinimalContributors() {
    return this.contributorsService.listMinimalContributors({
      orderBy: { fullName: 'asc' },
    });
  }

  @Get('/featured')
  async listFeaturedContributors() {
    return this.contributorsService.listMinimalContributors({
      where: { featured: true },
      orderBy: { fullName: 'asc' },
    });
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
