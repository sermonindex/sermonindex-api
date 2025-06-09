import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { SermonFullType } from 'src/sermons/sermon.types';
import { TopicFullType } from 'src/topics/topic.types';
import { SermonResponse } from '../../sermons/dtos/sermon.response';
import { TopicInfoResponseData } from './topic-info.response';

export class TopicResponseData extends TopicInfoResponseData {
  @ApiProperty({
    description: 'A brief summary of the topic',
    example: 'Unity is the state of being one; oneness...',
    type: String,
  })
  @IsString()
  summary: string;

  @ApiProperty({
    description: 'A list of sermons associated with the topic',
    type: [SermonResponse],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SermonResponse)
  sermons: SermonResponse[];
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

      sermonCount: data.sermons.length,
      sermons: data.sermons.map((sermon) =>
        SermonResponse.fromDB(sermon as SermonFullType),
      ),
    });
  }
}
