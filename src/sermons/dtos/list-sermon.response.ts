import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'src/common/dtos/pagination.response';
import { SermonInfoResponse } from './sermon-info.response';

export class ListSermonResponse {
  @ApiProperty({
    description: 'A list of sermons',
    type: [SermonInfoResponse],
  })
  values: SermonInfoResponse[];
}

export class ListSermonResponsePaged extends PaginationResponse {
  @ApiProperty({
    description: 'A list of sermons',
    type: [SermonInfoResponse],
  })
  values: SermonInfoResponse[];
}
