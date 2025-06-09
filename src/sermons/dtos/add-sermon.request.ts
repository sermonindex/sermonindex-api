import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class AddSermonRequest {
  @ApiProperty({
    description: 'The unique id of the contributor',
    example: 'cc3dcbb3-cd42-49d8-a87c-cd7f3197285f',
    type: String,
  })
  @IsString()
  contributorId: string;

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
  description: string;

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
    description: 'A url that points to the sermon on youtube',
    example: 'http://www.youtube.com/embed/_APxGs8wnM4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  youtubeUrl: string | null;

  @ApiProperty({
    description: 'A url that points to the sermon on b-cdn.net',
    example: 'https://sermonindex2.b-cdn.net/_APxGs8wnM4.mp4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  bunnyUrl: string | null;

  @ApiProperty({
    description: 'A url that points to the sermon on archive.org',
    example: 'https://sermonindex2.b-cdn.net/_APxGs8wnM4.mp4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  archiveUrl: string | null;

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
    description: 'A url used to show subtitles for the sermon',
    example: 'https://sermonindex3.b-cdn.net/srt-video/_APxGs8wnM4.srt',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  srtUrl: string | null;

  @ApiProperty({
    description: 'A url used to show subtitles for the sermon',
    example: 'https://sermonindex3.b-cdn.net/vtt-video/_APxGs8wnM4.vtt',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  vttUrl: string | null;

  @ApiProperty({
    description: 'A list of bible references',
    example: ['John 3:16', 'Romans 8:28-30'],
    type: [String],
  })
  @IsArray()
  @Min(1)
  @Max(5)
  @IsString({ each: true })
  @Transform(({ value }) => String(value).split(','))
  bibleReferences: string[];

  @ApiProperty({
    description: 'A list of topics covered in the sermon',
    example: ['faith', 'love'],
    type: [String],
  })
  @IsArray()
  @Min(1)
  @Max(2)
  @IsString({ each: true })
  @Transform(({ value }) => String(value).split(','))
  topics: string[];

  @ApiProperty({
    description: 'The sermon transcript',
    example: 'If you have a Bible, please turn to...',
    type: String,
  })
  @IsString()
  transcript: string;
}
