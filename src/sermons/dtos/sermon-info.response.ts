import { MediaSource, MediaType } from '@prisma/client';
import { BiblePassage } from 'src/common/types/bible-passage.type';
import { SermonFullType } from 'src/sermons/sermon.types';

export class SermonInfoResponseData {
  id: number;

  contributorFullName: string;
  contributorFullNameSlug: string;
  contributorImageUrl: string | null;

  title: string;
  description: string | null;
  mediaType: MediaType;

  streamUrl: string | null;
  downloadUrl: string | null;
  thumbnailUrl: string | null;

  bibleReferences: BiblePassage[];
  topics: string[];

  hits: number;
  featured: boolean;

  createdAt: Date;
}

export class SermonInfoResponse extends SermonInfoResponseData {
  constructor(data: SermonInfoResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: Omit<SermonFullType, 'transcript'>): SermonInfoResponse {
    return new SermonInfoResponse({
      id: data.id,

      contributorFullName: data.contributor.fullName,
      contributorFullNameSlug: data.contributor.fullNameSlug,
      contributorImageUrl: data.contributor.imageUrl,

      title: data.title,
      description: data.description,
      mediaType: data.mediaType,

      // TODO: Make this toggle based on a config value
      streamUrl:
        data.urls.find(
          (url) =>
            url.type ===
              (data.mediaType === MediaType.AUDIO
                ? MediaType.AUDIO
                : MediaType.VIDEO) &&
            url.source ===
              (data.mediaType === MediaType.AUDIO
                ? MediaSource.ARCHIVE
                : MediaSource.YOUTUBE),
        )?.url ?? null,
      downloadUrl:
        data.urls.find(
          (url) =>
            url.type ===
              (data.mediaType === MediaType.AUDIO
                ? MediaType.AUDIO
                : MediaType.VIDEO) &&
            url.source ===
              (data.mediaType === MediaType.AUDIO
                ? MediaSource.ARCHIVE
                : MediaSource.YOUTUBE),
        )?.url ?? null,

      // TODO: Store thumbnail URLs in the database
      thumbnailUrl:
        data.mediaType === MediaType.VIDEO
          ? `https://img.youtube.com/vi/${data.originalId}/0.jpg`
          : null,

      bibleReferences: data.bibleReferences.map((ref) => ({
        text: ref.text,
        book: ref.bookId,
        startChapter: ref.startChapter,
        startVerse: ref.startVerse,
        endChapter: ref.endChapter,
        endVerse: ref.endVerse,
      })),
      topics: data.topics ? data.topics.map((topic) => topic.name) : [],

      hits: data.hits,
      featured: data.featured,

      createdAt: data.createdAt,
    });
  }
}
