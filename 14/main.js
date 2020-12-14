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
    for (const instruction of instructions) {
      this.do(instruction);
    }
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

function combination(array1, array2) {
  return array1.flatMap((a) => array2.map((b) => a.concat(b)));
}

function floatingMasks(array) {
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
      floatingMasks(array.slice(0, 1)),
      floatingMasks(array.slice(1))
    );
  }
}

class Memory2 extends BaseMemory {
  getFloatingAddresses(floatingArray) {
    return floatingMasks(floatingArray);
  }

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

    for (const floatingAddress of this.getFloatingAddresses(floatingArray)) {
      this.values[floatingAddress] = value;
    }
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  return fileContent.split('\n');
};

const INPUT_FILE = 'data.csv';
const input = getInput(INPUT_FILE);

const memory = new Memory1();
console.log(memory.doAll(input));

const memory2 = new Memory2();
console.log(memory2.doAll(input));
