import { Injectable } from '@nestjs/common';
import { MediaSource } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

@Injectable()
export class ConfigService {
  @IsString()
  GLOBAL_PREFIX: 'v1' = 'v1' as const;

  @IsString()
  API_KEY: string = 'test-api-key';
}
