import * as fs from 'fs';

function reverseListFromJson() {
  try {
    // Read the JSON file
    const fileContent = fs.readFileSync(
      '/home/r104000/Documents/Personal/Projects/sermonindex-api/prisma/data/output.json',
      'utf-8',
    );

    const key = 'The Fountain of Life Opened Up';

    // Parse the JSON
    const data = JSON.parse(fileContent);

    // Check if the specified key exists and is an array
    if (!Array.isArray(data[key])) {
      throw new Error(`Key "${key}" is not an array in the JSON file.`);
    }

    // Reverse the array
    // const result = data[key].slice().reverse(); // slice() to avoid mutating original

    // Sort the array in descending order based on a specific property
    const result = data[key].sort((a, b) => {
      if (a.duration < b.duration) return 1; // Sort in descending order
      if (a.duration > b.duration) return -1;
      return 0;
    });

    fs.writeFileSync(
      '/home/r104000/Documents/Personal/Projects/sermonindex-api/prisma/data/output.json',
      JSON.stringify({ [key]: result }, null, 2),
      'utf-8',
    );
  } catch (error) {
    console.error('Error reading or processing JSON file:', error.message);
    return [];
  }
}

reverseListFromJson();
