import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class AddMediaElement {
  @ApiProperty({
    description: 'A url that points to the sermon on youtube',
    example: 'http://www.youtube.com/embed/_APxGs8wnM4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  youtubeUrl: string | null;

  @ApiProperty({
    description: 'A url that points to the sermon on b-cdn.net',
    example: 'https://sermonindex2.b-cdn.net/_APxGs8wnM4.mp4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  bunnyUrl: string | null;

  @ApiProperty({
    description: 'A url that points to the sermon on archive.org',
    example: 'https://sermonindex2.b-cdn.net/_APxGs8wnM4.mp4',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  archiveUrl: string | null;

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
