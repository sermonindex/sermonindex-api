import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class HymnRequest {
  @IsOptional()
  fullNameSlug: string;

  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  contributorId: number;
}
