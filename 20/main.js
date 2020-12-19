const fs = require('fs');

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  return inputAsText;
};

const INPUT_FILE = 'example.csv';
const input = getInput(INPUT_FILE);

console.log('part 1: ' + '');
console.log('part 2: ' + '');
