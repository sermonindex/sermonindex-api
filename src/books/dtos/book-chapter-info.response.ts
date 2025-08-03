import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BookChapterInfo {
  @ApiProperty({
    description: 'The title of the chapter',
    example: 'Chapter 1 - Have Faith in God',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The chapter number',
    example: 1,
    type: Number,
  })
  @IsNumber()
  number: number;
}
