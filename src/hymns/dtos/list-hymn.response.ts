import { ApiProperty } from '@nestjs/swagger';
import { HymnResponse } from './hymn.response';

export class ListHymnResponse {
  @ApiProperty({
    description: 'A list of hymns',
    type: [HymnResponse],
  })
  values: HymnResponse[];
}
