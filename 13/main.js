const fs = require('fs');
const mathjs = require('mathjs');

class Bus {
  constructor(id, index) {
    this.id = id;
    this.period = id;
    this.index = index;
    this.delta = index;
  }

  getNextDeparture(time) {
    return Math.ceil(time / this.id) * this.id;
  }

  hasDeparture(time, delta) {
    const targetTime = time - delta + this.index;
    const result = targetTime % this.id === 0;
    if (result) console.log(time, delta, this.period);
    return result;
  }
}
function* busDeparture(bus) {
  let index = 0;
  while (true) {
    index++;
    yield bus.id * index;
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

const INPUT_FILE = 'example.csv';
const { target, buses } = getInput(INPUT_FILE);

const { result } = getBestNextDeparture(target, buses);
console.log('part 1: ' + result);

sortedBuses = buses.sort((a, b) => b.id - a.id);
console.log(sortedBuses);
const slowestBus = sortedBuses[0];
const otherBuses = sortedBuses.slice(1);
const slowestBusDepartures = busDeparture(slowestBus);

// part 2 slow
let targetTime;
while (true) {
  targetTime = slowestBusDepartures.next().value;
  // console.log(targetTime);
  if (
    otherBuses.every((bus) => {
      return bus.hasDeparture(targetTime, slowestBus.index);
    })
  )
    break;
}
console.log(targetTime - slowestBus.index);

// const lcm = mathjs.lcm(23, 41, 37, 479, 13, 17, 29, 373, 19);
// console.log(lcm);
