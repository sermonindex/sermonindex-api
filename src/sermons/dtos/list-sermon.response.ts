import { ApiProperty } from '@nestjs/swagger';
import { SermonInfoResponse } from './sermon-info.response';

export class ListSermonResponse {
  @ApiProperty({
    description: 'A list of sermons',
    type: [SermonInfoResponse],
  })
  values: SermonInfoResponse[];

  @ApiProperty({
    description: 'The total number of sermons',
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'The number of sermons per page',
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'The offset of the current page',
    type: Number,
  })
  offset: number;

  @ApiProperty({
    description: 'The next page of sermons',
    type: Number,
    nullable: true,
  })
  nextPage: number | null;
}
