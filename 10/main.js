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

class Joltage {
  constructor(value) {
    this.value = value;
    this.children = [];
    this.numPathsToTarget = 0;
  }

  getPathsToValue(target) {
    if (this.numPathsToTarget !== 0) {
      // cache the result if found earlier
      return this.numPathsToTarget;
    }
    if (this === target) {
      this.numPathsToTarget = 1;
      return 1;
    } else {
      let numPaths = 0;
      for (const child of this.children) {
        numPaths += child.getPathsToValue(target);
      }
      this.numPathsToTarget = numPaths;
      return numPaths;
    }
  }
}

const buildTree = (joltages) => {
  // Create all nodes
  const nodes = {};
  for (const joltage of joltages) {
    nodes[joltage] = new Joltage(joltage);
  }

  // Populate children
  let i = 0;
  while (i < joltages.length - 1) {
    let j = 1;
    while (joltages[i + j] - joltages[i] < 4) {
      nodes[joltages[i]].children.push(nodes[joltages[i + j]]);
      j++;
    }
    i++;
  }

  return nodes;
};

const INPUT_FILE = 'data.csv';
const joltages = getSortedJoltages(INPUT_FILE);

// part 1
const resultsPart1 = traversePart1(joltages);
console.log(resultsPart1[1] * resultsPart1[3]);

// part 2
joltages.unshift(0);
const nodes = buildTree(joltages);
const target = joltages.pop();
const start = joltages[0];
const numPaths = nodes[start].getPathsToValue(nodes[target]);
console.log(numPaths);
