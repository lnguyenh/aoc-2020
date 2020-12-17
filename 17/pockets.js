class BasePocket {
  constructor() {
    this.map = {};
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.minZ = 0;
    this.maxZ = 0;
    this.nextPocket = null;
  }

  getNumActive() {
    let numActive = 0;
    for (const mapKey in this.map) {
      numActive += this.map[mapKey] === '#' ? 1 : 0;
    }
    return numActive;
  }

  getNextPocket() {
    this.populateNextPocket();
    return this.nextPocket;
  }

  doIt(times) {
    for (let i = 0; i < times; i++) {
      this.getNextPocket();
      this.applyNextPocket();
    }
    return this.getNumActive();
  }
}

class Pocket extends BasePocket {
  constructor(seed) {
    super(seed);
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
    if (value === '#') {
      if (x < this.minX) this.minX = x;
      if (y < this.minY) this.minY = y;
      if (z < this.minZ) this.minZ = z;
      if (x > this.maxX) this.maxX = x;
      if (y > this.maxY) this.maxY = y;
      if (z > this.maxZ) this.maxZ = z;
    }
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

  getFutureCube(x, y, z) {
    const numActiveNeighbors = this.getNumActiveNeighbors(x, y, z);
    if (this.isActive(x, y, z)) {
      if ([2, 3].includes(numActiveNeighbors)) return '#';
    } else {
      if (numActiveNeighbors === 3) return '#';
    }
    return '.';
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
}

class Pocket2 extends BasePocket {
  constructor(seed) {
    super();
    this.minW = 0;
    this.maxW = 0;
    for (let y = 0; y < seed.length; y++) {
      for (let x = 0; x < seed[0].length; x++) {
        this.saveCube(x, y, 0, 0, seed[y][x]);
      }
    }
  }

  getMapKey(x, y, z, w) {
    return `${x}:${y}:${z}:${w}`;
  }

  getCube(x, y, z, w) {
    const mapKey = this.getMapKey(x, y, z, w);
    return mapKey in this.map ? this.map[mapKey] : '.';
  }

  isActive(x, y, z, w) {
    return this.getCube(x, y, z, w) === '#';
  }

  saveCube(x, y, z, w, value) {
    this.map[this.getMapKey(x, y, z, w)] = value;
    if (value === '#') {
      if (x < this.minX) this.minX = x;
      if (x > this.maxX) this.maxX = x;
      if (y < this.minY) this.minY = y;
      if (y > this.maxY) this.maxY = y;
      if (z < this.minZ) this.minZ = z;
      if (z > this.maxZ) this.maxZ = z;
      if (w < this.minW) this.minW = w;
      if (w > this.maxW) this.maxW = w;
    }
  }

  getNumActiveNeighbors(cx, cy, cz, cw) {
    let numActive = 0;
    for (let w = cw - 1; w <= cw + 1; w++) {
      for (let z = cz - 1; z <= cz + 1; z++) {
        for (let y = cy - 1; y <= cy + 1; y++) {
          for (let x = cx - 1; x <= cx + 1; x++) {
            if (x === cx && y === cy && z === cz && w === cw) continue;
            numActive += this.isActive(x, y, z, w) ? 1 : 0;
          }
        }
      }
    }
    return numActive;
  }

  getFutureCube(x, y, z, w) {
    const numActiveNeighbors = this.getNumActiveNeighbors(x, y, z, w);
    if (this.isActive(x, y, z, w)) {
      if ([2, 3].includes(numActiveNeighbors)) return '#';
    } else {
      if (numActiveNeighbors === 3) return '#';
    }
    return '.';
  }

  populateNextPocket() {
    this.nextPocket = new Pocket2([]);
    for (let w = this.minW - 1; w <= this.maxW + 1; w++) {
      for (let z = this.minZ - 1; z <= this.maxZ + 1; z++) {
        for (let y = this.minY - 1; y <= this.maxY + 1; y++) {
          for (let x = this.minX - 1; x <= this.maxX + 1; x++) {
            const nextCube = this.getFutureCube(x, y, z, w);
            this.nextPocket.saveCube(x, y, z, w, nextCube);
          }
        }
      }
    }
  }

  applyNextPocket() {
    this.map = this.nextPocket.map;
    this.minX = this.nextPocket.minX;
    this.maxX = this.nextPocket.maxX;
    this.minY = this.nextPocket.minY;
    this.maxY = this.nextPocket.maxY;
    this.minZ = this.nextPocket.minZ;
    this.maxZ = this.nextPocket.maxZ;
    this.minW = this.nextPocket.minW;
    this.maxW = this.nextPocket.maxW;
    this.nextPocket = null;
  }
}

module.exports = { Pocket, Pocket2 };
