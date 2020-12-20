const fs = require('fs');

const SIZE = 10;

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

class Tile {
  constructor(blob) {
    [this.title, this.raw] = blob.split(':\n');
    this.id = Number(this.title.slice(5, 10));
    this.original = this.extract(this.raw);
    this.simpleEdges = this.getEdges(this.original);
    this.matchedEdges = 0;
  }

  extract(blob) {
    return blob.split('\n').map((line) => line.split(''));
  }

  getEdges(matrix) {
    const edges = [
      matrix[0],
      matrix.map((line) => line[0]),
      matrix.map((line) => line[SIZE - 1]),
      matrix[SIZE - 1],
    ];
    edges.push(...edges.map((edge) => reverseArray(edge)));
    return edges.map((array) => array.join(''));
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const tilesAsText = fileContent.split('\n\n');
  return tilesAsText.map((blob) => new Tile(blob));
};

// const INPUT_FILE = 'example.csv';
const INPUT_FILE = 'data.csv';
const tiles = getInput(INPUT_FILE);

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
console.log('part 2: ' + '');
