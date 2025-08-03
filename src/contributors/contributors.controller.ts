import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { ContributorContent } from '@prisma/client';
import { ApiKeyAuthGuard } from 'src/auth/api-key-auth.guard';
import { ContributorsService } from './contributors.service';
import { AddContributorRequest } from './dtos/add-contributor.request';
import { ContributorRequest } from './dtos/contributor.request';
import { ContributorResponse } from './dtos/contributor.response';
import {
  ListContributorResponse,
  ListContributorResponsePaged,
} from './dtos/list-contributor.response';

@Controller('contributors')
export class ContributorsController {
  constructor(private readonly contributorsService: ContributorsService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Retrieve a list of contributors with optional filters',
    operationId: 'listContributors',
  })
  @ApiOkResponse({
    type: ListContributorResponsePaged,
  })
  async listContributors(@Query() query: ContributorRequest) {
    return this.contributorsService.listContributors(query);
  }

  @Get('/featured/content/:content')
  @ApiOperation({
    summary: 'Retrieve a list of featured contributors',
    operationId: 'listFeaturedContributors',
  })
  @ApiParam({
    name: 'content',
    example: ContributorContent.SERMONS,
    description: 'The type of content a contributor is featured for',
    enum: ContributorContent,
    type: String,
  })
  @ApiOkResponse({
    type: ListContributorResponse,
  })
  async listFeaturedContributors(
    @Param('content', new ParseEnumPipe(ContributorContent))
    content: ContributorContent,
  ) {
    return this.contributorsService.listFeaturedContributors(content);
  }

  @Get('/id/:id')
  @ApiOperation({
    summary: 'Retrieve a contributor by its id',
    operationId: 'getContributorById',
  })
  @ApiParam({
    name: 'id',
    example: 'H2n9Xr1XDe2fnqES',
    description: 'The id of the contributor to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: ContributorResponse,
  })
  async getContributorById(@Param('id') id: string) {
    const result = await this.contributorsService.getContributor({ id });

    if (!result) {
      throw new NotFoundException('Contributor not found');
    }

    return ContributorResponse.fromDB(result);
  }

  @Get('/slug/:slug')
  @ApiOperation({
    summary: 'Retrieve a contributor by its slug',
    operationId: 'getContributorBySlug',
  })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the contributor to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: ContributorResponse,
  })
  async getContributorBySlug(@Param('slug') slug: string) {
    const result = await this.contributorsService.getContributor({ slug });

    if (!result) {
      throw new NotFoundException('Contributor not found');
    }

    return ContributorResponse.fromDB(result);
  }

  @Post('/')
  @ApiSecurity('Api-Key')
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({
    summary: 'Add a contributor.',
    operationId: 'addContributor',
  })
  async addContributor(@Body() data: AddContributorRequest) {
    return this.contributorsService.addContributor(data);
  }

  @Post('featured/id/:id/content/:content')
  @ApiSecurity('Api-Key')
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({
    summary: 'Update the featured contributor list.',
    operationId: 'updateFeaturedContributorList',
  })
  @ApiParam({
    name: 'id',
    example: 'H2n9Xr1XDe2fnqES',
    description: 'The id of the contributor to update',
    type: String,
  })
  @ApiParam({
    name: 'content',
    example: ContributorContent.SERMONS,
    description: 'The type of content a contributor is featured for',
    enum: ContributorContent,
    type: String,
  })
  async updateFeaturedContributorList(
    @Param('id') id: string,
    @Param('content', new ParseEnumPipe(ContributorContent))
    content: ContributorContent,
  ) {
    return this.contributorsService.updateFeaturedContributorList(id, content);
  }

  @Patch('/id/:id')
  @ApiSecurity('Api-Key')
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({
    summary: 'Update a contributor.',
    operationId: 'updateContributor',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the contributor to update',
    type: String,
  })
  async updateContributor(
    @Param('id') id: string,
    @Body() data: Partial<AddContributorRequest>,
  ) {
    return this.contributorsService.updateContributor(id, data);
  }

  @Delete('/id/:id')
  @ApiSecurity('Api-Key')
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({
    summary: 'Delete a contributor.',
    description:
      '⚠️ WARNING: This action is irreversible and will permanently delete the contributor and all associated data.',
    operationId: 'deleteContributor',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the contributor to delete',
    type: String,
  })
  async deleteContributor(@Param('id') id: string) {
    return this.contributorsService.deleteContributor(id);
  }

  @Delete('featured/id/:id/content/:content')
  @ApiSecurity('Api-Key')
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({
    summary: 'Removes a contributor from the featured list.',
    operationId: 'deleteFeaturedContributor',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the contributor to delete',
    type: String,
  })
  @ApiParam({
    name: 'content',
    example: ContributorContent.SERMONS,
    description: 'The type of content a contributor is featured for',
    enum: ContributorContent,
    type: String,
  })
  async deleteFeaturedContributor(
    @Param('id') id: string,
    @Param('content', new ParseEnumPipe(ContributorContent))
    content: ContributorContent,
  ) {
    return this.contributorsService.deleteFeaturedContributor(id, content);
  }
}
