import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PaginationRequest } from 'src/common/dtos/pagination.request';
import { SortOrder } from 'src/common/types/sort-order.enum';
import { SermonSortBy } from '../sermon.types';

export class SermonRequest extends PaginationRequest {
  @ApiProperty({
    description: 'The id of a sermon',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The full or partial title of a sermon',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The id of the contributor',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  contributorId: string;

  @ApiProperty({
    description: 'The full name slug of the contributor',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  contributorSlug: string;

  @ApiProperty({
    description: 'The full name of the contributor',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  contributorFullName: string;

  @ApiProperty({
    description: 'The topic of the sermon',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  topic: string;

  @ApiProperty({
    description: 'The book of the Bible the sermon covers',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  book: string;

  @ApiProperty({
    description: 'The chapter of the Bible the sermon covers',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  chapter: number;

  @ApiProperty({
    description: 'The verse of the Bible the sermon covers',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  verse: number;

  @ApiProperty({
    description: 'The type of media the sermon is in',
    enum: MediaType,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MediaType, { each: true })
  @Transform(({ value }) => String(value).split(','))
  mediaType: MediaType[];

  @ApiProperty({
    description: 'A property to sort sermons by',
    type: String,
    required: false,
    enum: SermonSortBy,
    default: SermonSortBy.Views,
  })
  @IsEnum(SermonSortBy)
  @IsOptional()
  sortBy: SermonSortBy = SermonSortBy.Views;

  @ApiProperty({
    description: 'The order to sort in',
    type: String,
    required: false,
    enum: SortOrder,
    default: SortOrder.Desc,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  sortOrder: SortOrder = SortOrder.Desc;
}
