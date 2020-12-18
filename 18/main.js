const fs = require('fs');

class Single {
  constructor(text) {
    this.a = Number(text);
  }
  evaluate() {
    return this.a;
  }
}

class Expression {
  constructor(text) {
    let __, a, b, operator;

    // (..)
    let match = /^\(.*\)$/.exec(text);
    if (match) {
      text = text.slice(1, text.length - 1);
    }

    // 2 * 3 ...
    match = /^(\d*) ([\*+]) (.*)$/.exec(text);
    if (match) {
      // (2 * ) + ...
      [__, a, operator, b] = match;
    } else {
      match = /^\((.+?)\) ([\*+]) (.!*)$/.exec(text);
      if (match) {
        [__, a, operator, b] = match;
      } else {
        match = /^\((.*?)\) ([\*+]) (.*)$/.exec(text);
        if (match) {
          [__, a, operator, b] = match;
        }
      }
    }

    this.operator = operator;
    this.a = a.includes('(') ? new Expression(a) : new Single(a);
    this.b = b.includes('(') ? new Expression(b) : new Single(b);
  }

  evaluate() {
    let result;
    switch (this.operator) {
      case '+':
        result = this.a.evaluate() + this.b.evaluate();
        break;
      case '*':
        result = this.a.evaluate() * this.b.evaluate();
        break;
    }
    return result;
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  return inputAsText;
};

const INPUT_FILE = 'example.csv';
const input = getInput(INPUT_FILE);
for (const line of input) {
  console.log(new Expression(line).evaluate());
}

console.log('part 1: ' + '');
console.log('part 2: ' + '');
