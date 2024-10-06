import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class GetSermonsDto {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsOptional()
  title: string;

  @IsOptional()
  fullName: string;

  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  contributorId: number;
}
