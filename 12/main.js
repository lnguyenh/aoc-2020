const fs = require('fs');

const ROTATION = [
  { east: 1, north: 0 },
  { east: 0, north: -1 },
  { east: -1, north: 0 },
  { east: 0, north: 1 },
];

class BaseFerry {
  constructor() {
    this.position = {
      east: 0,
      north: 0,
    };
  }

  applyAll(instructions) {
    for (const instruction of instructions) {
      this.apply(instruction);
    }
    return this.getManhattan();
  }

  getManhattan() {
    return Math.abs(this.position.east) + Math.abs(this.position.north);
  }
}

class Ferry extends BaseFerry {
  constructor() {
    super();
    this.rotation = 0; // East facing in the ROTATION array
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
    if (letter == 'L') degrees = 360 - degrees;
    this.rotation = (this.rotation + degrees / 90) % 4;
  }
}

class FerryPart2 extends BaseFerry {
  constructor() {
    super();
    this.waypoint = {
      east: 10,
      north: 1,
    };
  }

  moveWaypoint(letter, distance) {
    switch (letter) {
      case 'E':
        this.waypoint.east += distance;
        break;
      case 'S':
        this.waypoint.north -= distance;
        break;
      case 'W':
        this.waypoint.east -= distance;
        break;
      case 'N':
        this.waypoint.north += distance;
        break;
    }
  }

  rotateWaypoint(letter, degrees) {
    if (letter == 'L') degrees = 360 - degrees;
    const times = (degrees / 90) % 4;
    for (let i = 0; i < times; i++) {
      this.waypoint = {
        east: this.waypoint.north,
        north: -this.waypoint.east,
      };
    }
  }

  move(times) {
    this.position.east += this.waypoint.east * times;
    this.position.north += this.waypoint.north * times;
  }

  apply(instruction) {
    let __, letter, value;
    [__, letter, value] = /^(.)(\d*)$/.exec(instruction);
    value = Number(value);
    switch (letter) {
      case 'L':
      case 'R':
        this.rotateWaypoint(letter, value);
        break;
      case 'E':
      case 'S':
      case 'W':
      case 'N':
        this.moveWaypoint(letter, value);
        break;
      case 'F':
        this.move(value);
        break;
      default:
        console.log('not handled');
        break;
    }
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

const ferry2 = new FerryPart2();
ferry2.applyAll(instructions);
console.log(ferry2.getManhattan());
