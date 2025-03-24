import { MediaSource, MediaType } from '@prisma/client';
import { HymnFullType } from '../hymns.types';

export class HymnResponseData {
  title: string;
  audioUrl: string | null;
  videoUrl: string | null;
}

export class HymnResponse extends HymnResponseData {
  constructor(data: HymnResponseData) {
    super();
    Object.assign(this, data);
  }

  static fromDB(data: HymnFullType): HymnResponse {
    return new HymnResponse({
      title: data.title,
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
    });
  }
}
