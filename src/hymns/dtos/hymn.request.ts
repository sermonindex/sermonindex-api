import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class HymnRequest {
  @ApiProperty({
    description: 'The full or partial title of a hymn',
    example: 'Amazing Grace',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The id of the contributor',
    example: 'b658afde-ab00-430c-b449-d63232f7ae95',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUUID()
  contributorId: string;

  @ApiProperty({
    description: 'The slug of the contributor',
    example: 'abigail-miller',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  contributorSlug: string;

  @ApiProperty({
    description: 'The full name of the contributor',
    example: 'Abigail Miller',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  contributorFullName: string;
}
