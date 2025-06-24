import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { BookInfoType } from '../book.types';

export class BookInfoResponseData {
  @ApiProperty({
    description: 'The unique id of the book',
    example: 'cc3dcbb3-cd42-49d8-a87c-cd7f3197285f',
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The full name slug of the contributor',
    example: 'a-w-tozer',
    type: String,
  })
  @IsString()
  contributorSlug: string;

  @ApiProperty({
    description: 'The full name of the contributor',
    example: 'A.W. Tozer',
    type: String,
  })
  @IsString()
  contributorFullName: string;

  @ApiProperty({
    description: 'A link to the contributor image',
    // TODO
    example: 'https://sermonindex3.b-cdn.net/pdf/francischan2.jpg',
    type: String,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  contributorImageUrl: string | null;

  @ApiProperty({
    description: 'The title of the book',
    example: 'The Pursuit of God',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The type of media',
    enum: MediaType,
    example: MediaType.AUDIO,
    type: String,
  })
  @IsEnum(MediaType)
  mediaType: MediaType;
}

export class BookInfoResponse extends BookInfoResponseData {
  constructor(data: BookInfoResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: BookInfoType): BookInfoResponse {
    return new BookInfoResponse({
      id: data.id,

      contributorSlug: data.contributor.slug,
      contributorFullName: data.contributor.fullName,
      contributorImageUrl: data.contributor.imageUrl,

      title: data.title,
      mediaType: data.mediaType,
    });
  }
}
