// Creates a file for each text sermon

import * as fs from 'fs';

const inputFolder = 'prisma/data/srt';
const outputFolder = 'prisma/data/srt-new';

export const renameFiles = async () => {
  // For all the files in the input folder I want to rename them and put them in the output folder
  const files = fs.readdirSync(inputFolder);
  for (const file of files) {
    // The file name is like this "some random text[ID].srt" and I want to rename it to "ID.srt" where the id can be any character or number
    let newFileName = file.replace(/.*\[(.*)\].srt/, '$1.srt');
    newFileName = newFileName.replace(/ /g, '_');
    fs.copyFileSync(`${inputFolder}/${file}`, `${outputFolder}/${newFileName}`);
  }
};

renameFiles().then(() => {
  console.log('done');
});
