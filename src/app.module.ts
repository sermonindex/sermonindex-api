import { Module } from '@nestjs/common';
import { BibleModule } from './bible/bible.module';
import { BooksModule } from './books/books.module';
import { CommentaryModule } from './commentary/commentary.module';
import { ConfigModule } from './config/config.module';
import { ContributorsModule } from './contributors/contributors.module';
import { DatabaseModule } from './database/database.module';
import { HymnsModule } from './hymns/hymns.module';
import { SermonsModule } from './sermons/sermons.module';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [
    BibleModule,
    CommentaryModule,
    ConfigModule,
    ContributorsModule,
    DatabaseModule,
    HymnsModule,
    SermonsModule,
    TopicsModule,
    BooksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
