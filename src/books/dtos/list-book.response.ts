import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'src/common/dtos/pagination.response';
import { BookInfoResponse } from './book.response';

export class ListBookResponse extends PaginationResponse {
  @ApiProperty({
    description: 'A list of books',
    type: [BookInfoResponse],
  })
  values: BookInfoResponse[];
}
