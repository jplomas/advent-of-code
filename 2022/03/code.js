const fs = require('fs');

function value(c) {
  const order = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return order.indexOf(c) + 1;
}

function checkForBadge(a, b, c) {
  const order = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let checkArr = [];
  for (let i = 0; i < order.length; i++) {
    checkArr.push(0);
  }
  let pos = null;
  for (let i = 0; i < a.length; i++) {
    pos = value(a.slice(i, i + 1)) - 1;
    if (checkArr[pos] === 0) {
      checkArr[pos] = 1;
    }
  }
  for (let i = 0; i < b.length; i++) {
    pos = value(b.slice(i, i + 1)) - 1;
    if (checkArr[pos] < 2) {
      checkArr[pos] += 2;
    }
  }
  for (let i = 0; i < c.length; i++) {
    pos = value(c.slice(i, i + 1)) - 1;
    if (checkArr[pos] < 4) {
      checkArr[pos] += 4;
    }
  }
  for (let i = 0; i < order.length; i++) {
    if (checkArr[i] === 7) {
      return order.slice(i, i + 1);
    }
  }
}

fs.readFile('input.txt', (err, data) => {
  if (err) throw err;
  const rucksacks = data.toString().split('\n');
  console.log(`${rucksacks.length} rucksacks`);
  let totalValue = 0;
  rucksacks.forEach(rucksack => {
    const compartments = [
      rucksack.slice(0, rucksack.length / 2),
      rucksack.slice(rucksack.length / 2, rucksack.length)
    ];
    console.log(compartments);
    for (let i = 0; i < compartments[0].length; i++) {
      const checkDupe = compartments[0].slice(i, i + 1);
      let dupe = null;
      for (let j = 0; j < compartments[1].length; j++) {
        if (checkDupe === compartments[1].slice(j, j + 1)) {
          dupe = checkDupe;
        }
      }
      if (dupe) {
        console.log(`Found a dupe: ${dupe} with value ${value(dupe)}`);
        totalValue += value(dupe);
        break;
      }
    }
  });
  console.log(`Total value: ${totalValue}`);
  let totalBadgeValue = 0;
  for (let i = 0; i < rucksacks.length / 3; i++) {
    const badge = checkForBadge(rucksacks[(i*3)], rucksacks[(i*3) + 1], rucksacks[(i*3) + 2]);
    totalBadgeValue += value(badge);
  }
  console.log(`Total badge value: ${totalBadgeValue}`);
});
