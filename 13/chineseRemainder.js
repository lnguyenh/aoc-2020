/*
Edit 20201225. I wanted to get back to this as there is a faster mathematical way
to find the solution and I wanted to implement and verify it. The solution should
use the "chinese remainder theorem". So I googled what it was, and implemented
a solution using it

1) Chinese remainder theory:
https://crypto.stanford.edu/pbc/notes/numbertheory/crt.html
Check the part "For Several Equations"

2) Extended euclidian theorem theory:
http://www-math.ucdenver.edu/~wcherowi/courses/m5410/exeucalg.html
Check the bottom part of the article
*/

const fs = require('fs');

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  const Buses = [];
  for (const [index, id] of inputAsText[1].split(',').entries()) {
    if (isNaN(id)) continue;
    Buses.push({ id: Number(id), index });
  }
  return Buses;
};

function inverseOfAModuloB(a, b) {
  // in our case we will want the inverse of bi modulo mi
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

const INPUT_FILE = 'data.csv';
const buses = getInput(INPUT_FILE);

const M = buses.map((b) => b.id).reduce((a, b) => a * b);
const aiBiBiPrimes = buses.map((b) => {
  const mi = b.id;
  const ai = mi - b.index; // interesting: it also works if you add mi, 2mi, 3mi etc...
  const bi = M / mi;
  const biPrime = inverseOfAModuloB(bi, mi);

  return BigInt(ai) * BigInt(bi) * BigInt(biPrime);
});

const aWorkingDepartureTime = aiBiBiPrimes.reduce((a, b) => a + b);
// console.log(aWorkingDepartureTime % BigInt(M));
// console.log(BigInt(M));
const earliestDepartureTime = aWorkingDepartureTime % BigInt(M);
console.log('part 2: ' + earliestDepartureTime);
