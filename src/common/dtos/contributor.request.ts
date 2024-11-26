import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class ContributorRequest {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsOptional()
  fullName: string;

  @IsOptional()
  fullNameSlug: string;
}
