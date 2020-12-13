const fs = require('fs');

class Bus {
  constructor(id, index) {
    this.id = id;
    this.index = index;
  }

  getNextDeparture(time) {
    return Math.ceil(time / this.id) * this.id;
  }

  hasDeparture(time, delta) {
    const targetTime = time - delta + this.index;
    const result = targetTime % this.id === 0;
    return result;
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  const Buses = [];
  for (const [index, id] of inputAsText[1].split(',').entries()) {
    if (isNaN(id)) continue;
    Buses.push(new Bus(Number(id), index));
  }
  return {
    target: Number(inputAsText[0]),
    buses: Buses,
  };
};

const getBestNextDeparture = (target, buses) => {
  const departures = buses.map((bus) => bus.getNextDeparture(target));
  const bestDeparture = Math.min(...departures);
  const bus = buses[departures.indexOf(bestDeparture)];
  const waitTime = bestDeparture - target;
  const result = bus.id * waitTime;
  return { bestDeparture, bus, waitTime, result };
};

function* busDeparture() {
  let index = 0;
  while (true) {
    // Manual optimization for part 2 (23 x a = 479 x b - 23)
    // so we increment by the lowest common multiple of 479 and 23 (11017)
    // const lcm = mathjs.lcm(479, 23);
    index += 11017;
    yield index;
  }
}

const INPUT_FILE = 'data.csv';
const { target, buses } = getInput(INPUT_FILE);

const { result } = getBestNextDeparture(target, buses);
console.log('part 1: ' + result);

sortedBuses = buses.sort((a, b) => b.id - a.id);
const slowestBus = sortedBuses[0];
const otherBuses = sortedBuses.slice(1);

// part 2
const slowestBusDepartures = busDeparture();
let targetTime;
while (true) {
  targetTime = slowestBusDepartures.next().value;
  if (
    otherBuses.every((bus) => {
      return bus.hasDeparture(targetTime, slowestBus.index);
    })
  )
    break;
}
// This can take a while (1 or 2 hours...)
console.log('part 2: ' + targetTime - slowestBus.index);
