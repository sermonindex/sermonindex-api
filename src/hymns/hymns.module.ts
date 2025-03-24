import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { HymnsController } from './hymns.controller';
import { HymnsService } from './hymns.service';

@Module({
  controllers: [HymnsController],
  providers: [HymnsService],
  imports: [DatabaseModule],
})
export class HymnsModule {}
