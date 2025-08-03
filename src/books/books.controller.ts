import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { BookChapterResponse } from './dtos/book-chapter.response';
import { BookInfoResponseData } from './dtos/book-info.response';
import { BookRequest } from './dtos/book.request';
import { ListBookResponse } from './dtos/list-book.response';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Retrieve a list of books with optional filters (max 25)',
    operationId: 'listBooks',
  })
  @ApiOkResponse({
    type: ListBookResponse,
  })
  async getBooks(@Query() query: BookRequest) {
    return this.bookService.getBooks(query);
  }

  @Get('/id/:id')
  @ApiOperation({
    summary: 'Retrieve a book by its ID',
    operationId: 'getBookById',
  })
  @ApiParam({
    name: 'id',
    example: 'H2n9Xr1XDe2fnqES',
    description: 'The id of the book to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: BookInfoResponseData,
  })
  async getBookById(@Param('id') id: string) {
    return this.bookService.getBook(id);
  }

  @Get('/id/:id/chapter/:chapter')
  @ApiOperation({
    summary: 'Retrieve a chapter',
    operationId: 'getBookChapter',
  })
  @ApiParam({
    name: 'id',
    example: 'H2n9Xr1XDe2fnqES',
    description: 'The id of the book to retrieve',
    type: String,
  })
  @ApiParam({
    name: 'chapter',
    example: '1',
    description: 'The chapter number to retrieve',
    type: String,
  })
  @ApiOkResponse({
    type: BookChapterResponse,
  })
  async getBookChapter(
    @Param('id') id: string,
    @Param('chapter') chapter: number,
  ) {
    return await this.bookService.getBookChapter(id, chapter);
  }
}
