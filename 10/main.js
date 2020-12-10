const fs = require('fs');

const getSortedJoltages = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  return inputAsText
    .map((numberAsText) => Number(numberAsText))
    .sort((a, b) => a - b);
};

const traversePart1 = (joltages) => {
  let i = 0;
  let diff = joltages[i] - 0;
  const results = {
    1: 0,
    2: 0,
    3: 0,
  };

  // Bag
  while (i < joltages.length && diff < 4) {
    results[diff] += 1;
    results['max'] = joltages[i];
    i++;
    diff = joltages[i] - joltages[i - 1];
  }
  // Own adapter
  results[3] += 1;
  results['max'] += 3;

  return results;
};

const INPUT_FILE = 'data.csv';

const joltages = getSortedJoltages(INPUT_FILE);

// part 1
const resultsPart = traversePart1(joltages);
console.log(resultsPart[1] * resultsPart[3]);
