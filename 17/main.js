const fs = require('fs');
const { Pocket, Pocket2 } = require('./pockets');

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  return inputAsText.map((line) => line.split(''));
};

const INPUT_FILE = 'data.csv';
const input = getInput(INPUT_FILE);
console.log('part 1: ' + new Pocket(input).doIt(6));
console.log('part 2: ' + new Pocket2(input).doIt(6));
