import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { IsNumber, IsString, ValidateIf } from 'class-validator';
import { findStreamUrl } from 'src/common/find-urls.fn';
import { ChapterType } from '../book.types';

export class ChapterResponseData {
  @ApiProperty({
    description: 'The unique id of the chapter',
    example: 'cc3dcbb3-cd42-49d8-a87c-cd7f3197285f',
    type: String,
  })
  @IsString()
  id: string;

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

  @ApiProperty({
    description: 'A url used to stream the chapter audio',
    example: 'http://www.youtube.com/embed/_APxGs8wnM4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  streamUrl: string | null;

  @ApiProperty({
    description: 'The chapter text',
    example: 'For verily I say unto you, that whosoever',
    type: String,
  })
  @IsString()
  text: string;
}

export class ChapterResponse extends ChapterResponseData {
  constructor(data: ChapterResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: ChapterType): ChapterResponse {
    return new ChapterResponse({
      id: data.id,
      title: data.title,
      number: data.number,
      streamUrl: data.urls ? findStreamUrl(MediaType.AUDIO, data.urls) : null,
      text: data.text,
    });
  }
}
