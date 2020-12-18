const fs = require('fs');

class BaseExpression {
  constructor(array) {
    this.operands = [];
    this.operators = [];

    // Probably over-complicated way to deal with parenthesis
    // We add either numbers to operands, or +/* to operators
    // If we encounter a parenthesis block we calculate its values
    // by creating a new expression based on the parenthesis content
    for (let i = 0; i < array.length; i++) {
      if (array[i] === '(') {
        let numSubParenthesis = 0;
        for (let j = i + 1; j < array.length; j++) {
          // find matching closing parenthesis
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
            this.operands.push(new this.constructor(subArray).evaluate());
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
}

class Expression1 extends BaseExpression {
  evaluate() {
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

class Expression2 extends BaseExpression {
  evaluate() {
    const operators = this.operators.slice();
    const operands = this.operands.slice();

    let i = 0;
    while (operators.length > 0) {
      if (operators.includes('+')) {
        // Consume all the "+" first
        if (operators[i] === '+') {
          operands[i] = operands[i] + operands[i + 1];
          operands.splice(i + 1, 1);
          operators.splice(i, 1);
        } else {
          i += 1;
        }
      } else {
        return operands.reduce((a, b) => a * b, 1);
      }
    }
    return operands[0];
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
let part2Result = 0;
for (const line of input) {
  part1Result += new Expression1(line.split(' ')).evaluate();
  part2Result += new Expression2(line.split(' ')).evaluate();
}
console.log('part 1: ' + part1Result);
console.log('part 2: ' + part2Result);
