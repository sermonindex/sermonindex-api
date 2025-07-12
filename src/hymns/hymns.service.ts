import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { HymnRequest } from './dtos/hymn.request';

@Injectable()
export class HymnsService {
  constructor(private db: DatabaseService) {}

  async listHymns(query: HymnRequest) {
    const { contributorId, contributorSlug, contributorFullName, title } =
      query;

    return this.db.hymn.findMany({
      where: {
        title: { contains: title, mode: 'insensitive' },
        contributor: {
          id: contributorId,
          slug: contributorSlug,
          fullName: contributorFullName,
        },
      },
      include: {
        urls: true,
        contributor: true,
      },
    });
  }

  async recordHymnView(id: string, ip: string) {
    const recentlyViewed = await this.db.recentHymnView.findFirst({
      where: {
        hymnId: id,
        ipAddress: ip,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!recentlyViewed) {
      await this.db.recentHymnView.create({
        data: {
          hymnId: id,
          ipAddress: ip,
        },
      });

      await this.db.hymn.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    return { status: 'OK' };
  }
}
