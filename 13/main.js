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

// part 2. The following 15 lines are my initial solution that took 1.5 hours
// sortedBuses = buses.sort((a, b) => b.id - a.id);
// const slowestBus = sortedBuses[0];
// const otherBuses = sortedBuses.slice(1);
// const slowestBusDepartures = busDeparture();
// let targetTime;
// while (true) {
//   targetTime = slowestBusDepartures.next().value;
//   if (
//     otherBuses.every((bus) => {
//       return bus.hasDeparture(targetTime, slowestBus.index);
//     })
//   )
//     break;
// }
// // This can take a while (1 or 2 hours...)
// console.log('part 2: ' + targetTime - slowestBus.index);

// Edit 20201225. I wanted to get back to this as there is a faster mathematical way
// to find the solution and I wanted to implement and verify it. The solution should
// use the "chinese remainder theorem". So I googled what it was, and implemented
// a solution using it
// https://crypto.stanford.edu/pbc/notes/numbertheory/crt.html
// Check the part "For Several Equations"
// Then extended euclidiean theorem at the bottom of:
// http://www-math.ucdenver.edu/~wcherowi/courses/m5410/exeucalg.html
const M = buses.map((b) => b.id).reduce((a, b) => a * b);
const aiBiBiPrimes = buses.map((b) => {
  const ai = b.index;
  const mi = b.id;
  const bi = M / mi;
  const biPrime = inverseOfAModuloB(bi, mi);

  return BigInt(ai) * BigInt(bi) * BigInt(biPrime);
});

const aWorkingDepartureTime = aiBiBiPrimes.reduce((a, b) => a + b);
const earliestDepartureTime = BigInt(M) - (aWorkingDepartureTime % BigInt(M));
console.log('part 2: ' + earliestDepartureTime);

function inverseOfAModuloB(a, b) {
  // in our case we want the inverse of bi modulo mi
  // http://www-math.ucdenver.edu/~wcherowi/courses/m5410/exeucalg.html
  let q0, q1, r0, r1, qi, ri, rim1, pi, pim1, pim2, qim1, qim2, Ai, Bi;
  let p0 = 0;
  let p1 = 1;

  // Initialize by doing step 0 and 1
  [q0, r0] = divide(b, a);
  [q1, r1] = divide(a, r0);

  // Prepare for the loop
  pim2 = p0;
  pim1 = p1;
  qim2 = q0;
  qim1 = q1;
  Bi = r0;
  rim1 = r1;
  while (rim1 != 0) {
    Ai = Bi;
    Bi = rim1;

    // do "i"
    [qi, ri] = divide(Ai, Bi);
    pi = jsRealModulo(pim2 - pim1 * qim2, b);

    // prepare next i
    pim2 = pim1;
    pim1 = pi;
    qim2 = qim1;
    qim1 = qi;
    rim1 = ri;
  }

  // in our case we can always assume that we do have an inverse so we skip the
  // check for rest being 1 at previous to last step and we just compute the next
  // p that should be our solution (crossing fingers)
  return jsRealModulo(pim2 - pim1 * qim2, b);
}

function divide(x, y) {
  return [Math.floor(x / y), x % y];
}

function jsRealModulo(a, n) {
  // also works when a and n are of different sign ("%" is
  // remainder and not modulo in js)
  return ((a % n) + n) % n;
}
