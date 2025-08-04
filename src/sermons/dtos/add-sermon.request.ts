import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { AddMediaElement } from 'src/common/dtos/add-media.request';

export class AddSermonRequest {
  @ApiProperty({
    description: 'The unique id of the contributor',
    example: 'H2n9Xr1XDe2fnqES',
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
    description: 'A url used to display the sermon thumbnail',
    example: 'https://img.youtube.com/vi/_APxGs8wnM4/0.jpg',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  thumbnailUrl: string | null;

  @ApiProperty({
    description:
      'A media element containing URLs for streaming, downloading, and subtitles',
    type: AddMediaElement,
    nullable: true,
  })
  @ValidateIf((o, value) => value !== null)
  @ValidateNested({ each: true })
  @Type(() => AddMediaElement)
  audio: AddMediaElement | null;

  @ApiProperty({
    description:
      'A media element containing URLs for streaming, downloading, and subtitles',
    type: AddMediaElement,
    nullable: true,
  })
  @ValidateIf((o, value) => value !== null)
  @ValidateNested({ each: true })
  @Type(() => AddMediaElement)
  video: AddMediaElement | null;

  @ApiProperty({
    description: 'A list of bible references',
    example: ['John 3:16', 'Romans 8:28-30'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsString({ each: true })
  bibleReferences: string[];

  @ApiProperty({
    description: 'A list of topics covered in the sermon',
    example: ['Faith', 'Love'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  topics: string[];

  @ApiProperty({
    description: 'The sermon transcript',
    example: 'If you have a Bible, please turn to...',
    type: String,
  })
  @IsString()
  transcript: string;
}
