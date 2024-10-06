import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ContributorsController } from './contributors.controller';
import { ContributorsService } from './contributors.service';

@Module({
  providers: [ContributorsService],
  controllers: [ContributorsController],
  imports: [DatabaseModule],
})
export class ContributorsModule {}
