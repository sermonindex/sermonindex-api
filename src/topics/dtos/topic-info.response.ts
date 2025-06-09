import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TopicInfoType } from 'src/topics/topic.types';

export class TopicInfoResponseData {
  @ApiProperty({
    description: 'The unique id of the topic',
    example: 'cc3dcbb3-cd42-49d8-a87c-cd7f3197285f',
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The topic slug',
    example: 'end-times',
    type: String,
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'The topic name',
    example: 'End Times',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The number of sermons associated with the topic',
    example: 10,
    type: Number,
  })
  sermonCount: number;
}

export class TopicInfoResponse extends TopicInfoResponseData {
  constructor(data: TopicInfoResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: TopicInfoType): TopicInfoResponse {
    return new TopicInfoResponse({
      id: data.id,
      slug: data.slug,
      name: data.name,
      sermonCount: data._count.sermons,
    });
  }
}
