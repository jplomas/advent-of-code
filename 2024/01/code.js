const fs = require('fs');

fs.readFile('input.txt', (err, data) => {
  if (err) throw err;
  const items = data.toString().split('\r\n');
  let left = [];
  let right = [];
  let totalDif = 0;
  let occurs = 0;
  let similarity = 0;
  items.forEach(item => {
    const [x, y] = item.split('   ');
    left.push(x);
    right.push(y);
  })
  left = left.sort();
  right = right.sort();
  left.forEach((item, index) => {
    d = Math.abs(left[index] - right[index]);
    totalDif = totalDif + d;
  })
  console.log(`Part One: total difference is ${totalDif}`);
  left.forEach((item) => {
    occurs = right.filter((rightItem) => rightItem === item).length
    similarity = similarity + (occurs * item);
  })
  console.log(`Part Two: similarity is ${similarity}`);
});
