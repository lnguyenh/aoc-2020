const fs = require('fs');

class Deck {
  constructor(text) {
    [this.name, this.raw] = text.split(':\n');
    this.current = this.raw.split('\n').map((v) => Number(v));
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

  getScore() {
    let score = 0;
    const reversedDeck = this.current.slice().reverse();
    for (const [i, card] of reversedDeck.entries()) {
      score += (i + 1) * card;
    }
    return score;
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
    const [card1, card2] = [deck1.popFirst(), deck2.popFirst()];
    if (card1 > card2) {
      deck1.take([card1, card2]);
    } else {
      deck2.take([card2, card1]);
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
  playTurn() {
    const [card1, card2] = [deck1.popFirst(), deck2.popFirst()];
    if (card1 > card2) {
      deck1.take([card1, card2]);
    } else {
      deck2.take([card2, card1]);
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

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const decksAsText = fileContent.split('\n\n');
  return decksAsText.map((text) => new Deck(text));
};

const INPUT_FILE = 'example2.csv';
const [deck1, deck2] = getInput(INPUT_FILE);
// const game1 = new Game1(deck1, deck2);
// game1.playFullGame();
// console.log('part 1: ' + game1.getScore());

const game2 = new Game2(deck1, deck2);
console.log('part 2: ' + '');
