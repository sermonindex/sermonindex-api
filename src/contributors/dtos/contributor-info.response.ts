import { ApiProperty } from '@nestjs/swagger';
import { ContributorType } from '@prisma/client';
import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';
import { ContributorInfoType } from 'src/contributors/contributor.types';

export class ContributorInfoResponseData {
  @ApiProperty({
    description: 'The unique id of the contributor',
    example: 'H2n9Xr1XDe2fnqES',
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The slug of the contributor',
    example: 'francis-chan',
    type: String,
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'The full name of the contributor',
    example: 'Francis Chan',
    type: String,
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'A link to the contributor image',
    example: 'https://sermonindex3.b-cdn.net/pdf/francischan2.jpg',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  imageUrl: string | null;

  @ApiProperty({
    description: 'The type of the contributor',
    example: ContributorType.INDIVIDUAL,
    enum: ContributorType,
  })
  @IsEnum(ContributorType)
  type: ContributorType;

  @ApiProperty({
    description: 'The number of sermons by the contributor',
    example: 10,
    type: Number,
  })
  @IsNumber()
  sermonCount: number;

  @ApiProperty({
    description: 'The number of hymns by the contributor',
    example: 5,
    type: Number,
  })
  @IsNumber()
  hymnCount: number;

  @ApiProperty({
    description: 'The number of books by the contributor',
    example: 1,
    type: Number,
  })
  @IsNumber()
  bookCount: number;
}

export class ContributorInfoResponse extends ContributorInfoResponseData {
  constructor(data: ContributorInfoResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: ContributorInfoType): ContributorInfoResponse {
    return new ContributorInfoResponse({
      id: data.id,
      fullName: data.fullName,
      slug: data.slug,
      imageUrl: data.imageUrl,
      type: data.type,
      sermonCount: data._count.sermons,
      hymnCount: data._count.hymns,
      bookCount: data._count.books,
    });
  }
}
