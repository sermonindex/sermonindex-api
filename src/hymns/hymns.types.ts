import { Prisma } from '@prisma/client';

export type HymnFullType = Prisma.HymnGetPayload<{
  include: {
    urls: true;
  };
}>;
