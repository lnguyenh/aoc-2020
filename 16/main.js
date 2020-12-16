const fs = require('fs');

class Rule {
  constructor(text) {
    const match = /(.*): (\d*)-(\d*) or (\d*)-(\d*)$/.exec(text);
    this.name = match[1];
    this.ranges = [
      [match[2], match[3]],
      [match[4], match[5]],
    ];
    this.possibleIndexes = [];
    this.index = -1;
  }

  accepts(val) {
    // console.log(val, this.ranges);
    return this.ranges.some(([min, max]) => min <= val && val <= max);
  }

  removeIndex(index) {
    const i = this.possibleIndexes.indexOf(index);
    if (i > -1) {
      this.possibleIndexes.splice(i, 1);
    }
  }
}

class Ticket {
  constructor(text) {
    this.values = text.split(',').map((val) => Number(val));
  }

  isValid(rules) {
    for (const val of this.values) {
      if (rules.some((rule) => rule.accepts(val))) continue;
      return false;
    }
    return true;
  }

  getInvalidValues(rules) {
    const invalidValues = [];
    for (const val of this.values) {
      if (rules.some((rule) => rule.accepts(val))) continue;
      invalidValues.push(val);
    }
    return invalidValues;
  }

  followsRuleForValueIndex(rule, index) {
    return rule.accepts(this.values[index]);
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const [rulesAsText, rest] = fileContent.split('\n\nyour ticket:\n');
  const [myTicketAsText, nearbyTicketsAsText] = rest.split(
    '\n\nnearby tickets:\n'
  );
  const rules = rulesAsText.split('\n').map((text) => new Rule(text));
  const myTicket = new Ticket(myTicketAsText);
  const nearbyTickets = nearbyTicketsAsText
    .split('\n')
    .map((text) => new Ticket(text));
  return { rules, myTicket, nearbyTickets };
};

const INPUT_FILE = 'data.csv';
const { rules, myTicket, nearbyTickets } = getInput(INPUT_FILE);

// part 1
let sumInvalid = 0;
for (const ticket of nearbyTickets) {
  sumInvalid += ticket.getInvalidValues(rules).reduce((a, b) => a + b, 0);
}
console.log('part 1: ' + sumInvalid);

// part 2
const validTickets = nearbyTickets.filter((ticket) => ticket.isValid(rules));
for (const rule of rules) {
  for (let i = 0; i < rules.length; i++) {
    if (
      !validTickets.every((ticket) => {
        return ticket.followsRuleForValueIndex(rule, i);
      })
    )
      continue;
    rule.possibleIndexes.push(i);
  }
}
rules.sort((r1, r2) => r1.possibleIndexes.length - r2.possibleIndexes.length);
for (const [i, rule] of rules.entries()) {
  if (rule.possibleIndexes.length === 1) {
    rule.index = rule.possibleIndexes[0];
    for (let j = i + 1; j < rules.length; j++) {
      rules[j].removeIndex(rule.index);
    }
  }
}
let part2Result = 1;
for (const rule of rules) {
  if (rule.name.startsWith('departure')) {
    part2Result *= myTicket.values[rule.index];
  }
}
console.log('part 2: ' + part2Result);

// Get all permutations of [1, 2, 3, 4]
// function combinations(array, original = false) {
//   if (array.length === 1) return [array];
//
//   const result = [];
//   for (const [i, val] of array.entries()) {
//     const restArray = array.slice();
//     restArray.splice(i, 1);
//     const a = combinations(restArray).map((v) => [val].concat(v));
//     result.push(a);
//   }
//   return result.flat();
// }
