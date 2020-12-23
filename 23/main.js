const fs = require('fs');

class Cup {
  constructor(value) {
    this.value = value;
    this.next = null;
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
    this.lastImported = cupsArray[array.length - 1];
    this.cups = new Map();
    for (const cup of cupsArray) {
      this.cups.set(cup.value, cup);
    }
    this.numCups = numCups;
    this.firstExtracted = this.middleExtracted = this.lastExtracted = null;
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
    this.middleExtracted = this.firstExtracted.next;
    this.lastExtracted = this.middleExtracted.next;
    this.current.next = this.lastExtracted.next;
  }

  insert() {
    const oldDestinationNext = this.destination.next;
    this.destination.next = this.firstExtracted;
    this.lastExtracted.next = oldDestinationNext;
    this.firstExtracted = this.middleExtracted = this.lastExtracted = null;
  }

  isExtracted(value) {
    return (
      value === this.firstExtracted.value ||
      value === this.middleExtracted.value ||
      value === this.lastExtracted.value
    );
  }

  updateDestination() {
    const getNextTarget = (val) => {
      let target = val;
      while (true) {
        target = target - 1;
        if (target < 1) target = this.numCups;
        if (this.isExtracted(target)) continue;
        break;
      }
      return target;
    };

    let target = getNextTarget(this.current.value);
    this.destination = this.cups.get(target);
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
  }

  playTurns(numTurns) {
    for (let i = 0; i < numTurns; i++) {
      this.playTurn();
    }
  }

  print() {
    // Useful for debugging
    const values = [];
    let cup = this.current;
    while (true) {
      values.push(cup.value);
      cup = cup.next;
      if (cup === this.current) break;
    }
    console.log(values.join());
  }

  getPart1Answer() {
    const values = [];
    let cup = this.cups.get(1).next;
    while (cup.value !== 1) {
      values.push(cup.value);
      cup = cup.next;
    }
    return values.join('');
  }

  getPart2Answer() {
    const cup = this.cups.get(1);
    const part2Number = cup.next.value * cup.next.next.value;
    return part2Number;
  }
}

const createGame = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  return new Game(fileContent.split(''));
};

const INPUT_FILE = 'data.csv';

const game = createGame(INPUT_FILE);
game.playTurns(100);
console.log('part 1: ' + game.getPart1Answer());

const game2 = createGame(INPUT_FILE);
game2.addUpTo(1000000);
game2.playTurns(10000000);
console.log('part 2: ' + game2.getPart2Answer());
