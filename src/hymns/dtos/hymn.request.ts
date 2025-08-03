import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class HymnRequest {
  @ApiProperty({
    description: 'The full or partial title of a hymn',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The id of the contributor',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  contributorId: string;

  @ApiProperty({
    description: 'The slug of the contributor',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  contributorSlug: string;

  @ApiProperty({
    description: 'The full name of the contributor',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  contributorFullName: string;
}
