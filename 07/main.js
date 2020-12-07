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

class TreeNode {
  constructor(color, parent) {
    this.color = color;
    this.parent = parent;
    this.children = [];
  }

  createChildren(rules, onlySingles = false) {
    const childrenRules = rules[this.color].childrenRules;
    const parentColors = this.listParentColors();
    childrenRules.forEach(({ number, color }) => {
      if (parentColors.includes(color)) {
        console.log('avoid infinite loop ' + this.color);
        return;
      }
      // Creating all parents for part 1 is too heavy :/
      const maxChildrenPerColor = onlySingles ? 1 : number;
      for (let i = 0; i < maxChildrenPerColor; i++) {
        const newChild = new TreeNode(color, this);
        newChild.createChildren(rules, onlySingles);
        this.children.push(newChild);
      }
    });
  }

  isGold = () => {
    return this.color === 'shiny gold';
  };

  listParentColors() {
    if (!this.parent || !this.parent.color) return [];
    return [this.parent.color].concat(this.parent.listParentColors());
  }

  countChildren() {
    return (
      this.children.length +
      this.children
        .map((child) => child.countChildren())
        .reduce((a, b) => a + b, 0)
    );
  }
}

const buildTree1 = (rules) => {
  const root = new TreeNode(null, null);
  for (let key in rules) {
    root.children.push(new TreeNode(rules[key].color, root));
  }
  root.children.forEach((treeNode) => {
    treeNode.createChildren(rules, true);
  });
  return root;
};

const buildTree2 = (rules) => {
  const root = new TreeNode('shiny gold', null);
  root.createChildren(rules, false);
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
const root1 = buildTree1(rules);
let results = [];
traverse(root1, results);
console.log(new Set(results.flat()).size);

// part 2
const root2 = buildTree2(rules);
console.log(root2.countChildren());
