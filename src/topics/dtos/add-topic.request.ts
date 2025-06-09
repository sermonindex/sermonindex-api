import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddTopicRequest {
  @ApiProperty({
    description: 'The topic name',
    example: 'Unity',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief summary of the topic',
    example: 'Unity is the state of being one; oneness...',
    type: String,
  })
  @IsString()
  summary: string;
}
