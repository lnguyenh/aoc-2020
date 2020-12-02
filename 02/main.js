const neatCsv = require('neat-csv');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const neatParse = async (fileName) => {
  const fileData = await readFile(fileName);
  const results = await neatCsv(fileData, {
    separator: ':',
    headers: ['rule', 'password'],
  });
  return results;
};

const parseRule = (ruleString) => {
  const format = /(\d+)\-(\d+) (.)/;
  return format.exec(ruleString);
};

const isValid1 = (minOccur, maxOccur, letter, testString) => {
  const numOccur = testString.split(letter).length - 1;
  return minOccur <= numOccur && numOccur <= maxOccur;
};

const checkRule1 = (data) => {
  let numValid = 0;
  data.forEach((row) => {
    // Get Rule
    let minOccur, maxOccur, letter, first, rest;
    [first, minOccur, maxOccur, letter, ...rest] = parseRule(row['rule']);

    // Check if rule is followed
    if (isValid1(minOccur, maxOccur, letter, row['password'])) {
      numValid += 1;
    } else {
      console.log(row);
    }
  });
  console.log(`Num valid rule 1${numValid}`);
};

const isValid2 = (index1, index2, letter, testString) => {
  ok1 = testString.charAt(index1) === letter;
  ok2 = testString.charAt(index2) === letter;
  if (ok1 && ok2) {
    console.log('double', testString, index1, index2, letter);
  }
  return (ok1 && !ok2) || (!ok1 && ok2);
};

const checkRule2 = (data) => {
  let numValid = 0;
  data.forEach((row) => {
    // Get Rule
    let index1, index2, letter, first, rest;
    [first, index1, index2, letter, ...rest] = parseRule(row['rule']);

    if (index1 < 1 || index2 < 1) {
      console.log(`Scream ${row}`);
    }

    // Check if rule is followed
    if (isValid2(index1 - 1, index2 - 1, letter, row['password'].trim())) {
      numValid += 1;
      // console.log(row)
    } else {
      // console.log(row)
    }
  });
  console.log(`Num valid rule 2 ${numValid}`);
};

neatParse('data.csv').then((data) => {
  // checkRule1(data)
  checkRule2(data);
});
