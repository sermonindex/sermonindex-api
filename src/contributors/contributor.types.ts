import { Prisma } from '@prisma/client';

export type ContributorFullType = Prisma.ContributorGetPayload<{
  include: {
    _count: {
      select: {
        sermons: true;
      };
    };
    images: true;
  };
}>;
