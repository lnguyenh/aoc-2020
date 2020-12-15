class Game {
  constructor(seed) {
    this.turn = 0;
    this.turns = [];
    this.lastLastSpoken = {};
    this.lastSpoken = {};
    for (const value of seed) {
      this.applyTurn(value);
    }
    this.mostRecentlySpoken = this.turns.slice(-1)[0];
  }

  getAge(value) {
    return value in this.lastLastSpoken
      ? this.lastSpoken[value] - this.lastLastSpoken[value]
      : 0;
  }

  applyTurn(turnValue) {
    if (turnValue in this.lastSpoken) {
      this.lastLastSpoken[turnValue] = this.lastSpoken[turnValue];
    }
    this.lastSpoken[turnValue] = this.turn;
    this.turns.push(turnValue);
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

// const INPUT_ARRAY = [0, 3, 6];
const INPUT_ARRAY = [5, 2, 8, 16, 18, 0, 1];
// console.log(new Game(INPUT_ARRAY).playUntil(2020));
console.log(new Game(INPUT_ARRAY).playUntil(30000000));
