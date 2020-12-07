const fs = require('fs');

class Rule {
  constructor(ruleArray) {
    this.color = ruleArray[0];
    this.childrenRules = [];
    for (let subRule of ruleArray.slice(1)) {
      this.childrenRules.push({
        number: Number(subRule.charAt(0)),
        color: subRule.slice(2),
      });
    }
  }
}

class TreeNode1 {
  constructor(color, parent) {
    this.color = color;
    this.parent = parent;
    this.children = [];
  }

  createChildren = (rules) => {
    const childrenRules = rules[this.color].childrenRules;
    const parentColors = this.listParentColors();
    childrenRules.forEach(({ number, color }) => {
      if (parentColors.includes(color)) {
        console.log('avoid infinite loop ' + this.color);
        return;
      }
      const newChild = new TreeNode1(color, this);
      newChild.createChildren(rules);
      this.children.push(newChild);
    });
  };

  isGold = () => {
    return this.color === 'shiny gold';
  };

  listParentColors() {
    if (!this.parent || !this.parent.color) return [];
    return [this.parent.color].concat(this.parent.listParentColors());
  }
}

const buildTree1 = (rules) => {
  const root = new TreeNode1(null, null);
  for (let key in rules) {
    root.children.push(new TreeNode1(rules[key].color, root));
  }
  root.children.forEach((treeNode) => {
    treeNode.createChildren(rules);
  });
  return root;
};

const getRules = (fileName) => {
  const rules = {};
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const rulesAsText = fileContent.split('\n');
  for (let ruleAsText of rulesAsText) {
    const ruleArray = ruleAsText
      .split(
        / bags contain no other bags.| bags contain | bags, | bag, | bags\.| bag\./
      )
      .slice(0, -1);
    rules[ruleArray[0]] = new Rule(ruleArray);
  }
  return rules;
};

const traverse = (treeNode, results) => {
  if (treeNode.isGold()) {
    results.push(treeNode.listParentColors());
  }
  treeNode.children.forEach((child) => {
    traverse(child, results);
  });
};

const rules = getRules('data.csv');

// part 1
const root = buildTree1(rules);
let results = [];
traverse(root, results);
console.log(new Set(results.flat()).size);

// part 2
