import { Module } from '@nestjs/common';
import { ContributorsModule } from './contributors/contributors.module';
import { DatabaseModule } from './database/database.module';
import { SermonsModule } from './sermons/sermons.module';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [DatabaseModule, ContributorsModule, SermonsModule, TopicsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
