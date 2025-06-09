import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class BookRequest {
  @ApiProperty({
    description: 'The full or partial title of a book',
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
  @IsUUID()
  contributorId: string;

  @ApiProperty({
    description: 'The full name slug of the contributor',
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
