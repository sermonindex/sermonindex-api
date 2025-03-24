import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { findContributorId } from './common';

export const convertImages = async (prisma: PrismaClient) => {
  const uniqueContributors: Map<number, number[]> = new Map();

  let missingContributors = 0;
  let missingContributorNames = [];
  let imagesCreated = 0;

  const imageContributors = JSON.parse(
    fs.readFileSync('prisma/data/xoops_myalbum_cat.json', 'utf8'),
  ).xoops_myalbum_cat;
  const imagePhotos = JSON.parse(
    fs.readFileSync('prisma/data/xoops_myalbum_photos.json', 'utf8'),
  ).xoops_myalbum_photos;

  for (const imageContributor of imageContributors) {
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
    missingContributorNames.push(fullName);
  }

  for (const imagePhoto of imagePhotos) {
    const contributorId = findContributorId(imagePhoto.cid, uniqueContributors);
    if (!contributorId) {
      console.log(
        `Could not find contributor ID for text sermon: ${imagePhoto.title}, id: ${imagePhoto.lid}, cid: ${imagePhoto.cid}`,
      );
      continue;
    }

    const imageUrl = `https://sermonindex3.b-cdn.net/photos/${imagePhoto.lid}.${imagePhoto.ext}`;

    // console.log({
    //   contributorId: contributorId,
    //   url: imageUrl,
    //   title: imagePhoto.title,
    //   description: imagePhoto.description,
    // });

    await prisma.contributorImage.create({
      data: {
        contributorId: contributorId,
        url: imageUrl,
        title: imagePhoto.title,
        description: imagePhoto.description,
      },
    });
    imagesCreated++;
  }

  console.log('Finished converting images. Summary:');
  console.log(`- Total images: ${imagePhotos.length}`);
  console.log(`- ${imagesCreated} images created`);
  console.log(`- Missing contributors: ${missingContributors}`);
  console.log(`- Missing contributor names:`);
  console.log(missingContributorNames.join('\n'));
};
