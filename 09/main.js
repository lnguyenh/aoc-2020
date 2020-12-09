const fs = require('fs');

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  return inputAsText.map((numberAsText) => Number(numberAsText));
};

const isSum = (target, candidates) => {
  if (candidates.length === 1) return false;
  const firstSumComponent = candidates.shift();
  for (const candidate of candidates) {
    if (firstSumComponent + candidate === target) return true;
  }
  return isSum(target, candidates);
};

const isValid = (target, seed) => {
  const simplerSeed = seed.filter((seedValue) => {
    return seedValue < target;
  });
  return isSum(target, simplerSeed);
};

const findFirstInvalid = (input, seedLength) => {
  let seed, target;
  for (let i = seedLength; i < input.length; i++) {
    seed = input.slice(i - seedLength, i);
    target = input[i];
    if (!isValid(target, seed)) return target;
  }
  return null;
};

const SEED_LENGTH = 25;
const INPUT_FILE = 'data.csv';

const input = getInput(INPUT_FILE);
console.log(findFirstInvalid(input, SEED_LENGTH));
