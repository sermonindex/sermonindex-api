import { Injectable, NotFoundException } from '@nestjs/common';
import { ContributorResponse } from 'src/common/dtos/contributor.response';
import { DatabaseService } from 'src/database/database.service';
import { HymnRequest } from './dtos/hymn.request';
import { HymnResponse } from './dtos/hymn.response';

@Injectable()
export class HymnsService {
  constructor(private db: DatabaseService) {}

  async listHymns(query: HymnRequest) {
    const { fullNameSlug, contributorId } = query;

    const contributor = await this.db.contributor.findUnique({
      where: { id: contributorId, fullNameSlug },
      include: {
        _count: {
          select: { sermons: true, hymns: true },
        },
        images: true,
      },
    });

    if (!contributor) {
      return new NotFoundException('Contributor not found');
    }

    const hymns = await this.db.hymn.findMany({
      where: {
        contributorId: contributorId,
        contributor: {
          fullNameSlug: fullNameSlug,
        },
      },
      include: {
        urls: true,
      },
    });

    return {
      contributor: ContributorResponse.fromDB(contributor),
      values: hymns.map((hymn) => HymnResponse.fromDB(hymn)),
    };
  }
}
