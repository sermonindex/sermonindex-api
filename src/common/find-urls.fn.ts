import {
  HymnMedia,
  MediaSource,
  MediaType,
  PublishedChapterMedia,
  SermonMedia,
} from '@prisma/client';

export const findStreamUrl = (
  mediaType: MediaType,
  urls: (SermonMedia | HymnMedia | PublishedChapterMedia)[],
) => {
  return (
    urls.find(
      (url) =>
        url.type === mediaType &&
        url.source ===
          (mediaType === MediaType.AUDIO
            ? MediaSource.ARCHIVE
            : MediaSource.YOUTUBE),
    )?.url ?? null
  );
};

export const findDownloadUrl = (
  mediaType: MediaType,
  urls: (SermonMedia | HymnMedia | PublishedChapterMedia)[],
) => {
  return (
    urls.find(
      (url) =>
        url.type === mediaType &&
        url.source ===
          (mediaType === MediaType.AUDIO
            ? MediaSource.ARCHIVE
            : MediaSource.BUNNY),
    )?.url ?? null
  );
};
