const fs = require('fs');

const SIZE = 201;
const MIDDLE_INDEX = 100;

class Grid {
  constructor() {
    this.tiles = this.getFreshGrid();
    this.nextDayTiles = this.getFreshGrid();
  }

  getFreshGrid() {
    const grid = [];
    for (let i = 0; i < SIZE; i++) {
      grid.push(Array(SIZE).fill('w'));
    }
    return grid;
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
    }
  }

  getNumBlackNeighbors(i, j) {
    const neighbors = [
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
    ];
    let numBlackNeighbors = 0;
    for (const [k, l] of neighbors) {
      if (this.tiles[i + k][j + l] === 'b') numBlackNeighbors++;
    }
    return numBlackNeighbors;
  }

  commitNextDay() {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        this.tiles[i][j] = this.nextDayTiles[i][j];
      }
    }
  }

  applyNextDay() {
    for (let i = 2; i < SIZE - 2; i++) {
      for (let j = 2; j < SIZE - 2; j++) {
        this.nextDayTiles[i][j] = this.tiles[i][j];
        const blackNeighbors = this.getNumBlackNeighbors(i, j);
        switch (this.tiles[i][j]) {
          case 'w':
            if (blackNeighbors === 2) this.nextDayTiles[i][j] = 'b';
            break;
          case 'b':
            if (blackNeighbors === 0 || blackNeighbors > 2)
              this.nextDayTiles[i][j] = 'w';
            break;
        }
      }
    }
    this.commitNextDay();
  }

  applyDays(numDays) {
    for (let i = 0; i < numDays; i++) {
      this.applyNextDay();
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

grid.applyDays(100);
console.log('part 2: ' + grid.countBlacks());
