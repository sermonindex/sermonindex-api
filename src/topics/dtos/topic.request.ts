import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { SortOrder } from 'src/common/types/sort-order.enum';
import { TopicSortBy } from '../topic.types';

export class TopicRequest {
  @IsOptional()
  @ApiProperty({
    description: 'A topic name',
    type: String,
    required: false,
  })
  name: string;

  @IsEnum(TopicSortBy)
  @IsOptional()
  @ApiProperty({
    description: 'A property to sort topics by',
    type: String,
    required: false,
    enum: TopicSortBy,
    default: TopicSortBy.Name,
  })
  sortBy: TopicSortBy = TopicSortBy.Name;

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
