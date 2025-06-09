import {
  MediaFormat,
  MediaSource,
  MediaType,
  PrismaClient,
} from '@prisma/client';

export const uploadMissingSermonUrls = async (prisma: PrismaClient) => {
  const urls = [
    {
      title: 'A Man Of God by Leonard Ravenhill - Part 1',
      source: MediaSource.ARCHIVE,
      format: MediaFormat.MP4,
      type: MediaType.VIDEO,
      url: 'https://archive.org/download/siv_A_Man_Of_God_by_Leonard_Ravenhill_Part_1/A_Man_Of_God_by_Leonard_Ravenhill_Part_1.mp4>Download this video in .mp4',
    },
    {
      title: '3 Chapel of the Air Interviews of Leonard Ravenhill',
      source: MediaSource.ARCHIVE,
      format: MediaFormat.MP4,
      type: MediaType.VIDEO,
      url: 'https://archive.org/download/siv_3_Chapel_of_the_Air_Interviews_of_Leonard_Ravenhill/3_Chapel_of_the_Air_Interviews_of_Leonard_Ravenhill.mp4',
    },
    {
      url: 'https://archive.org/download/Brokenness_and_Compassion_by_Zac_Poonen/Brokenness_and_Compassion_by_Zac_Poonen.mp4',
    },
  ];
};
