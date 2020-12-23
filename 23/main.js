const fs = require('fs');

class Cup {
  constructor(value) {
    this.value = value;
    this.next = null;

    this.firstExtracted = null;
    this.lastExtracted = null;
  }
}

class Game {
  constructor(array) {
    const numCups = array.length;

    const cupsArray = array.map((v) => new Cup(Number(v)));
    for (let i = 0; i < numCups; i++) {
      const cup = cupsArray[i];
      cup.next = cupsArray[(i + 1) % numCups];
    }
    this.current = cupsArray[0];
    this.firstImported = cupsArray[0];
    this.lastImported = cupsArray[array.length - 1];

    this.cups = new Map();
    for (const cup of cupsArray) {
      this.cups.set(cup.value, cup);
    }

    this.numCups = numCups;

    this.print();
  }

  addUpTo(numCups) {
    // Should only be called directly after initialisation
    const startValue = this.numCups + 1;
    let cup = this.lastImported;
    for (let i = startValue; i <= numCups; i++) {
      const newCup = new Cup(i);
      this.cups.set(i, newCup);
      cup.next = newCup;
      cup = newCup;
    }
    cup.next = this.current;
    this.numCups = numCups;
  }

  extract() {
    this.firstExtracted = this.current.next;
    this.lastExtracted = this.firstExtracted.next.next;
    this.current.next = this.lastExtracted.next;
  }

  insert() {
    const oldDestinationNext = this.destination.next;
    this.destination.next = this.firstExtracted;
    this.lastExtracted.next = oldDestinationNext;
    this.firstExtracted = this.lastExtracted = null;
  }

  updateDestination() {
    const getNextTarget = (val) => {
      let target = val - 1;
      if (target < 1) {
        target = this.numCups;
      }
      return target;
    };

    let cup = this.current.next;
    let target = getNextTarget(this.current.value);
    while (cup.value !== target) {
      cup = cup.next;
      if (cup === this.current) {
        target = getNextTarget(target);
      }
    }
    this.destination = cup;
  }

  moveCurrent() {
    this.current = this.current.next;
    this.destination = null;
  }

  playTurn() {
    this.extract();
    this.updateDestination();
    this.insert();
    this.moveCurrent();
    this.print();
  }

  playTurns(numTurns) {
    for (let i = 0; i < numTurns; i++) {
      this.playTurn();
    }
  }

  print() {
    const values = [];
    let cup = this.current;
    while (true) {
      values.push(cup.value);
      cup = cup.next;
      if (cup === this.current) break;
    }
    console.log(values.join());
  }

  getPart1Number() {
    const values = [];
    let foundTheOne = false;
    let cup = this.current;
    while (true) {
      cup = cup.next;
      if (cup.value !== 1 && !foundTheOne) {
        continue;
      } else if (cup.value === 1 && !foundTheOne) {
        foundTheOne = true;
        continue;
      } else if (cup.value === 1 && foundTheOne) {
        break;
      } else {
        values.push(cup.value);
      }
    }
    return values.join('');
  }

  getPart2Number() {
    let cup = this.current;
    while (cup.value !== 1) {
      cup = cup.next;
    }
    const part2Number = cup.next.value * cup.next.next.value;
    console.log(part2Number);
    return part2Number;
  }
}

const createGame = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  return new Game(fileContent.split(''));
};

const INPUT_FILE = 'example.csv';
const game = createGame(INPUT_FILE);
game.playTurns(10);
console.log('part 1: ' + game.getPart1Number());

const game2 = createGame(INPUT_FILE);
game2.addUpTo(1000000);
// game2.playTurns(10000000);
// game2.playTurns(10);
console.log('part 2: ' + game2.getPart2Number());
console.log('done');
