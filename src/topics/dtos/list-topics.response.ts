import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'src/common/dtos/pagination.response';
import { TopicInfoResponse } from './topic-info.response';

export class ListTopicsResponse extends PaginationResponse {
  @ApiProperty({
    description: 'A list of topics',
    type: [TopicInfoResponse],
  })
  values: TopicInfoResponse[];
}
