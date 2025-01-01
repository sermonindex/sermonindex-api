import { MediaSource, MediaType } from '@prisma/client';
import { SermonFullType } from 'src/sermons/sermon.types';

export class SermonResponseData {
  id: number;
  originalId: string | null;

  contributorId: number;
  contributorFullName: string;
  contributorFullNameSlug: string;
  contributorImageUrl: string | null;

  title: string;
  description: string | null;

  audioUrl: string | null;
  videoUrl: string | null;
  videoDownloadUrl: string | null;
  srtUrl: string | null;
  vttUrl: string | null;

  bibleReferences: string[];
  topics: string[];
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

      // TODO: Make this toggle based on a config value
      // TODO: Rename to streamUrl and downloadUrl
      audioUrl:
        data.urls.find(
          (url) =>
            url.type === MediaType.AUDIO && url.source === MediaSource.ARCHIVE,
        )?.url ?? null,
      videoUrl:
        data.urls.find(
          (url) =>
            url.type === MediaType.VIDEO && url.source === MediaSource.YOUTUBE,
        )?.url ?? null,

      // TODO: Save these urls in the database
      videoDownloadUrl:
        data.urls.find(
          (url) =>
            url.type === MediaType.VIDEO && url.source === MediaSource.BUNNY,
        )?.url ?? null,

      srtUrl: data.urls
        ? `https://sermonindex3.b-cdn.net/srt/${data.originalId}.srt`
        : null,
      vttUrl: data.urls
        ? `https://sermonindex3.b-cdn.net/vtt/${data.originalId}.vtt`
        : null,

      bibleReferences: data.bibleReferences.map((ref) => ref.text),
      topics: data.topics ? data.topics.map((topic) => topic.name) : [],
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
