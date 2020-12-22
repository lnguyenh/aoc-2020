const fs = require('fs');

class Deck {
  constructor(blob) {
    if (typeof blob === 'string') {
      [this.name, this.raw] = blob.split(':\n');
      this.current = this.raw.split('\n').map((v) => Number(v));
    } else {
      this.current = blob;
    }
  }

  popFirst() {
    return this.current.shift();
  }

  take(cards) {
    this.current.push(...cards);
  }

  hasCards() {
    return this.current.length > 0;
  }

  currentAsString() {
    return this.current.join('');
  }

  getScore() {
    let score = 0;
    const reversedDeck = this.current.slice().reverse();
    for (const [i, card] of reversedDeck.entries()) {
      score += (i + 1) * card;
    }
    return score;
  }

  size() {
    return this.current.length;
  }

  copy() {
    return new Deck(this.current.slice());
  }
}

class BaseGame {
  constructor(deck1, deck2) {
    this.deck1 = deck1;
    this.deck2 = deck2;
    this.turnsPlayed = 0;
  }

  getScore() {
    return Math.max(this.deck1.getScore(), this.deck2.getScore());
  }
}

class Game1 extends BaseGame {
  playTurn() {
    const [card1, card2] = [this.deck1.popFirst(), this.deck2.popFirst()];
    if (card1 > card2) {
      this.deck1.take([card1, card2]);
    } else {
      this.deck2.take([card2, card1]);
    }
    this.turnsPlayed++;
  }

  isOver() {
    return !this.deck1.hasCards() || !this.deck2.hasCards();
  }

  playFullGame() {
    while (!this.isOver()) {
      this.playTurn();
    }
  }
}

class Game2 extends BaseGame {
  constructor(deck1, deck2) {
    super(deck1, deck2);
    this.states = [];
    this.winner = -1;
  }

  getState() {
    return [this.deck1.currentAsString(), this.deck2.currentAsString()].join(
      '-'
    );
  }

  saveState() {
    this.states.push(this.getState());
  }

  playTurn() {
    // if state was seen before stop
    if (this.states.includes(this.getState)) {
      this.winner = 1;
      return;
    }

    this.saveState();

    let roundWinner = -1;
    // draw cards
    const [card1, card2] = [this.deck1.popFirst(), this.deck2.popFirst()];

    // check if we need to play a recursive subGame
    if (card1 >= this.deck1.size() && card2 >= this.deck2.size()) {
      // Play a new Game with remaining cards
      const subGame = new Game2(this.deck1.copy(), this.deck2.copy());
      roundWinner = subGame.playFullGame();
    } else {
      if (card1 > card2) roundWinner = 1;
      else roundWinner = 2;
    }

    if (roundWinner == 1) this.deck1.take([card1, card2]);
    else this.deck2.take([card2, card1]);

    if (!this.deck1.hasCards()) this.winner = 2;
    if (!this.deck2.hasCards()) this.winner = 1;

    this.turnsPlayed++;
  }

  isOver() {
    return this.winner > 0;
  }

  playFullGame() {
    while (!this.isOver()) {
      this.playTurn();
    }
    return this.winner;
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const decksAsText = fileContent.split('\n\n');
  return decksAsText.map((text) => new Deck(text));
};

const INPUT_FILE = 'example.csv';
const [deck1, deck2] = getInput(INPUT_FILE);
// const game1 = new Game1(deck1, deck2);
// game1.playFullGame();
// console.log('part 1: ' + game1.getScore());

const game2 = new Game2(deck1, deck2);
game2.playFullGame();
console.log('part 2: ' + '');
