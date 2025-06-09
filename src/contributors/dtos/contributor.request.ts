import { ApiProperty } from '@nestjs/swagger';
import { ContributorContent } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContributorSortBy } from 'src/contributors/contributor.types';
import { SortOrder } from '../../common/types/sort-order.enum';

export class ContributorRequest {
  @ApiProperty({
    description: 'The id of a contributor',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The slug of a contributor',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'The full name of a contributor',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'The type of content a contributor produces',
    enum: ContributorContent,
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEnum(ContributorContent)
  content: ContributorContent;

  @ApiProperty({
    description: 'A property to sort contributors by',
    type: String,
    required: false,
    enum: ContributorSortBy,
    default: ContributorSortBy.FullName,
  })
  @IsEnum(ContributorSortBy)
  @IsOptional()
  sortBy: ContributorSortBy = ContributorSortBy.FullName;

  @ApiProperty({
    description: 'The order to sort contributors in',
    type: String,
    required: false,
    enum: SortOrder,
    default: SortOrder.Asc,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  sortOrder: SortOrder = SortOrder.Asc;
}
