import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { findContributorId } from './common';

export const convertVideoSermons = async (prisma: PrismaClient) => {
  const uniqueContributors: Map<number, number[]> = new Map();

  let missingContributors = 0;

  const imageContributors = JSON.parse(
    fs.readFileSync('prisma/data/xoops_myalbum_cat.json', 'utf8'),
  ).xoops_myvideo_cat;
  const imagePhotos = JSON.parse(
    fs.readFileSync('prisma/data/xoops_myalbum_photos.json', 'utf8'),
  ).xoops_myvideo_videos;

  for (const imageContributor of imageContributors) {
    const fullNameSlug = imageContributor.title
      .toLowerCase()
      .replace(/  /g, ' ')
      .replace(/ /g, '-')
      .replace(/\./g, '');

    const fullName = imageContributor.title.replace(/  /g, ' ');

    // Check if this contributor already exists in the new schema
    const existingContributor = await prisma.contributor.findUnique({
      where: {
        fullName: fullName,
      },
    });
    if (existingContributor) {
      const existingIds = uniqueContributors.get(existingContributor.id);

      uniqueContributors.set(
        existingContributor.id,
        existingIds
          ? [...existingIds, imageContributor.cid]
          : [imageContributor.cid],
      );

      continue;
    }

    console.log(
      `WARNING: Contributor not found: ${fullName}, id: ${imageContributor.cid}`,
    );
    missingContributors++;
  }

  for (const imagePhoto of imagePhotos) {
    const contributorId = findContributorId(imagePhoto.cid, uniqueContributors);
    if (!contributorId) {
      console.log(
        `Could not find contributor ID for text sermon: ${imagePhoto.title}, id: ${imagePhoto.lid}`,
      );
      continue;
    }

    // upsert the image + description
    // const sermonId = await upsertSermon(
    //   prisma,
    //   contributorId,
    //   [],
    //   bibleReferences,
    //   title,
    //   videoSermon.hits,
    //   urls,
    //   videoSermon.lid === featuredSermonId ? true : false,
    //   transcript,
    //   originalId,
    //   description,
    // );
  }

  console.log('Finished converting images. Summary:');
  console.log(`- Missing contributors: ${missingContributors}`);
};
