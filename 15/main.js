class Game {
  constructor(seed) {
    this.turn = 0;
    this.lastLastSpoken = new Map();
    this.lastSpoken = new Map();
    for (const value of seed) {
      this.applyTurn(value);
    }
  }

  getAge(value) {
    return this.lastLastSpoken.has(value)
      ? this.lastSpoken.get(value) - this.lastLastSpoken.get(value)
      : 0;
  }

  applyTurn(turnValue) {
    if (this.lastSpoken.has(turnValue)) {
      this.lastLastSpoken.set(turnValue, this.lastSpoken.get(turnValue));
    }
    this.lastSpoken.set(turnValue, this.turn);
    this.mostRecentlySpoken = turnValue;
    this.turn++;
  }

  playTurn() {
    const turnValue = this.getAge(this.mostRecentlySpoken);
    this.applyTurn(turnValue);
  }

  playUntil(endTurn) {
    while (this.turn < endTurn) {
      this.playTurn();
      // this.print();
    }
    return this.mostRecentlySpoken;
  }

  print() {
    console.log(this);
  }
}

const SEED = [5, 2, 8, 16, 18, 0, 1];
console.log('part 1: ' + new Game(SEED).playUntil(2020));
console.log('part 2: ' + new Game(SEED).playUntil(30000000));
