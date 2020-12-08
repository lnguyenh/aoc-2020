const fs = require('fs');

class Instruction {
  constructor(instructionAsText) {
    [this.instruction, this.argument] = instructionAsText.split(' ');
    this.argument = Number(this.argument);
  }

  evaluate(accumulator, index) {
    switch (this.instruction) {
      case 'nop':
        return [accumulator, index + 1];
      case 'jmp':
        return [accumulator, index + this.argument];
      case 'acc':
        return [accumulator + this.argument, index + 1];
      default:
        console.log('Oops ' + this.instruction);
    }
  }

  permute() {
    switch (this.instruction) {
      case 'nop':
        this.instruction = 'jmp';
        return true;
      case 'jmp':
        this.instruction = 'nop';
        return true;
      default:
        return false;
    }
  }
}

const getInstructions = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const instructionsAsText = fileContent.split('\n');
  return instructionsAsText.map((instructionAsText) => {
    return new Instruction(instructionAsText);
  });
};

const run = (instructions) => {
  const seen = [];
  let i = 0;
  let acc = 0;
  while (!seen.includes(i) && i < instructions.length) {
    seen.push(i);
    [acc, i] = instructions[i].evaluate(acc, i);
  }
  return [acc, i];
};

const fixer = (instructions) => {
  let i = 0;
  let wasPermuted, acc, lastRunIndex;
  while (i < instructions.length) {
    wasPermuted = instructions[i].permute();
    if (wasPermuted) {
      [acc, lastRunIndex] = run(instructions);
      if (lastRunIndex >= instructions.length) {
        return acc;
      } else {
        instructions[i].permute();
      }
    }
    i = i + 1;
  }
  console.log('not found');
};

const instructions = getInstructions('data.csv');

// part 1
console.log(run(instructions)[0]);

// part 2
console.log(fixer(instructions));
