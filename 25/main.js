class Handshake {
  constructor(publicKey) {
    this.publicKey = publicKey;
    this.loopSize = null;

    this.value = null;
    this.subject = null;

    this.initialize(7);
    this.findLoopSize();
  }

  loopOnce() {
    this.value = (this.value * this.subject) % 20201227;
  }

  loop(numTimes) {
    for (let i = 0; i < numTimes; i++) {
      this.loopOnce();
    }
  }

  initialize(subject) {
    this.value = 1;
    this.subject = subject;
  }

  findLoopSize() {
    let loopSize = 0;
    while (this.value != this.publicKey) {
      this.loopOnce();
      loopSize++;
    }
    this.loopSize = loopSize;
  }

  transform(subject) {
    this.initialize(subject);
    this.loop(this.loopSize);
    return this.value;
  }
}

const PROBLEM = {
  cardPublicKey: 8252394,
  doorPublicKey: 6269621,
};
const INPUT = PROBLEM;

const doorHandshake = new Handshake(INPUT.doorPublicKey);
// const cardHandshake = new Handshake(INPUT.cardPublicKey);

console.log('part 1: ' + doorHandshake.transform(INPUT.cardPublicKey));
