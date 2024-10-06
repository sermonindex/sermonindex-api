import { Module } from '@nestjs/common';
import { ContributorsModule } from './contributors/contributors.module';
import { DatabaseModule } from './database/database.module';
import { SermonsModule } from './sermons/sermons.module';

@Module({
  imports: [DatabaseModule, ContributorsModule, SermonsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
