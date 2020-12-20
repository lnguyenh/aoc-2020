const fs = require('fs');

const SIZE = 10;

class BaseMatrix {
  constructor() {
    this.current = [[]];
  }

  flipV() {
    for (let i = 0; i < this.width; i++) {
      this.current[i].reverse();
    }
    this.refreshEdges();
  }

  rotate90() {
    const X = this.width / 2;
    const Y = this.width - 1;
    for (let i = 0; i < X; i++) {
      for (let j = i; j < Y - i; j++) {
        const k = this.current[i][j];
        this.current[i][j] = this.current[Y - j][i];
        this.current[Y - j][i] = this.current[Y - i][Y - j];
        this.current[Y - i][Y - j] = this.current[j][Y - i];
        this.current[j][Y - i] = k;
      }
    }
    this.refreshEdges();
  }

  refreshEdges() {
    this.currentEdges.set('top', this.current[0].join(''));
    this.currentEdges.set('bottom', this.current[this.width - 1].join(''));
    this.currentEdges.set('left', this.current.map((line) => line[0]).join(''));
    this.currentEdges.set(
      'right',
      this.current.map((line) => line[this.width - 1]).join('')
    );
  }
}

class Tile extends BaseMatrix {
  constructor(blob) {
    super();
    [this.title, this.raw] = blob.split(':\n');
    this.id = Number(this.title.slice(5, 10));
    this.original = this.extract(this.raw);
    this.currentEdges = new Map();
    this.width = SIZE;

    // part 1
    this.simpleEdges = this.getEdges();
    this.matchedEdges = 0;

    // part 2
    this.current = this.original.map((line) => [...line]);
    this.refreshEdges();
  }

  extract(blob) {
    return blob.split('\n').map((line) => line.split(''));
  }

  getEdges() {
    const edges = [
      this.original[0],
      this.original.map((line) => line[0]),
      this.original.map((line) => line[this.width - 1]),
      this.original[this.width - 1],
    ];
    edges.push(...edges.map((edge) => [...edge].reverse()));
    return edges.map((array) => array.join(''));
  }

  hasMatch(tileMap, where) {
    for (const [key, tile] of tileMap) {
      if (tile.simpleEdges.includes(this.currentEdges.get(where))) return true;
    }
    return false;
  }

  hasRightAndBottomMatch(tileMap) {
    return this.hasMatch(tileMap, 'right') && this.hasMatch(tileMap, 'bottom');
  }

  orientInitial(tileMap) {
    while (true) {
      this.rotate90();
      if (this.hasRightAndBottomMatch(tileMap)) {
        return;
      }
    }
  }

  *getNextPosition() {
    yield true;
    this.rotate90();
    yield true;
    this.rotate90();
    yield true;
    this.rotate90();
    yield true;
    this.rotate90();
    this.flipV();
    yield true;
    this.rotate90();
    yield true;
    this.rotate90();
    yield true;
    this.rotate90();
    yield true;
    this.rotate90();
    this.flipV();
    this.rotate90();
    this.flipV();
    yield true;
    this.rotate90();
    yield true;
    this.rotate90();
    yield true;
    this.rotate90();
    yield true;
    return;
  }

  matchesTiles(otherTile, where) {
    switch (where) {
      case 'top':
        return (
          otherTile.currentEdges.get('bottom') === this.currentEdges.get('top')
        );
      case 'right':
        return (
          otherTile.currentEdges.get('left') === this.currentEdges.get('right')
        );
      case 'left':
        return (
          otherTile.currentEdges.get('right') === this.currentEdges.get('left')
        );
      case 'bottom':
        return (
          otherTile.currentEdges.get('top') === this.currentEdges.get('bottom')
        );
      default:
        throw Error;
    }
  }

  match(knownNeighbors) {
    const positionIterator = this.getNextPosition();
    while (positionIterator.next().value === true) {
      let abort = false;
      for (const where in knownNeighbors) {
        if (knownNeighbors[where]) {
          if (!this.matchesTiles(knownNeighbors[where], where)) {
            abort = true;
            break;
          }
        }
      }
      if (abort) {
        continue;
      } else {
        return true;
      }
    }
    return false;
  }
}

class Image extends BaseMatrix {
  constructor(positions) {
    super();
    const width = Math.sqrt(positions.size);
    this.image = new Array(width * (SIZE - 2));
    for (let i = 0; i < this.image.length; i++) {
      this.image[i] = new Array(width * (SIZE - 2));
    }
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++) {
        const currentTile = positions.get(`${i}-${j}`);
        for (let k = 1; k < SIZE - 1; k++) {
          for (let l = 1; l < SIZE - 1; l++) {
            this.image[i * (SIZE - 2) + k - 1][j * (SIZE - 2) + l - 1] =
              currentTile.current[k][l];
          }
        }
      }
    }
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const tilesAsText = fileContent.split('\n\n');
  return tilesAsText.map((blob) => new Tile(blob));
};

const INPUT_FILE = 'example.csv';
//const INPUT_FILE = 'data.csv';
const tiles = getInput(INPUT_FILE);

// part 1
const cornerCandidates = [];
for (const tile of tiles) {
  for (const comparisonTile of tiles) {
    if (tile.id === comparisonTile.id) continue;
    for (const edge of tile.simpleEdges) {
      if (comparisonTile.simpleEdges.includes(edge)) tile.matchedEdges++;
    }
  }
  if (tile.matchedEdges === 4) cornerCandidates.push(tile.id);
}
console.log('part 1: ' + cornerCandidates.reduce((a, b) => a * b, 1));

// MAKE IMAGE

// Keep track of corners left to find
const candidates = new Map();
tiles.map((tile) => candidates.set(tile.id, tile));
const positions = new Map();

// starting corner
width = Math.sqrt(candidates.size);
const startingCorner = candidates.get(cornerCandidates[0]);
candidates.delete(startingCorner.id);
startingCorner.orientInitial(candidates);
positions.set('0-0', startingCorner);

for (let i = 0; i < width; i++) {
  for (let j = 0; j < width; j++) {
    if (positions.has(`${i}-${j}`)) {
      continue;
    }
    const knownNeighbors = {
      left: positions.get(`${i}-${j - 1}`),
      top: positions.get(`${i - 1}-${j}`),
      right: positions.get(`${i}-${j + 1}`),
      bottom: positions.get(`${i + 1}-${j}`),
    };
    for (const [id, candidateTile] of candidates) {
      const canMatch = candidateTile.match(knownNeighbors);
      if (canMatch) {
        candidates.delete(id);
        positions.set(`${i}-${j}`, candidateTile);
      }
    }
  }
}

// Merge
const image = new Image(positions);

console.log('part 2: ' + '');

function arraysMatch(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; arr1.length < i; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function reverseArray(array) {
  const newArray = [];
  for (const val of array) newArray.unshift(val);
  return newArray;
}
