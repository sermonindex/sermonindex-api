import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  providers: [TopicsService],
  controllers: [TopicsController],
  imports: [DatabaseModule],
})
export class TopicsModule {}
