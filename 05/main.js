const fs = require('fs');

const find = (code, start, stop, lowLetter) => {
  const letter = code.charAt(0);
  if (code.length == 1) {
    return letter === lowLetter ? start : stop;
  } else {
    const middle = start + (stop - start + 1) / 2;
    if (letter === lowLetter) {
      return find(code.substring(1), start, middle - 1, lowLetter);
    }
    return find(code.substring(1), middle, stop, lowLetter);
  }
};

const getSeatId = (code) => {
  const row = find(code.slice(0, -3), 0, 127, 'F');
  const column = find(code.slice(-3), 0, 7, 'L');
  return row * 8 + column;
};

let fileContent = fs.readFileSync('data.csv', 'utf8');
const codes = fileContent.split('\n');
const seatIds = codes.map(getSeatId);

// part 1
console.log(Math.max(...seatIds));

// part 2
seatIds.sort((a, b) => a - b);
for (let i = 0; i < seatIds.length - 1; i++) {
  if (seatIds[i + 1] !== seatIds[i] + 1) {
    console.log(seatIds[i] + 1);
  }
}
