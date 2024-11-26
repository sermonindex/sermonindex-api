import { $Enums } from '@prisma/client';
import { ContributorFullType } from 'src/contributors/contributor.types';

export class ContributorResponseData {
  id: number;
  fullName: string;
  fullNameSlug: string;
  description: string | null;
  imageUrl: string | null;
  featured: boolean;
  type: $Enums.ContributorType;
  createdAt: Date;
  updatedAt: Date;
  sermonCount: number;
}

export class ContributorResponse extends ContributorResponseData {
  constructor(data: ContributorResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: ContributorFullType): ContributorResponse {
    return new ContributorResponse({
      id: data.id,
      fullName: data.fullName,
      fullNameSlug: data.fullNameSlug,
      description: data.description,
      imageUrl: data.imageUrl,
      featured: data.featured,
      type: data.type,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      sermonCount: data._count.sermons,
    });
  }
}
