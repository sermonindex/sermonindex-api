import { Controller, Get, Query } from '@nestjs/common';
import { GetSermonsDto } from 'src/common/dtos/get-sermons-dto';
import { SermonsService } from './sermons.service';

@Controller('sermons')
export class SermonsController {
  constructor(private readonly sermonService: SermonsService) {}

  @Get('/')
  async listSermons(@Query() query: GetSermonsDto) {
    return this.sermonService.listSermons({
      where: {
        title: query.title,
        id: query.id,
        contributor: { id: query.contributorId, fullName: query.fullName },
      },
    });
  }

  @Get('/minimal')
  async listMinimalSermons() {
    return this.sermonService.listMinimalSermons({});
  }

  @Get('/featured')
  async listFeaturedSermons() {
    return this.sermonService.listSermons({
      where: { featured: true },
    });
  }

  // TODO: Implement searchSermons
  @Get('/search')
  async searchSermons() {
    return this.sermonService.searchSermons();
  }

  @Get('/recent')
  async listRecentSermons() {
    return this.sermonService.listMinimalSermons({
      orderBy: { createdAt: 'desc' },
      // TODO: Implement pagination
      take: 10,
    });
  }

  @Get('/popular')
  async listPopularSermons() {
    return this.sermonService.listMinimalSermons({
      orderBy: { hits: 'desc' },
      // TODO: Implement pagination
      take: 10,
    });
  }

  // speaker -> name | id
  // featured
  // scripture -> book | chapter | verse
  // topic -> topic
}
