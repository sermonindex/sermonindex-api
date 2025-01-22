import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { BibleController } from './bible.controller';
import { BibleService } from './bible.service';

@Module({
  providers: [BibleService],
  controllers: [BibleController],
  imports: [DatabaseModule],
})
export class BibleModule {}
