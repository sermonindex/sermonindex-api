import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsPositive()
  @Max(50)
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  offset?: number;
}
