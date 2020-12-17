const fs = require('fs');

class Pocket {
  constructor(seed) {
    this.map = {};
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.minZ = 0;
    this.maxZ = 0;
    for (let y = 0; y < seed.length; y++) {
      for (let x = 0; x < seed[0].length; x++) {
        this.saveCube(x, y, 0, seed[y][x]);
      }
    }
    this.nextPocket = null;
  }

  print(z = 0) {
    for (let y = this.minY; y <= this.maxY; y++) {
      const line = [];
      for (let x = this.minX; x <= this.maxX; x++) {
        line.push(this.getCube(x, y, z));
      }
      console.log(line.join(''));
    }
  }

  getMapKey(x, y, z) {
    return `${x}:${y}:${z}`;
  }

  getCube(x, y, z) {
    const mapKey = this.getMapKey(x, y, z);
    return mapKey in this.map ? this.map[mapKey] : '.';
  }

  isActive(x, y, z) {
    return this.getCube(x, y, z) === '#';
  }

  saveCube(x, y, z, value) {
    this.map[this.getMapKey(x, y, z)] = value;
    if (x < this.minX) this.minX = x;
    if (y < this.minY) this.minY = y;
    if (z < this.minZ) this.minZ = z;
    if (x > this.maxX) this.maxX = x;
    if (y > this.maxY) this.maxY = y;
    if (z > this.maxZ) this.maxZ = z;
  }

  getNumActive() {
    let numActive = 0;
    for (const mapKey in this.map) {
      numActive += this.map[mapKey] === '#' ? 1 : 0;
    }
    return numActive;
  }

  getNumActiveNeighbors(cx, cy, cz) {
    let numActive = 0;
    for (let z = cz - 1; z <= cz + 1; z++) {
      for (let y = cy - 1; y <= cy + 1; y++) {
        for (let x = cx - 1; x <= cx + 1; x++) {
          if (x === cx && y === cy && z === cz) continue;
          numActive += this.isActive(x, y, z) ? 1 : 0;
        }
      }
    }
    return numActive;
  }

  getFutureCube(x, y, z) {
    const numActiveNeighbors = this.getNumActiveNeighbors(x, y, z);
    if (this.isActive(x, y, z)) {
      if ([2, 3].includes(numActiveNeighbors)) return '#';
    } else {
      if (numActiveNeighbors === 3) return '#';
    }
    return '.';
  }

  populateNextPocket() {
    this.nextPocket = new Pocket([]);
    for (let z = this.minZ - 1; z <= this.maxZ + 1; z++) {
      for (let y = this.minY - 1; y <= this.maxY + 1; y++) {
        for (let x = this.minX - 1; x <= this.maxX + 1; x++) {
          const nextCube = this.getFutureCube(x, y, z);
          this.nextPocket.saveCube(x, y, z, nextCube);
        }
      }
    }
  }

  getNextPocket() {
    this.populateNextPocket();
    // console.log('\n');
    // this.nextPocket.print(-1);
    // console.log('\n');
    // this.nextPocket.print(0);
    // console.log('\n');
    // this.nextPocket.print(1);
    // console.log('\n');
    return this.nextPocket;
  }

  applyNextPocket() {
    this.map = this.nextPocket.map;
    this.minX = this.nextPocket.minX;
    this.maxX = this.nextPocket.maxX;
    this.minY = this.nextPocket.minY;
    this.maxY = this.nextPocket.maxY;
    this.minZ = this.nextPocket.minZ;
    this.maxZ = this.nextPocket.maxZ;
    this.nextPocket = null;
  }

  doIt(times) {
    for (let i = 0; i < times; i++) {
      this.getNextPocket();
      this.applyNextPocket();
    }
    return this.getNumActive();
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  return new Pocket(inputAsText.map((line) => line.split('')));
};

const INPUT_FILE = 'data.csv';
const pocket = getInput(INPUT_FILE);

console.log('part 1: ' + pocket.doIt(6));
console.log('part 2: ' + '');
