import { $Enums, Contributor } from '@prisma/client';

export class ContributorResponseData {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  description: string | null;
  imageUrl: string | null;
  featured: boolean;
  type: $Enums.ContributorType;
  createdAt: Date;
  updatedAt: Date;
}

export class ContributorResponse extends ContributorResponseData {
  constructor(data: ContributorResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: Contributor): ContributorResponse {
    return new ContributorResponse({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.fullName,
      description: data.description,
      imageUrl: data.imageUrl,
      featured: data.featured,
      type: data.type,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
