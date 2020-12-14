const fs = require('fs');

class Memory {
  constructor() {
    this.mask = new Array(36);
    this.values = {};
  }

  setMask(mask) {
    this.mask = mask.split('');
  }

  mem(address, value) {
    const binaryArray = (value >>> 0).toString(2).padStart(36, '0').split('');
    for (const [i, character] of binaryArray.entries()) {
      binaryArray[i] = ['0', '1'].includes(this.mask[i])
        ? this.mask[i]
        : character;
    }
    this.values[address] = parseInt(binaryArray.join(''), 2);
    return this.values[address];
  }

  sum() {
    let total = 0;
    for (const address in this.values) {
      total += this.values[address];
    }
    return total;
  }

  do(instruction) {
    let prefix, suffix;
    [prefix, suffix] = instruction.split(' = ');
    switch (prefix) {
      case 'mask':
        this.setMask(suffix);
        break;
      default:
        const match = /^mem\[(\d*)\]$/.exec(prefix);
        this.mem(Number(match[1]), Number(suffix));
    }
  }

  doAll(instructions) {
    for (const instruction of instructions) {
      this.do(instruction);
    }
    return this.sum();
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  return inputAsText;
};

const INPUT_FILE = 'data.csv';
const input = getInput(INPUT_FILE);

const memory = new Memory();
console.log(memory.doAll(input));
