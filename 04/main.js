const fs = require('fs');

const VALID_TYPES = ['ecl', 'eyr', 'pid', 'hcl', 'byr', 'iyr', 'hgt', 'cid'];
const REQUIRED_TYPES = ['ecl', 'eyr', 'pid', 'hcl', 'byr', 'iyr', 'hgt'];
const VALID_COLORS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

class Field {
  constructor(text) {
    [this.type, this.value] = text.split(':');
    this.numberValue = Number(this.value);
  }

  isValid = () => {
    if (!VALID_TYPES.includes(this.type)) return false;

    switch (this.type) {
      case 'ecl':
        return VALID_COLORS.includes(this.value);
      case 'eyr':
        return (
          Number.isInteger(this.numberValue) &&
          this.value >= 2020 &&
          this.value <= 2030
        );
      case 'pid':
        return this.value.length === 9 && Number.isInteger(this.numberValue);
      case 'hcl':
        const pattern = /^#[a-z0-9]{6}$/;
        return pattern.exec(this.value);
      case 'byr':
        return (
          Number.isInteger(this.numberValue) &&
          this.value >= 1920 &&
          this.value <= 2020
        );
      case 'iyr':
        return (
          Number.isInteger(this.numberValue) &&
          this.value >= 2010 &&
          this.value <= 2020
        );
      case 'hgt':
        const cmPattern = /^(\d*)cm$/;
        const cmMatch = cmPattern.exec(this.value);
        if (cmMatch) {
          const height = Number(cmMatch[1]);
          // console.log('height is ' + height + ' cm ' + cmMatch);
          return Number.isInteger(height) && height >= 150 && height <= 193;
        }

        const inPattern = /^(\d*)in$/;
        const inMatch = inPattern.exec(this.value);
        if (inMatch) {
          const height = Number(inMatch[1]);
          // console.log('height is ' + height + ' in ' + inMatch);
          return Number.isInteger(height) && height >= 59 && height <= 76;
        }

        return false;
      case 'cid':
        return true;
    }
    console.log('never reached ' + this.type);
    return false;
  };
}

// Read input
let fileContent = fs.readFileSync('data.csv', 'utf8');
let cleanedFileContent = fileContent
  .replaceAll('\n\n', '_')
  .replaceAll('\n', ' ')
  .replaceAll('_', '\n');
const rows = cleanedFileContent.split('\n');

// Do checks
let numValid = 0;
rows.forEach((row) => {
  let valid = true;

  // Part 1
  for (let key of REQUIRED_TYPES) {
    if (!row.includes(key + ':')) {
      valid = false;
      break;
    }
  }

  // Part 2
  const rawFields = row.split(' ');
  for (let i = 0; i < rawFields.length; i++) {
    let field = new Field(rawFields[i]);
    if (!field.isValid()) {
      console.log(field.type, field.value, 'INVALID');
      valid = false;
      break;
    }
  }

  if (valid === true) {
    numValid += 1;
  }
});

console.log(numValid);
