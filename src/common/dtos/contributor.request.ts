import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsPositive } from 'class-validator';
import { ContributorContent } from 'src/contributors/contributor.types';

export class ContributorRequest {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  id: number;

  @IsOptional()
  fullName: string;

  @IsOptional()
  fullNameSlug: string;

  @IsOptional()
  @IsArray()
  @IsEnum(ContributorContent, { each: true })
  @Transform(({ value }) => String(value).split(','))
  contentType: ContributorContent[];
}
