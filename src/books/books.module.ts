import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  providers: [BooksService],
  controllers: [BooksController],
  imports: [DatabaseModule],
})
export class BooksModule {}
