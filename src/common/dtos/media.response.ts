import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class MediaElement {
  @ApiProperty({
    description: 'A url used to stream media',
    example: 'http://www.youtube.com/embed/_APxGs8wnM4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  streamUrl: string | null;

  @ApiProperty({
    description: 'A url used to download media',
    example: 'https://sermonindex2.b-cdn.net/_APxGs8wnM4.mp4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  downloadUrl: string | null;

  @ApiProperty({
    description: 'A url used to show subtitles for the sermon',
    example: 'https://sermonindex3.b-cdn.net/srt-video/_APxGs8wnM4.srt',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  srtUrl: string | null;

  @ApiProperty({
    description: 'A url used to show subtitles for the sermon',
    example: 'https://sermonindex3.b-cdn.net/vtt-video/_APxGs8wnM4.vtt',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  vttUrl: string | null;
}
