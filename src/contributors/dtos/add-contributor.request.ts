import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddContributorRequest {
  @ApiProperty({
    type: String,
    description: 'Full name of the contributor',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    type: String,
    description: 'A brief biography of the contributor',
  })
  @IsString()
  bio: string;

  @ApiProperty({
    type: String,
    description: 'Link to the contributor image',
    example: 'https://sermonindex1.b-cdn.net/default-si-speaker.png',
  })
  @IsString()
  imageUrl: string = 'https://sermonindex1.b-cdn.net/default-si-speaker.png';
}
