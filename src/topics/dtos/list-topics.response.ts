import { ApiProperty } from '@nestjs/swagger';
import { TopicInfoResponse } from './topic-info.response';

export class ListTopicsResponse {
  @ApiProperty({
    description: 'A list of topics',
    type: [TopicInfoResponse],
  })
  values: TopicInfoResponse[];
}
