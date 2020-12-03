const lineReader = require('line-reader');

const createBaseToboggan = (fileName) => {
  return new Promise((resolve) => {
    let toboggan = [];
    lineReader.eachLine(
      fileName,
      (line) => {
        let lineData = [];
        for (let character of line) {
          lineData.push(character);
        }
        toboggan.push(lineData);
      },
      (err) => {
        if (err) throw err;
        resolve(toboggan);
      }
    );
  });
};

const extendToboggan = (baseToboggan, n) => {
  let extendedToboggan = [];
  for (let i = 0; i < baseToboggan.length; i++) {
    extendedToboggan[i] = [];
    for (let j = 0; j < n; j++) {
      extendedToboggan[i] = extendedToboggan[i].concat(baseToboggan[i]);
    }
  }
  return extendedToboggan;
};

const travelToboggan = (toboggan, deltaX, deltaY) => {
  let numTrees = 0;
  let numEmpties = 0;
  for (let x = 0, y = 0; y < toboggan.length; x = x + deltaX, y = y + deltaY) {
    // console.log(toboggan[y][x]);
    if (toboggan[y][x] === '#') {
      numTrees++;
    } else {
      numEmpties++;
    }
  }
  return [numTrees, numEmpties];
};

const doPart1 = () => {
  const SLOPE_X = 3;
  const SLOPE_Y = 1;

  createBaseToboggan('data.csv').then((data) => {
    const HEIGHT = data.length;
    const WIDTH = data[0].length;

    const baseToboggan = data;
    const numExtensionsNeeded = Math.ceil((HEIGHT * SLOPE_X) / WIDTH);
    const extendedToboggan = extendToboggan(baseToboggan, numExtensionsNeeded);

    let numTrees, numEmpties;
    [numTrees, numEmpties] = travelToboggan(extendedToboggan, SLOPE_X, SLOPE_Y);

    console.log(
      numTrees,
      numEmpties,
      numExtensionsNeeded,
      extendedToboggan.length
    );
  });
};

const doPart2 = () => {
  const SLOPES = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  createBaseToboggan('data.csv').then((data) => {
    const HEIGHT = data.length;
    const WIDTH = data[0].length;
    const baseToboggan = data;
    let total = 1;

    for (let i = 0; i < SLOPES.length; i++) {
      const numExtensionsNeeded = Math.ceil(
        (HEIGHT * SLOPES[i][0]) / SLOPES[i][1] / WIDTH
      );
      const extendedToboggan = extendToboggan(
        baseToboggan,
        numExtensionsNeeded
      );

      let numTrees, numEmpties;
      [numTrees, numEmpties] = travelToboggan(
        extendedToboggan,
        SLOPES[i][0],
        SLOPES[i][1]
      );

      console.log(
        numTrees,
        numEmpties,
        numExtensionsNeeded,
        extendedToboggan.length
      );
      total = total * numTrees;
    }
    console.log(total);
  });
};

doPart1();
doPart2();
