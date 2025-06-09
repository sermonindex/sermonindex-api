import { ApiProperty, OmitType } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { findDownloadUrl, findStreamUrl } from 'src/common/find-urls.fn';
import { SermonInfoType } from 'src/sermons/sermon.types';
import { TopicInfoResponse } from 'src/topics/dtos/topic-info.response';

export class BiblePassage {
  @ApiProperty({
    description: 'The full bible reference',
    example: 'John 3:16-17',
    type: String,
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The book of the bible',
    example: 'John',
    type: String,
  })
  @IsString()
  book: string;

  @ApiProperty({
    description: 'The starting chapter of the passage',
    example: 3,
    type: Number,
    nullable: true,
  })
  @IsNumber()
  @ValidateIf((o, value) => value !== null)
  startChapter: number | null;

  @ApiProperty({
    description: 'The starting verse of the passage',
    example: 16,
    type: Number,
    nullable: true,
  })
  @IsNumber()
  @ValidateIf((o, value) => value !== null)
  startVerse: number | null;

  @ApiProperty({
    description: 'The ending chapter of the passage',
    example: 3,
    type: Number,
    nullable: true,
  })
  @IsNumber()
  @ValidateIf((o, value) => value !== null)
  endChapter: number | null;

  @ApiProperty({
    description: 'The ending verse of the passage',
    example: 17,
    type: Number,
    nullable: true,
  })
  @IsNumber()
  @ValidateIf((o, value) => value !== null)
  endVerse: number | null;
}

export class SermonInfoResponseData {
  @ApiProperty({
    description: 'The unique id of the sermon',
    example: 'cc3dcbb3-cd42-49d8-a87c-cd7f3197285f',
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The full name slug of the contributor',
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
    description: 'The title of the sermon',
    example: 'A New Attitude Toward People',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the sermon',
    example: 'In this sermon, Francis Chan talks about...',
    type: String,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  description: string | null;

  @ApiProperty({
    description: 'The type of media',
    enum: MediaType,
    example: MediaType.VIDEO,
    type: String,
  })
  @IsEnum(MediaType)
  mediaType: MediaType;

  @ApiProperty({
    description: 'The length of the sermon in seconds',
    example: 3600,
    type: Number,
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: 'A url used to stream the sermon',
    example: 'http://www.youtube.com/embed/_APxGs8wnM4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  streamUrl: string | null;

  @ApiProperty({
    description: 'A url used to download the sermon',
    example: 'https://sermonindex2.b-cdn.net/_APxGs8wnM4.mp4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  downloadUrl: string | null;

  @ApiProperty({
    description: 'A url used to display the sermon thumbnail',
    example: 'https://img.youtube.com/vi/_APxGs8wnM4/0.jpg',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  thumbnailUrl: string | null;

  @ApiProperty({
    description: 'A list of bible references',
    type: [BiblePassage],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BiblePassage)
  bibleReferences: BiblePassage[];

  @ApiProperty({
    description: 'A list of topics covered in the sermon',
    type: [OmitType(TopicInfoResponse, ['id', 'sermonCount'])],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OmitType(TopicInfoResponse, ['id', 'sermonCount']))
  topics: Omit<TopicInfoResponse, 'id' | 'sermonCount'>[];

  @ApiProperty({
    description: 'The number of times the sermon has been viewed',
    example: 1000,
    type: Number,
  })
  @IsNumber()
  views: number;

  @ApiProperty({
    description: 'The date the sermon was added to the database',
    example: '2016-10-01T00:00:00.000Z',
    type: Date,
  })
  @IsDate()
  createdAt: Date;
}

export class SermonInfoResponse extends SermonInfoResponseData {
  constructor(data: SermonInfoResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: SermonInfoType): SermonInfoResponse {
    return new SermonInfoResponse({
      id: data.id,

      contributorSlug: data.contributor.slug,
      contributorFullName: data.contributor.fullName,
      contributorImageUrl: data.contributor.imageUrl,

      title: data.title,
      description: data.description,
      mediaType: data.mediaType,
      duration: data.duration,

      streamUrl: findStreamUrl(data.mediaType, data.urls),
      downloadUrl: findDownloadUrl(data.mediaType, data.urls),

      // TODO: Store thumbnail URLs in the database
      thumbnailUrl:
        data.mediaType === MediaType.VIDEO
          ? `https://img.youtube.com/vi/${data.originalMediaId}/0.jpg`
          : null,

      bibleReferences: data.bibleReferences.map((ref) => ({
        text: ref.text,
        book: ref.bookId,
        startChapter: ref.startChapter,
        startVerse: ref.startVerse,
        endChapter: ref.endChapter,
        endVerse: ref.endVerse,
      })),
      topics: data.topics
        ? data.topics.map((topic) => {
            return { slug: topic.slug, name: topic.name };
          })
        : [],

      views: data.views,

      createdAt: data.createdAt,
    });
  }
}
