import { Injectable } from '@nestjs/common';
import { IsString } from 'class-validator';

@Injectable()
export class ConfigService {
  @IsString()
  GLOBAL_PREFIX: 'v1' = 'v1' as const;

  @IsString()
  API_KEY: string = process.env.API_KEY ?? 'test-api-key';
}
