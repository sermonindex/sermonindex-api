import { ApiProperty } from '@nestjs/swagger';
import { ContributorInfoResponse } from './contributor-info.response';

export class ListContributorResponse {
  @ApiProperty({
    description: 'A list of contributors',
    type: [ContributorInfoResponse],
  })
  values: ContributorInfoResponse[];
}
