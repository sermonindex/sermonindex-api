import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationRequest } from 'src/common/dtos/pagination.request';

export class BookRequest extends PaginationRequest {
  @ApiProperty({
    description: 'The full or partial title of a book',
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
  @IsUUID()
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
    description: 'The type of media the book is in',
    enum: MediaType,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MediaType, { each: true })
  @Transform(({ value }) => String(value).split(','))
  mediaType: MediaType[];
}
