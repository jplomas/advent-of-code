const fs = require('fs');

function findUnique(input, length) {
  let count = 0;
  for (let i = length; i < input.length + 1; i++) {
    const lastFour = input.slice(i - length, i);
    const uniqueCount = new Set(lastFour).size;
    if (uniqueCount === length) {
      count = i;
      break;
    }
  }
  return count;
}

fs.readFile('input.txt', (err, data) => {
  if (err) throw err;
  const input = data.toString();
  console.log(`Need to parse ${findUnique(input, 4)} chars before a 4-char unique string is found`);
  console.log(`Need to parse ${findUnique(input, 14)} chars before a 14-char unique string is found`);
});
