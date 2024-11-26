import * as fs from 'fs';

const audioContributors = JSON.parse(
  fs.readFileSync('prisma/old_schema/xoops_mydownloads_cat.json', 'utf8'),
).xoops_mydownloads_cat;

const videoContributors = JSON.parse(
  fs.readFileSync('prisma/old_schema/xoops_myvideo_cat.json', 'utf8'),
).xoops_myvideo_cat;

const textContributors = JSON.parse(
  fs.readFileSync('prisma/text_sermons/xoops_sermon_category.json', 'utf8'),
).xoops_sermon_category;

const contributors = [];
const uniqueContributors = [];

for (const contributor of audioContributors) {
  contributors.push(contributor.title);
}

for (const contributor of videoContributors) {
  contributors.push(contributor.title);
}

for (const contributor of textContributors) {
  if (contributors.includes(contributor.name)) {
    continue;
  }

  uniqueContributors.push(contributor.name);
}

fs.writeFileSync(
  'unique.json',
  JSON.stringify({ unique: uniqueContributors }, null, 2),
  { flag: 'w' },
);
