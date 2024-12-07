import { SermonFullType } from 'src/sermons/sermon.types';
import { TopicFullType } from 'src/topics/topic.types';
import { SermonResponse } from './sermon.response';

export class TopicResponseData {
  name: string;

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

      sermons: data.sermon.map((sermon) =>
        SermonResponse.fromDB(sermon as SermonFullType),
      ),

      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    });
  }
}
