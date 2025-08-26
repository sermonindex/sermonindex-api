import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TopicFullType } from 'src/topics/topic.types';
import { TopicInfoResponseData } from './topic-info.response';

export class TopicResponseData extends TopicInfoResponseData {
  @ApiProperty({
    description: 'A brief summary of the topic',
    example: 'Unity is the state of being one; oneness...',
    type: String,
  })
  @IsString()
  summary: string;
}

export class TopicResponse extends TopicResponseData {
  constructor(data: TopicResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: TopicFullType): TopicResponse {
    return new TopicResponse({
      id: data.id,
      slug: data.slug,
      name: data.name,
      summary: data.summary,

      sermonCount: data._count.sermons,
    });
  }
}
