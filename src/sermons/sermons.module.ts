import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SermonsController } from './sermons.controller';
import { SermonsService } from './sermons.service';

@Module({
  providers: [SermonsService],
  controllers: [SermonsController],
  imports: [DatabaseModule],
})
export class SermonsModule {}
