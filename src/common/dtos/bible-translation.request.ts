import { IsOptional, IsString } from 'class-validator';

export class BibleTranslationRequest {
  @IsOptional()
  @IsString()
  language: string;
}
