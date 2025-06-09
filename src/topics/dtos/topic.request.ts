import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { SortOrder } from 'src/common/types/sort-order.enum';
import { TopicSortBy } from '../topic.types';

export class TopicRequest {
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

  // TODO: Paginate this request
  @IsOptional()
  @IsPositive()
  @Max(5000)
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
