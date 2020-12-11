const fs = require('fs');

class Seating {
  constructor(inputAsArray) {
    this.seatingMap = inputAsArray;
    this.maxRowIndex = this.seatingMap.length - 1;
    this.maxColIndex = this.seatingMap[0].length - 1;
  }

  print() {
    for (const row of this.seatingMap) {
      console.log(row.join(''));
    }
  }

  getSeat(row, column) {
    return this.seatingMap[row][column];
  }

  isOccupied(row, column) {
    return this.getSeat(row, column) === '#';
  }

  isEmpty(row, column) {
    return this.getSeat(row, column) === 'L';
  }

  isFloor(row, column) {
    return this.getSeat(row, column) === '.';
  }

  getNumOccupiedAdjacentSeats(row, col) {
    const rowIndexStart = Math.max(0, row - 1);
    const rowIndexStop = Math.min(this.maxRowIndex, row + 1);
    const colIndexStart = Math.max(0, col - 1);
    const colIndexStop = Math.min(this.maxColIndex, col + 1);

    let numOccupied = 0;
    for (let rowIndex = rowIndexStart; rowIndex <= rowIndexStop; rowIndex++) {
      for (let colIndex = colIndexStart; colIndex <= colIndexStop; colIndex++) {
        if (rowIndex === row && colIndex === col) continue;
        if (this.isOccupied(rowIndex, colIndex)) numOccupied++;
      }
    }
    return numOccupied;
  }

  getSeatTransformation(row, col) {
    if (this.isFloor(row, col)) return '.';
    const numOccupiedAdjacentSeats = this.getNumOccupiedAdjacentSeats(row, col);
    if (this.isEmpty(row, col) && numOccupiedAdjacentSeats === 0) return '#';
    if (this.isOccupied(row, col) && numOccupiedAdjacentSeats >= 4) return 'L';
    return this.getSeat(row, col);
  }

  getNextStep() {
    const newMap = [];
    for (let rowIndex = 0; rowIndex <= this.maxRowIndex; rowIndex++) {
      const newRow = [];
      for (let colIndex = 0; colIndex <= this.maxColIndex; colIndex++) {
        newRow.push(this.getSeatTransformation(rowIndex, colIndex));
      }
      newMap.push(newRow);
    }
    return new Seating(newMap);
  }

  equals(otherSeating) {
    for (let rowIndex = 0; rowIndex <= this.maxRowIndex; rowIndex++) {
      for (let colIndex = 0; colIndex <= this.maxColIndex; colIndex++) {
        if (
          otherSeating.getSeat(rowIndex, colIndex) !==
          this.getSeat(rowIndex, colIndex)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  getNumOccupied() {
    let numOccupied = 0;
    for (let rowIndex = 0; rowIndex <= this.maxRowIndex; rowIndex++) {
      for (let colIndex = 0; colIndex <= this.maxColIndex; colIndex++) {
        if (this.isOccupied(rowIndex, colIndex)) numOccupied++;
      }
    }
    return numOccupied;
  }
}

const getInitialSeating = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  const inputAsArray = inputAsText.map((row) => row.split(''));
  return new Seating(inputAsArray);
};

const INPUT_FILE = 'data.csv';
const initialSeating = getInitialSeating(INPUT_FILE);

// part 1
let seating = initialSeating.getNextStep();
let newSeating;
while (true) {
  newSeating = seating.getNextStep();
  // console.log(seating.getNumOccupied() + ' vs ' + newSeating.getNumOccupied());
  if (newSeating.equals(seating)) break;
  seating = newSeating;
}

console.log(newSeating.getNumOccupied());
