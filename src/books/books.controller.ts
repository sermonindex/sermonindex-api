import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiExcludeController,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { BookRequest } from './dtos/book.request';
import { ListBookResponse } from './dtos/list-book.response';

@Controller('books')
@ApiExcludeController()
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
    example: 'ae978e79-56e4-43b8-bb2b-77b979928137',
    description: 'The id of the book to retrieve',
    type: String,
  })
  // @ApiOkResponse({
  //   type: SermonResponse,
  // })
  async getBookById(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.bookService.getBook(id);

    if (!result) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return result;
  }

  @Get('/id/:id/chapter/:chapter')
  @ApiOperation({
    summary: 'Retrieve a chapter',
    operationId: 'getBookChapter',
  })
  @ApiParam({
    name: 'id',
    example: 'ae978e79-56e4-43b8-bb2b-77b979928137',
    description: 'The id of the book to retrieve',
    type: String,
  })
  // @ApiOkResponse({
  //   type: SermonResponse,
  // })
  async getBookChapter(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('chapter') chapter: number,
  ) {
    const result = await this.bookService.getBookChapter(id, chapter);

    if (!result) {
      throw new NotFoundException(`Chapter ${chapter} not found`);
    }

    return result;
  }
}
