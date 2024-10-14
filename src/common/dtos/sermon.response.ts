import { SermonFullType } from 'src/sermons/sermon.types';

export class SermonResponseData {
  id: number;
  mysqlId: number | null;

  contributorId: number;
  contributorFullName: string;
  contributorImageUrl: string | null;

  title: string;
  description: string | null;

  audioUrl: string | null;
  videoUrl: string | null;

  bibleReferences: string[];
  topics: string[];

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
      mysqlId: data.mysqlId,

      contributorId: data.contributorId,
      contributorFullName: data.contributor.fullName,
      contributorImageUrl: data.contributor.imageUrl,

      title: data.title,
      description: data.description,

      audioUrl: data.audioUrl,
      videoUrl: data.videoUrl,

      bibleReferences: data.bibleReferences.map((ref) => ref.text),
      topics: data.topics.map((topic) => topic.name),

      hits: data.hits,
      featured: data.featured,
      previouslyFeatured: data.previouslyFeatured,

      preachedAt: data.preachedAt,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    });
  }
}
