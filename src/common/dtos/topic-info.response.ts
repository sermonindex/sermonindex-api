import { TopicInfoType } from 'src/topics/topic.types';

export class TopicInfoResponseData {
  name: string;
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
      sermonCount: data._count.sermon,
    });
  }
}
