import { MediaFormat } from '@prisma/client';

export const getMediaFormat = (url: string | null | undefined) => {
  if (!url) {
    return MediaFormat.NONE;
  }
  if (url.includes('.jpg')) {
    return MediaFormat.JPG;
  }
  if (url.includes('.png')) {
    return MediaFormat.PNG;
  }
  if (url.includes('.mp4')) {
    return MediaFormat.MP4;
  }
  if (url.includes('.mp3')) {
    return MediaFormat.MP3;
  }
  if (url.includes('.srt')) {
    return MediaFormat.SRT;
  }
  if (url.includes('.vtt')) {
    return MediaFormat.VTT;
  }

  return MediaFormat.NONE;
};
