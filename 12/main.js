const fs = require('fs');

const ROTATION = [
  { east: 1, north: 0 },
  { east: 0, north: -1 },
  { east: -1, north: 0 },
  { east: 0, north: 1 },
];

class Ferry {
  constructor() {
    this.rotation = 0; // East facing in the ROTATION array
    this.position = {
      east: 0,
      north: 0,
    };
  }

  describe() {
    console.log(this.rotation, this.position);
  }

  apply(instruction) {
    let __, letter, value;
    [__, letter, value] = /^(.)(\d*)$/.exec(instruction);
    value = Number(value);
    switch (letter) {
      case 'L':
      case 'R':
        this.rotate(letter, value);
        break;
      case 'E':
      case 'S':
      case 'W':
      case 'N':
        this.moveAbsolute(letter, value);
        break;
      case 'F':
        this.move(value);
        break;
      default:
        console.log('not handled');
        break;
    }
  }

  applyAll(instructions) {
    for (const instruction of instructions) {
      this.apply(instruction);
      // this.describe();
    }
    return this.getManhattan();
  }

  getManhattan() {
    return Math.abs(this.position.east) + Math.abs(this.position.north);
  }

  move(distance) {
    const direction = ROTATION[this.rotation];
    this.position.east += direction.east * distance;
    this.position.north += direction.north * distance;
  }

  moveAbsolute(letter, distance) {
    switch (letter) {
      case 'E':
        this.position.east += distance;
        break;
      case 'S':
        this.position.north -= distance;
        break;
      case 'W':
        this.position.east -= distance;
        break;
      case 'N':
        this.position.north += distance;
        break;
    }
  }

  rotate(letter, degrees) {
    if (letter == 'L') {
      degrees = 360 - degrees;
    }
    this.rotation = (this.rotation + degrees / 90) % 4;
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  return inputAsText;
};

const INPUT_FILE = 'data.csv';
const instructions = getInput(INPUT_FILE);
const ferry = new Ferry();
ferry.applyAll(instructions);
console.log(ferry.getManhattan());
