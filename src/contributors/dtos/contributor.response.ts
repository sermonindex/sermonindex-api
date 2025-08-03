import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { ContributorFullType } from 'src/contributors/contributor.types';
import { ContributorInfoResponseData } from './contributor-info.response';

export class ContributorImage {
  @ApiProperty({
    description: 'A link to an image of the contributor',
    example: 'https://sermonindex3.b-cdn.net/pdf/francischan2.jpg',
    type: String,
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'The title of the image',
    example: 'Francis Chan',
    type: String,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  title: string | null;

  @ApiProperty({
    description: 'A description of the image',
    example: 'Francis Chan speaking at a conference',
    type: String,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  description: string | null;
}

export class ContributorResponseData extends ContributorInfoResponseData {
  @ApiProperty({
    description: 'The bio of the contributor',
    example: 'Francis Chan is a pastor, author, and speaker...',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  bio: string | null;

  @ApiProperty({
    description: 'The images associated with the contributor',
    type: [ContributorImage],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContributorImage)
  images: ContributorImage[];
}

export class ContributorResponse extends ContributorResponseData {
  constructor(data: ContributorResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: ContributorFullType): ContributorResponse {
    return new ContributorResponse({
      id: data.id,
      slug: data.slug,
      fullName: data.fullName,
      bio: data.bio,
      imageUrl: data.imageUrl,
      type: data.type,
      sermonCount: data._count.sermons,
      hymnCount: data._count.hymns,
      bookCount: data._count.books,
      images: data.images.map((image) => ({
        url: image.url,
        title: image.title,
        description: image.description,
      })),
    });
  }
}
