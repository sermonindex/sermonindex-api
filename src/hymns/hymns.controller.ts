import { Controller, Get, Query } from '@nestjs/common';
import { HymnRequest } from './dtos/hymn.request';
import { HymnsService } from './hymns.service';

@Controller('hymns')
export class HymnsController {
  constructor(private readonly hymnsService: HymnsService) {}

  @Get('/')
  async listHymns(@Query() query: HymnRequest) {
    const result = await this.hymnsService.listHymns(query);

    return result;
  }
}
