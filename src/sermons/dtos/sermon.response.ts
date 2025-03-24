import { MediaFormat, MediaSource, MediaType } from '@prisma/client';
import { SermonFullType } from 'src/sermons/sermon.types';

interface BiblePassage {
  text: string;
  book: string;
  startChapter: number | null;
  startVerse: number | null;
  endChapter: number | null;
  endVerse: number | null;
}

export class SermonResponseData {
  id: number;
  originalId: string | null;

  contributorId: number;
  contributorFullName: string;
  contributorFullNameSlug: string;
  contributorImageUrl: string | null;

  title: string;
  description: string | null;
  mediaType: MediaType;

  streamUrl: string | null;
  downloadUrl: string | null;
  thumbnailUrl: string | null;
  srtUrl: string | null;
  vttUrl: string | null;

  bibleReferences: BiblePassage[];
  topics: { name: string; slug: string | null }[];
  transcript: string | null;

  hits: number;
  featured: boolean;
  previouslyFeatured: boolean;

  preachedAt: Date | null;
  updatedAt: Date;
  createdAt: Date;
}

export class SermonResponse extends SermonResponseData {
  constructor(data: SermonResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: SermonFullType): SermonResponse {
    return new SermonResponse({
      id: data.id,
      originalId: data.originalId,

      contributorId: data.contributorId,
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
                : MediaSource.BUNNY),
        )?.url ?? null,

      srtUrl:
        data.urls.find((url) => url.format === MediaFormat.SRT)?.url ?? null,
      vttUrl:
        data.urls.find((url) => url.format === MediaFormat.VTT)?.url ?? null,

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
      topics: data.topics
        ? data.topics.map((topic) => {
            return { name: topic.name, slug: topic.slug };
          })
        : [],
      transcript: data.transcript?.text ?? null,

      hits: data.hits,
      featured: data.featured,
      previouslyFeatured: data.previouslyFeatured,

      preachedAt: data.preachedAt,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    });
  }
}
