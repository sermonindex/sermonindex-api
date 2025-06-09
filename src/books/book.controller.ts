import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiParam } from '@nestjs/swagger';
import { BookService } from './book.service';
import { BookRequest } from './dtos/book.request';

@Controller('books')
@ApiExcludeController()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('/')
  async getBooks(@Query() query: BookRequest) {
    const result = await this.bookService.getBooks(query);

    return {
      values: result,
    };
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
