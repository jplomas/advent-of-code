const fs = require('fs');

fs.readFile('input.txt', (err, data) => {
  if (err) throw err;
  const elves = data.toString().split('\n\n');
  let maxCalories = 0;
  let maxCaloryElf = null;
  const totals = elves.map((elf, index) => {
    const foods = elf.split('\n');
    const calories =  foods.reduce((partialSum, a) => partialSum + parseInt(a), 0);
    if (calories > maxCalories) {
      maxCalories = calories;
      maxCaloryElf = index;
    }
    return calories;
  });
  console.log(`Elf ${maxCaloryElf} has the most calories: ${maxCalories}`);
  const sorted = totals.sort((a, b) => a - b);
  const topThree = parseInt(sorted[sorted.length - 1]) + parseInt(sorted[sorted.length - 2]) + parseInt(sorted[sorted.length - 3]);
  console.log(`The top three elves have a total of ${topThree} calories`);
});
