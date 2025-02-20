import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsPositive } from 'class-validator';

export class SermonRequest {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    description: 'The id of a sermon',
    type: Number,
    required: false,
  })
  id: number;

  @IsOptional()
  @ApiProperty({
    description: 'The title of a sermon',
    type: String,
    required: false,
  })
  title: string;

  @IsOptional()
  fullName: string;

  @IsOptional()
  fullNameSlug: string;

  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  contributorId: number;

  @IsOptional()
  topic: string;

  @IsOptional()
  book: string;

  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  chapter: number;

  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  verse: number;

  @IsOptional()
  @IsArray()
  @IsEnum(MediaType, { each: true })
  @Transform(({ value }) => String(value).split(','))
  mediaType: MediaType[];
}
