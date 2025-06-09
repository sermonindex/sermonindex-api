import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CommentaryController } from './commentary.controller';
import { CommentaryService } from './commentary.service';

@Module({
  providers: [CommentaryService],
  controllers: [CommentaryController],
  imports: [DatabaseModule],
})
export class CommentaryModule {}
