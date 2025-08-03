import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import { IsString, ValidateIf } from 'class-validator';
import { findStreamUrl } from 'src/common/find-urls.fn';
import { BookChapterType } from '../book.types';
import { BookChapterInfo } from './book-chapter-info.response';

export class BookChapterResponseData extends BookChapterInfo {
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

export class BookChapterResponse extends BookChapterResponseData {
  constructor(data: BookChapterResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: BookChapterType): BookChapterResponse {
    return new BookChapterResponse({
      title: data.title,
      number: data.number,
      streamUrl: data.urls ? findStreamUrl(MediaType.AUDIO, data.urls) : null,
      text: data.text,
    });
  }
}
