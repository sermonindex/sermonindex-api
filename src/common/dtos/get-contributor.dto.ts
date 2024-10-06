import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class GetContributorDto {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsOptional()
  fullName: string;
}
