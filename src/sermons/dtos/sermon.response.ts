import { ApiProperty } from '@nestjs/swagger';
import { MediaFormat, MediaType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsString, ValidateIf, ValidateNested } from 'class-validator';
import { MediaElement } from 'src/common/dtos/media.response';
import { findDownloadUrl, findStreamUrl } from 'src/common/find-urls.fn';
import { SermonFullType } from 'src/sermons/sermon.types';
import { SermonInfoResponseData } from './sermon-info.response';

export class SermonResponseData extends SermonInfoResponseData {
  @ApiProperty({
    description:
      'A media element containing URLs for streaming, downloading, and subtitles',
    type: MediaElement,
    nullable: true,
  })
  @ValidateIf((o, value) => value !== null)
  @ValidateNested({ each: true })
  @Type(() => MediaElement)
  audio: MediaElement | null;

  @ApiProperty({
    description:
      'A media element containing URLs for streaming, downloading, and subtitles',
    type: MediaElement,
    nullable: true,
  })
  @ValidateIf((o, value) => value !== null)
  @ValidateNested({ each: true })
  @Type(() => MediaElement)
  video: MediaElement | null;

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
    const audioStreamUrl = findStreamUrl(MediaType.AUDIO, data.urls);
    const audioDownloadUrl = findDownloadUrl(MediaType.AUDIO, data.urls);

    return new SermonResponse({
      id: data.id,

      contributorSlug: data.contributor.slug,
      contributorFullName: data.contributor.fullName,
      contributorImageUrl: data.contributor.imageUrl,

      title: data.title,
      description: data.description,
      mediaType: data.mediaType,
      duration: data.duration,
      thumbnailUrl: data.thumbnailUrl,

      audio:
        audioStreamUrl || audioDownloadUrl
          ? {
              streamUrl: audioStreamUrl,
              downloadUrl: audioDownloadUrl,
              srtUrl:
                data.urls.find(
                  (url) =>
                    url.format === MediaFormat.SRT &&
                    url.type === MediaType.AUDIO,
                )?.url ?? null,
              vttUrl:
                data.urls.find(
                  (url) =>
                    url.format === MediaFormat.VTT &&
                    url.type === MediaType.AUDIO,
                )?.url ?? null,
            }
          : null,

      video:
        data.mediaType === MediaType.VIDEO
          ? {
              streamUrl: findStreamUrl(MediaType.VIDEO, data.urls),
              downloadUrl: findDownloadUrl(MediaType.VIDEO, data.urls),
              srtUrl:
                data.urls.find(
                  (url) =>
                    url.format === MediaFormat.SRT &&
                    url.type === MediaType.VIDEO,
                )?.url ?? null,
              vttUrl:
                data.urls.find(
                  (url) =>
                    url.format === MediaFormat.VTT &&
                    url.type === MediaType.VIDEO,
                )?.url ?? null,
            }
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
