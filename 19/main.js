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

  validates(ruleId, message, index, checkLength = false) {
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
          const subRule = this.rules.get(subRuleId);
          const subValidation = this.validates(subRuleId, message, j);
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
        if (isValid) break;
      }
    }

    if (checkLength) {
      isValid = message.length === delta;
    }

    return { isValid, delta };
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

const INPUT_FILES = ['data.csv'];
for (const inputFile of INPUT_FILES) {
  const { validator, messages } = getInput(inputFile);
  let numValid = 0;
  for (const message of messages) {
    const { isValid, delta } = validator.validates('0', message, 0, true);
    if (isValid) numValid += 1;
  }
  console.log(inputFile + ': ' + numValid);
}
