import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'src/common/dtos/pagination.response';
import { ContributorInfoResponse } from './contributor-info.response';

export class ListContributorResponse {
  @ApiProperty({
    description: 'A list of contributors',
    type: [ContributorInfoResponse],
  })
  values: ContributorInfoResponse[];
}

export class ListContributorResponsePaged extends PaginationResponse {}
