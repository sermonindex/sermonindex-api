import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  providers: [BookService],
  controllers: [BookController],
  imports: [DatabaseModule],
})
export class BookModule {}
