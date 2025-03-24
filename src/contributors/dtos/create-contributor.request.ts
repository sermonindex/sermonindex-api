import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateContributorRequest {
  @ApiProperty({
    type: String,
    description: 'Full name of the contributor',
    example: 'Francis Chan',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    type: String,
    description: 'Description of the contributor',
    example: 'Francis Chan is a pastor, author, and speaker...',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    description: 'Link to the contributor image',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the contributor should be featured or not',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  featured: boolean = false;
}
