const fs = require('fs');

function getStartEndOne(a) {
  const x = a.split('-');
  const start = parseInt(x[0]);
  const end = parseInt(x[1]);
  return { start, end }
}

function checkFullOverlap(a, b) {
  const rangeA = getStartEndOne(a);
  const rangeB = getStartEndOne(b);
  const y = b.split('-');
  const x = a.split('-');
  if (parseInt(y[0]) >= rangeA.start && parseInt(y[1]) <= rangeA.end) {
    return true
  }
  if (parseInt(x[0]) >= rangeB.start && parseInt(x[1]) <= rangeB.end) {
    return true
  }
  return false
}

function checkPartialOverlap(a, b) {
  const rangeA = getStartEndOne(a);
  const rangeB = getStartEndOne(b);
  if (rangeA.start < rangeB.start && rangeA.end < rangeB.start) {
    return false
  }
  if (rangeB.start < rangeA.start && rangeB.end < rangeA.start) {
    return false
  }
  return true
}

fs.readFile('input.txt', (err, data) => {
  if (err) throw err;
  const pairs = data.toString().split('\n');
  console.log(`${pairs.length} pairs`);
  let fullOverlaps = 0;
  let partialOverlaps = 0;
  pairs.forEach(pair => {
    sections = pair.toString().split(',');
    // console.log(sections);
    if (checkFullOverlap(sections[0], sections[1])) {
      fullOverlaps +=1 ;
    }
    if (checkPartialOverlap(sections[0], sections[1])) {
      partialOverlaps += 1;
    }
  });
  console.log(`there are ${fullOverlaps} overlaps`);
  console.log(`there are ${partialOverlaps} partial overlaps`);
});
