const fs = require('fs');

const getInput = (fileName) => {
  let fileContent = fs.readFileSync(fileName, 'utf8');
  const inputAsText = fileContent.split('\n');
  return inputAsText;
};

const INPUT_FILE = 'data.csv';
const foodLines = getInput(INPUT_FILE);

const foods = [];
let ingredients = new Set();
const allergens = new Map();
const ingredientPart2 = new Map();

for (const line of foodLines) {
  const match = /^([(\w+)\ ]+) \(contains ([(\w+), ]+)\)$/.exec(line);
  const foodIngredients = match[1].split(' ');
  const foodAllergens = match[2] ? match[2].split(', ') : [];

  foods.push({ ingredients: foodIngredients });

  ingredients = new Set([...ingredients, ...foodIngredients]);

  for (const allergen of foodAllergens) {
    if (allergens.has(allergen)) {
      const ingredientIntersection = allergens
        .get(allergen)
        .filter((a) => foodIngredients.includes(a));
      allergens.set(allergen, ingredientIntersection);
    } else {
      allergens.set(allergen, foodIngredients);
    }
  }

  for (const ingredient of foodIngredients) {
    if (ingredientPart2.has(ingredient)) {
      const allergenSet = new Set([
        ...ingredientPart2.get(ingredient),
        ...foodAllergens,
      ]);
      ingredientPart2.set(ingredient, allergenSet);
    } else {
      ingredientPart2.set(ingredient, new Set(foodAllergens));
    }
  }
}

const cleanIngredients = new Set(ingredients);
for (const [__, ingredientList] of allergens) {
  ingredientList.forEach((i) => cleanIngredients.delete(i));
}
let part1Answer = 0;
for (const ingredient of cleanIngredients) {
  for (const food of foods) {
    if (food.ingredients.includes(ingredient)) part1Answer++;
  }
}
console.log('part 1: ' + part1Answer);

for (const [allergen, ingredientSet] of allergens) {
  allergens.set(
    allergen,
    new Set([...ingredientSet].filter((i) => !cleanIngredients.has(i)))
  );
}

const cleanedAllergens = [];
while (allergens.size > 0) {
  for (const [allergen, ingredientSet] of allergens) {
    if (ingredientSet.size === 1) {
      const ingredient = [...ingredientSet][0];
      cleanedAllergens.push({
        allergen,
        ingredient,
      });
      allergens.delete(allergen);
      for (const [__, iSet] of allergens) {
        iSet.delete(ingredient);
      }
      break;
    }
  }
}
cleanedAllergens.sort((a, b) => a.allergen.localeCompare(b.allergen));
const resultPart2 = cleanedAllergens.map((a) => a.ingredient).join(',');
console.log('part 2: ' + resultPart2);
