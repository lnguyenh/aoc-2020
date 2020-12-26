const fs = require('fs');

class Bus {
  constructor(period, offset) {
    this.period = period;
    this.offset = offset;
  }

  hasDeparture(time) {
    const targetTime = time + this.offset;
    const result = targetTime % this.period === 0;
    return result;
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  const Buses = [];
  for (const [offset, period] of inputAsText[1].split(',').entries()) {
    if (isNaN(period)) continue;
    Buses.push(new Bus(Number(period), offset));
  }
  return Buses;
};

function* busDepartureGenerator(period, start) {
  let index = start;
  while (true) {
    index += period;
    yield index;
  }
}

const INPUT_FILE = 'data.csv';
const buses = getInput(INPUT_FILE);

let period = buses[0].period;
let start = 0;
for (let i = 1; i < buses.length; i++) {
  const busDepartures = busDepartureGenerator(period, start);
  while (true) {
    const testTime = busDepartures.next().value;
    if (buses[i].hasDeparture(testTime)) {
      // Because all periods are prime, the periodicity is period1 * period2
      period = period * buses[i].period;
      start = testTime;
      break;
    }
  }
}
console.log('part 2: ' + start);
