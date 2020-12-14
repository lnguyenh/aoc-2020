const fs = require('fs');

class BaseMemory {
  constructor() {
    this.mask = new Array(36);
    this.values = {};
  }

  setMask(mask) {
    this.mask = mask.split('');
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
    instructions.map((instruction) => this.do(instruction));
    return this.sum();
  }
}

class Memory1 extends BaseMemory {
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
}

class Memory2 extends BaseMemory {
  mem(address, value) {
    const floatingArray = (address >>> 0)
      .toString(2)
      .padStart(36, '0')
      .split('');
    for (const [i, __] of floatingArray.entries()) {
      switch (this.mask[i]) {
        case '1':
          floatingArray[i] = '1';
          break;
        case 'X':
          floatingArray[i] = 'X';
          break;
      }
    }

    for (const floatingAddress of this.combinations(floatingArray)) {
      this.values[floatingAddress] = value;
    }
  }

  combinations(array) {
    function combination(array1, array2) {
      return array1.flatMap((a) => array2.map((b) => a.concat(b)));
    }

    if (array.length === 1) {
      switch (array[0]) {
        case '0':
          return [[0]];
        case '1':
          return [[1]];
        case 'X':
          return [[0], [1]];
      }
    } else {
      return combination(
        this.combinations(array.slice(0, 1)),
        this.combinations(array.slice(1))
      );
    }
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  return fileContent.split('\n');
};

const INPUT_FILE = 'data.csv';
const input = getInput(INPUT_FILE);
console.log('part 1: ' + new Memory1().doAll(input));
console.log('part 2: ' + new Memory2().doAll(input));
