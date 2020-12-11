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

  getNumOccupiedInLine(row, col, deltaRow, deltaCol) {
    const getNextRow = (row) => {
      const nextRow = row + deltaRow;
      if (nextRow > this.maxRowIndex || nextRow < 0) return null;
      return nextRow;
    };
    const getNextCol = (col) => {
      const nextCol = col + deltaCol;
      if (nextCol > this.maxColIndex || nextCol < 0) return null;
      return nextCol;
    };

    let seatRow = getNextRow(row);
    let seatCol = getNextCol(col);

    while (seatRow !== null && seatCol !== null) {
      if (this.isOccupied(seatRow, seatCol)) return true;
      if (this.isEmpty(seatRow, seatCol)) return false;
      seatRow = getNextRow(seatRow);
      seatCol = getNextCol(seatCol);
    }
    return false;
  }

  getAllNumOccupiedInLine(row, col) {
    const lines = [
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
    ];
    let numOccupied = 0;
    for (const line of lines) {
      numOccupied += this.getNumOccupiedInLine(row, col, ...line);
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

  getSeatTransformation2(row, col) {
    if (this.isFloor(row, col)) return '.';
    const numOccupiedAdjacentSeats = this.getAllNumOccupiedInLine(row, col);
    if (this.isEmpty(row, col) && numOccupiedAdjacentSeats === 0) return '#';
    if (this.isOccupied(row, col) && numOccupiedAdjacentSeats >= 5) return 'L';
    return this.getSeat(row, col);
  }

  getNextpart(mode) {
    const newMap = [];
    for (let rowIndex = 0; rowIndex <= this.maxRowIndex; rowIndex++) {
      const newRow = [];
      for (let colIndex = 0; colIndex <= this.maxColIndex; colIndex++) {
        switch (mode) {
          case 'part1':
            newRow.push(this.getSeatTransformation(rowIndex, colIndex));
            break;
          case 'part2':
            newRow.push(this.getSeatTransformation2(rowIndex, colIndex));
            break;
          default:
            console.log('booo');
            break;
        }
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

const findNumOccupiedAtEquilibrium = (initialSeating, mode) => {
  let seating = initialSeating.getNextpart(mode);
  let newSeating;
  while (true) {
    newSeating = seating.getNextpart(mode);
    if (newSeating.equals(seating)) break;
    seating = newSeating;
  }
  return seating.getNumOccupied();
};

const INPUT_FILE = 'data.csv';
const initialSeating = getInitialSeating(INPUT_FILE);
console.log('part 1: ' + findNumOccupiedAtEquilibrium(initialSeating, 'part1'));
console.log('part 2: ' + findNumOccupiedAtEquilibrium(initialSeating, 'part2'));
