import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsPositive, IsString } from 'class-validator';

export class BibleVerseRequest {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => String(value).split(','))
  translations: string[];
}
