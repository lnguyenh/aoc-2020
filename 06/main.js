const fs = require('fs');

let fileContent = fs.readFileSync('data.csv', 'utf8');
let cleanedFileContent = fileContent
  .replaceAll('\n\n', '_')
  .replaceAll('\n', ' ');
const rowsPart1 = cleanedFileContent.replaceAll(' ', '').split('_');
const rowsPart2 = cleanedFileContent.split('_');

const getNumUniqueAnswers = (groupAnswers) => {
  return new Set(Array.from(groupAnswers)).size;
};

const getNumSharedAnswers = (groupAnswers) => {
  const individualAnswers = groupAnswers.split(' ').map((x) => Array.from(x));
  const sharedAnswers = individualAnswers.reduce((a, b) => {
    return a.filter((x) => b.includes(x));
  }, individualAnswers[0]);
  return new Set(sharedAnswers).size;
};

const sum = (a, b) => a + b;

const part1Answer = rowsPart1.map(getNumUniqueAnswers).reduce(sum, 0);
const part2Answer = rowsPart2.map(getNumSharedAnswers).reduce(sum, 0);

console.log(part1Answer);
console.log(part2Answer);
