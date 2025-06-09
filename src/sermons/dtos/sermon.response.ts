import { ApiProperty } from '@nestjs/swagger';
import { MediaFormat, MediaType } from '@prisma/client';
import { IsString, ValidateIf } from 'class-validator';
import { findDownloadUrl, findStreamUrl } from 'src/common/find-urls.fn';
import { SermonFullType } from 'src/sermons/sermon.types';
import { SermonInfoResponseData } from './sermon-info.response';

export class SermonResponseData extends SermonInfoResponseData {
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

  @ApiProperty({
    description: 'The sermon transcript',
    example: 'If you have a Bible, please turn to...',
    type: String,
    nullable: true,
  })
  @IsString()
  @ValidateIf((o, value) => value !== null)
  transcript: string | null;
}

export class SermonResponse extends SermonResponseData {
  constructor(data: SermonResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: SermonFullType): SermonResponse {
    return new SermonResponse({
      id: data.id,

      contributorSlug: data.contributor.slug,
      contributorFullName: data.contributor.fullName,
      contributorImageUrl: data.contributor.imageUrl,

      title: data.title,
      description: data.description,
      mediaType: data.mediaType,
      duration: data.duration,

      streamUrl: findStreamUrl(data.mediaType, data.urls),
      downloadUrl: findDownloadUrl(data.mediaType, data.urls),

      srtUrl:
        data.urls.find((url) => url.format === MediaFormat.SRT)?.url ?? null,
      vttUrl:
        data.urls.find((url) => url.format === MediaFormat.VTT)?.url ?? null,

      // TODO: Store thumbnail URLs in the database
      thumbnailUrl:
        data.mediaType === MediaType.VIDEO
          ? `https://img.youtube.com/vi/${data.originalMediaId}/0.jpg`
          : null,

      bibleReferences: data.bibleReferences.map((ref) => ({
        text: ref.text,
        book: ref.bookId,
        startChapter: ref.startChapter,
        startVerse: ref.startVerse,
        endChapter: ref.endChapter,
        endVerse: ref.endVerse,
      })),
      topics: data.topics
        ? data.topics.map((topic) => {
            return { slug: topic.slug, name: topic.name };
          })
        : [],
      transcript: data.transcript?.text ?? null,

      views: data.views,

      createdAt: data.createdAt,
    });
  }
}
