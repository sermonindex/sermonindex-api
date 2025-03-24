import { TopicInfoType } from 'src/topics/topic.types';

export class TopicInfoResponseData {
  name: string;
  slug: string | null;
  sermonCount: number;
}

export class TopicInfoResponse extends TopicInfoResponseData {
  constructor(data: TopicInfoResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: TopicInfoType): TopicInfoResponse {
    return new TopicInfoResponse({
      name: data.name,
      slug: data.slug,
      sermonCount: data._count.sermons,
    });
  }
}
