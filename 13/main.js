const fs = require('fs');

class Bus {
  constructor(id) {
    this.id = id;
  }

  getNextDeparture(time) {
    return Math.ceil(time / this.id) * this.id;
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  const Buses = [];
  for (const id of inputAsText[1].split(',')) {
    if (isNaN(id)) continue;
    Buses.push(new Bus(Number(id)));
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

const INPUT_FILE = 'data.csv';
const { target, buses } = getInput(INPUT_FILE);
const { result } = getBestNextDeparture(target, buses);
console.log('part 1: ' + result);
