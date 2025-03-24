import { SermonFullType } from 'src/sermons/sermon.types';
import { TopicFullType } from 'src/topics/topic.types';
import { SermonResponse } from '../../sermons/dtos/sermon.response';

export class TopicResponseData {
  name: string;
  slug: string | null;
  summary: string;

  sermons: SermonResponse[];

  updatedAt: Date;
  createdAt: Date;
}

export class TopicResponse extends TopicResponseData {
  constructor(data: TopicResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: TopicFullType): TopicResponse {
    return new TopicResponse({
      name: data.name,
      slug: data.slug,
      summary: data.summary,

      sermons: data.sermons.map((sermon) =>
        SermonResponse.fromDB(sermon as SermonFullType),
      ),

      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    });
  }
}
