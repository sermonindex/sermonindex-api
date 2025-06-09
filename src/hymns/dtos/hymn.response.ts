import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { IsEnum, IsNumber, IsString, ValidateIf } from 'class-validator';
import { findDownloadUrl, findStreamUrl } from 'src/common/find-urls.fn';
import { HymnFullType } from '../hymn.types';

export class HymnResponseData {
  @ApiProperty({
    description: 'The unique id of the hymn',
    example: 'cc3dcbb3-cd42-49d8-a87c-cd7f3197285f',
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
  contributorSlug: string;

  @ApiProperty({
    description: 'The full name of the contributor',
    example: 'Francis Chan',
    type: String,
  })
  @IsString()
  contributorFullName: string;

  @ApiProperty({
    description: 'A link to the contributor image',
    example: 'https://sermonindex3.b-cdn.net/pdf/francischan2.jpg',
    type: String,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  contributorImageUrl: string | null;

  @ApiProperty({
    description: 'The title of the hymn',
    example: 'A Mighty Fortress Is Our God',
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

  @ApiProperty({
    description: 'The length of the hymn in seconds',
    example: 300,
    type: Number,
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'A url used to stream the hymn',
    example: 'http://www.youtube.com/embed/_APxGs8wnM4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  streamUrl: string | null;

  @ApiProperty({
    description: 'A url used to download the hymn',
    example: 'https://sermonindex2.b-cdn.net/_APxGs8wnM4.mp4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  downloadUrl: string | null;

  @ApiProperty({
    description: 'The number of times the hymn has been viewed',
    example: 1000,
    type: Number,
  })
  @IsNumber()
  views: number;
}

export class HymnResponse extends HymnResponseData {
  constructor(data: HymnResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: HymnFullType): HymnResponse {
    return new HymnResponse({
      id: data.id,
      contributorSlug: data.contributor.slug,
      contributorFullName: data.contributor.fullName,
      contributorImageUrl: data.contributor.imageUrl,
      title: data.title,
      mediaType: data.mediaType,
      duration: data.duration,
      streamUrl: findStreamUrl(data.mediaType, data.urls),
      downloadUrl: findDownloadUrl(data.mediaType, data.urls),
      views: data.views,
    });
  }
}
