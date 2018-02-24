const {parseInputFile} = require('./src/fileReader');

const inputPath = './input.txt';

async function main() {
  try {
    const inputData = await parseInputFile(inputPath);
    console.log(inputData);
  } catch(error) {
    console.error(error);
  }
}

main();
