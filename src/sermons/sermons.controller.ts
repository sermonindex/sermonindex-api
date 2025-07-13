import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { ApiKeyAuthGuard } from 'src/auth/api-key-auth.guard';
import { PaginationRequest } from 'src/common/dtos/pagination.request';
import { AddSermonRequest } from './dtos/add-sermon.request';
import { ListSermonResponsePaged } from './dtos/list-sermon.response';
import { SermonRequest } from './dtos/sermon.request';
import { SermonResponse } from './dtos/sermon.response';
import { SermonsService } from './sermons.service';

@Controller('sermons')
export class SermonsController {
  constructor(private readonly sermonService: SermonsService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Retrieve a list of sermons with optional filters (max 25)',
    operationId: 'listSermons',
  })
  @ApiOkResponse({
    type: ListSermonResponsePaged,
  })
  async listSermons(@Query() query: SermonRequest) {
    return this.sermonService.listSermons(query);
  }

  @Get('/id/:id')
  @ApiOperation({
    summary: 'Retrieve a sermon by its ID',
    operationId: 'getSermonById',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the sermon to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: SermonResponse,
  })
  async getSermonById(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.sermonService.getSermon(id);

    if (!result) {
      throw new NotFoundException(`Sermon with ID ${id} not found`);
    }

    return SermonResponse.fromDB(result);
  }

  @Get('/featured')
  @ApiOperation({
    summary: 'Retrieve a list of featured sermons',
    operationId: 'listFeaturedSermon',
  })
  @ApiOkResponse({
    type: ListSermonResponsePaged,
  })
  async getFeaturedSermon(@Query() query: PaginationRequest) {
    return this.sermonService.listFeaturedSermons(query);
  }

  @Get('/viewed')
  @ApiOperation({
    summary: 'Retrieve a list of recently viewed sermons',
    operationId: 'listRecentlyViewedSermons',
  })
  @ApiOkResponse({
    type: ListSermonResponsePaged,
  })
  async listRecentlyViewedSermons(@Query() query: PaginationRequest) {
    return this.sermonService.listRecentlyViewedSermons(query);
  }

  @Post('/viewed/id/:id')
  @ApiExcludeEndpoint()
  async recordSermonView(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Ip() ip: string,
  ) {
    return this.sermonService.recordSermonView(id, ip);
  }

  @Post('/')
  @ApiSecurity('Api-Key')
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({
    summary: 'Add a sermon',
    operationId: 'addSermon',
  })
  async addSermon(@Body() data: AddSermonRequest) {
    return this.sermonService.addSermon(data);
  }

  @Post('/featured/id/:id')
  @ApiSecurity('Api-Key')
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({
    summary: 'Update the featured sermon list',
    operationId: 'updateFeaturedSermonList',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the sermon to add to the featured list',
    type: String,
  })
  async updateFeaturedSermonList(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sermonService.updateFeaturedSermonList(id);
  }

  @Delete('/id/:id')
  @ApiSecurity('Api-Key')
  @UseGuards(ApiKeyAuthGuard)
  @ApiOperation({
    summary: 'Delete a sermon',
    description:
      '⚠️ WARNING: This action is irreversible and will permanently delete the sermon and all associated data.',
    operationId: 'deleteSermon',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the sermon to delete',
    type: String,
  })
  async deleteSermon(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sermonService.deleteSermon(id);
  }
}
