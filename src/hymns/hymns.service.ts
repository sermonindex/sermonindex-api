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
}
