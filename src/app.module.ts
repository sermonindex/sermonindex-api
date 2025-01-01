import { Module } from '@nestjs/common';
import { BibleModule } from './bible/bible.module';
import { ContributorsModule } from './contributors/contributors.module';
import { DatabaseModule } from './database/database.module';
import { SermonsModule } from './sermons/sermons.module';
import { TopicsModule } from './topics/topics.module';
import { CommentaryController } from './commentary/commentary.controller';
import { CommentaryService } from './commentary/commentary.service';
import { CommentaryModule } from './commentary/commentary.module';

@Module({
  imports: [
    DatabaseModule,
    ContributorsModule,
    SermonsModule,
    TopicsModule,
    BibleModule,
    CommentaryModule,
  ],
  controllers: [CommentaryController],
  providers: [CommentaryService],
})
export class AppModule {}
