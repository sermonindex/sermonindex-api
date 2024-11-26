// Creates a file for each text sermon

import * as fs from 'fs';

const inputFile = 'prisma/text_sermons/xoops_sermon_text.json';
const outputDirectory = 'prisma/text_sermons/sermons';

export const createFiles = async () => {
  const textSermons = JSON.parse(
    fs.readFileSync(inputFile, 'utf8'),
  ).xoops_sermon_text;

  let sermonsCreated = 0;
  const totalSermons = textSermons.length;
  console.log(`Creating files for ${totalSermons} sermons...`);

  textSermons.forEach((sermon: any) => {
    const index = Math.round(sermonsCreated / 10000);

    if (!fs.existsSync(`${outputDirectory}_${index}`)) {
      fs.mkdirSync(`${outputDirectory}_${index}`, { recursive: true });
    }

    const sermonFileName = `AID${sermon.id}`;
    const sermonFilePath = `${outputDirectory}_${index}/${sermonFileName}.txt`;

    fs.writeFileSync(sermonFilePath, sermon.body, 'utf8');

    console.log(`Created file for sermon ${sermonFileName}`);
    sermonsCreated++;
  });

  return;
};

createFiles().then(() => {
  console.log('done');
});
