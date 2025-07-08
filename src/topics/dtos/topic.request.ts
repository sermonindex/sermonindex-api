import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Max } from 'class-validator';
import { PaginationRequest } from 'src/common/dtos/pagination.request';
import { SortOrder } from 'src/common/types/sort-order.enum';
import { TopicSortBy } from '../topic.types';

export class TopicRequest extends PaginationRequest {
  @ApiProperty({
    description: 'The full or partial name of a topic',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A property to sort topics by',
    type: String,
    required: false,
    enum: TopicSortBy,
    default: TopicSortBy.Name,
  })
  @IsEnum(TopicSortBy)
  @IsOptional()
  sortBy: TopicSortBy = TopicSortBy.Name;

  @ApiProperty({
    description: 'The order to sort in',
    type: String,
    required: false,
    enum: SortOrder,
    default: SortOrder.Asc,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  sortOrder: SortOrder = SortOrder.Asc;

  @Max(100)
  limit?: number;
}
