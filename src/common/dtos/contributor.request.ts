import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsPositive } from 'class-validator';
import {
  ContributorContent,
  ContributorSortBy,
} from 'src/contributors/contributor.types';
import { SortOrder } from '../types/sort-order.enum';

export class ContributorRequest {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsOptional()
  fullName: string;

  @IsOptional()
  fullNameSlug: string;

  @IsOptional()
  @IsArray()
  @IsEnum(ContributorContent, { each: true })
  @Transform(({ value }) => String(value).split(','))
  contentType: ContributorContent[];

  @IsEnum(ContributorSortBy)
  @IsOptional()
  @ApiProperty({
    description: 'A property to sort contributors by',
    type: String,
    required: false,
    enum: ContributorSortBy,
    default: ContributorSortBy.FullName,
  })
  sortBy: ContributorSortBy = ContributorSortBy.FullName;

  @IsEnum(SortOrder)
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @ApiProperty({
    description: 'The order to sort in',
    type: String,
    required: false,
    enum: SortOrder,
    default: SortOrder.Asc,
  })
  sortOrder: SortOrder = SortOrder.Asc;
}
