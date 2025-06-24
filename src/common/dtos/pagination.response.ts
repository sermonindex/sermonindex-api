import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse {
  @ApiProperty({
    description: 'The total number of items',
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'The number of items per page',
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'The offset of the current page',
    type: Number,
  })
  offset: number;

  @ApiProperty({
    description: 'The next page of items',
    type: Number,
    nullable: true,
  })
  nextPage: number | null;
}
