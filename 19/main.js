const fs = require('fs');

class Rule {
  constructor(text) {
    [this.id, this.raw] = text.split(': ');
    if (this.raw.includes('"')) {
      this.character = this.raw.slice(1, 2);
    } else {
      this.needs = this.raw.split(' | ').map((a) => a.split(' '));
    }
  }
}

class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validates(ruleId, message, index, checkLength = false, depth = 0) {
    let i = index;
    const rule = this.rules.get(ruleId);

    let delta = 0;
    let isValid = false;

    if (rule.character) {
      isValid = message[i] === rule.character;
      delta = isValid ? 1 : 0;
    } else {
      let lastValidation = false;
      for (const ruleSet of rule.needs) {
        let j = i;
        for (const subRuleId of ruleSet) {
          const subValidation = this.validates(
            subRuleId,
            message,
            j,
            false,
            depth + 1
          );
          if (subValidation.isValid) {
            j += subValidation.delta;
            lastValidation = true;
          } else {
            // try next rule set
            lastValidation = false;
            break;
          }
        }
        isValid = lastValidation;
        delta = isValid ? j - i : 0;
        if (isValid) {
          const empty = new Array(depth).fill('    ').join('');
          // console.log(empty, rule.id, `(${depth})`, ruleSet);
          break;
        }
      }
    }

    if (checkLength) {
      isValid = message.length === delta;
    }

    return { isValid, delta };
  }

  clean(message, ruleId) {
    const unwanted = this.rules.get(ruleId).needs;
    let lastValidation = false;
    let delta = 0;
    let isValid = true;
    let newMessage = message.slice();
    let numFound = 0;

    while (isValid) {
      let i = 0;
      for (const ruleSet of unwanted) {
        let j = i;
        for (const subRuleId of ruleSet) {
          const subValidation = this.validates(
            subRuleId,
            newMessage,
            j,
            false,
            0
          );
          if (subValidation.isValid) {
            j += subValidation.delta;
            lastValidation = true;
          } else {
            // try next rule set
            lastValidation = false;
            break;
          }
        }
        isValid = lastValidation;
        if (isValid) {
          numFound++;
          // console.log('found ' + ruleSet);
          delta = j - i;
          newMessage = newMessage.slice(delta);
          break;
        }
      }
    }
    return [newMessage, numFound];
  }
}

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const [rulesBlob, messagesBlob] = fileContent.split('\n\n');
  const rules = new Map();
  rulesBlob.split('\n').map((text) => {
    const rule = new Rule(text);
    rules.set(rule.id, rule);
  });
  const messages = messagesBlob.split('\n');
  const validator = new Validator(rules);
  return { validator, messages };
};

const INPUT_FILE = 'data.csv';
const { validator, messages } = getInput(INPUT_FILE);

// part 1
const validMessages = new Set();
for (const message of messages) {
  const { isValid, delta } = validator.validates('0', message, 0, true);
  if (isValid) validMessages.add(message);
}
console.log('part 1: ' + validMessages.size);

// part 2
// For part 2, any message that starts with any number of 42*X, then ends with
// any 31 and 42 in succession (ending with 31) is valid.
let numValid = 0;
for (const message of messages) {
  // Any number of 42
  const [newMessage42, numFound42] = validator.clean(message, '42');

  // Not a positive if we only have 42s (we also need at least one 31)
  if (newMessage42.length === message.length || newMessage42.length === 0)
    continue;

  // Any number of 31
  const [newMessage31, numFound31] = validator.clean(newMessage42, '31');

  if (numFound31 > 0 && numFound42 > numFound31 && newMessage31.length === 0) {
    // console.log(message);
    numValid++;
  }

  //
  // // Check for a succession of 42s and 31s ending with a 31
  // let newMessage2 = newMessage;
  // let lastIs42 = false;
  //
  // while (true) {
  //   let check1 = validator.clean(newMessage2, '31');
  //   if (check1.length != newMessage2.length) {
  //     lastIs42 = false;
  //     newMessage2 = check1;
  //     continue;
  //   }
  //
  //   let check2 = validator.clean(newMessage2, '42');
  //   if (check2.length != newMessage2.length) {
  //     console.log(message, check2, newMessage2);
  //     lastIs42 = true;
  //     newMessage2 = check2;
  //     continue;
  //   }
  //
  //   // get out if nothing has changed
  //   break;
  // }
  // if (newMessage2.length === 0 && lastIs42 === false) {
  //   numValid++;
  //   // console.log(message);
  // }
  // if (lastIs42) {
  //   console.log('ended with 42: ', message);
  // }
}
console.log('part 2: ' + numValid);
