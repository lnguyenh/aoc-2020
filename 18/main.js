const fs = require('fs');

class Expression {
  constructor(array) {
    this.operands = [];
    this.operators = [];
    this.array = array;

    for (let i = 0; i < array.length; i++) {
      if (array[i] === '(') {
        let numSubParenthesis = 0;
        for (let j = i + 1; j < array.length; j++) {
          // find matching parenthesis
          switch (array[j]) {
            case ')':
              numSubParenthesis -= 1;
              break;
            case '(':
              numSubParenthesis += 1;
              break;
            default:
              break;
          }
          if (numSubParenthesis < 0) {
            const subArray = array.slice(i + 1, j);
            this.operands.push(new Expression(subArray).evaluate());
            i = j;
            break;
          }
        }
      } else if (!isNaN(array[i])) {
        this.operands.push(Number(array[i]));
      } else {
        this.operators.push(array[i]);
      }
    }
  }

  evaluate() {
    if (this.operands.length === 0) return 0;
    let result = this.operands[0];
    for (let i = 0; i < this.operators.length; i++) {
      switch (this.operators[i]) {
        case '+':
          result += this.operands[i + 1];
          break;
        case '*':
          result *= this.operands[i + 1];
          break;
      }
    }
    return result;
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  fileContent = fileContent.replace(/\(/g, '( ');
  fileContent = fileContent.replace(/\)/g, ' )');
  const inputAsText = fileContent.split('\n');
  return inputAsText;
};

const INPUT_FILE = 'data.csv';
const input = getInput(INPUT_FILE);

let part1Result = 0;
for (const line of input) {
  const expression = new Expression(line.split(' '));
  part1Result += expression.evaluate();
}

console.log('part 1: ' + part1Result);
console.log('part 2: ' + '');
