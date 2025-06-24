import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { HymnRequest } from './dtos/hymn.request';
import { HymnResponse } from './dtos/hymn.response';
import { ListHymnResponse } from './dtos/list-hymn.response';
import { HymnsService } from './hymns.service';

@Controller('hymns')
export class HymnsController {
  constructor(private readonly hymnsService: HymnsService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Retrieve a list of hymns with optional filters',
    operationId: 'listHymns',
  })
  @ApiOkResponse({
    type: ListHymnResponse,
  })
  async listHymns(@Query() query: HymnRequest) {
    const result = await this.hymnsService.listHymns(query);

    return {
      values: result.map((hymn) => HymnResponse.fromDB(hymn)),
    };
  }
}
