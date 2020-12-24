const fs = require('fs');

const SIZE = 201;
const MIDDLE_INDEX = 100;

class Grid {
  constructor() {
    this.tiles = [];
    for (let i = 0; i < SIZE; i++) {
      this.tiles.push(Array(SIZE).fill('w'));
    }
  }

  flip(instruction) {
    let i, j;
    i = j = MIDDLE_INDEX;

    for (const letter of instruction) {
      switch (letter) {
        case 'w':
          j--;
          break;
        case 'R':
          i--;
          break;
        case 'S':
          i--;
          j++;
          break;
        case 'e':
          j++;
          break;
        case 'T':
          i++;
          break;
        case 'U':
          i++;
          j--;
          break;
        default:
          throw Error;
      }
    }

    if (this.tiles[i][j] === 'w') {
      this.tiles[i][j] = 'b';
    } else {
      this.tiles[i][j] = 'w';
    }
  }

  countBlacks() {
    let numBlacks = 0;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (this.tiles[i][j] === 'b') {
          numBlacks++;
        }
      }
    }
    return numBlacks;
  }

  applyAll(instructions) {
    for (const instruction of instructions) {
      this.flip(instruction);
      // console.log(this.countBlacks());
    }
  }
}

const getInput = (fileName) => {
  let fileContent = fs
    .readFileSync(fileName, 'utf8')
    .replace(/nw/g, 'R')
    .replace(/ne/g, 'S')
    .replace(/se/g, 'T')
    .replace(/sw/g, 'U');
  const inputAsText = fileContent.split('\n');
  return inputAsText.map((line) => line.split(''));
};

const INPUT_FILE = 'data.csv';
const instructions = getInput(INPUT_FILE);

const grid = new Grid();
grid.applyAll(instructions);
console.log('part 1: ' + grid.countBlacks());

console.log('part 2: ' + '');
