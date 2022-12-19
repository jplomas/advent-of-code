const fs = require('fs');

function makeGrid(input) {
  input.forEach((line) => {
    const row = [];
    const rowOP = [];
    for (let i = 0; i < line.length; i++) {
      row.push(line[i]);
      rowOP.push(false);
    }
    grid.push(row);
    output.push(rowOP);
  });
}

function edges() {
  for (let x = 0; x < output[0].length; x++) {
    output[x][0] = true;
    output[x][output[0].length - 1] = true;
  }
  for (let y = 0; y < output.length; y++) {
    output[0][y] = true;
    output[output.length - 1][y] = true;
  }
}

function walkAround() {
  // walk along left hand edge
  for (let x = 1; x < grid.length; x++) {
    // console.log(`Look from ${x},0`);
    // console.log('Checking right');
    let max = parseInt(grid[x][0]);
    for (loop = 1; loop < grid.length - 2; loop++) {
      // console.log(`Max is ${max}m tall`);
      if (parseInt(grid[x][loop]) > max) {
        // console.log(`from here ${grid[x][loop]} is higher than ${max} so it will be visible`);
        output[x][loop] = true;
        max = parseInt(grid[x][loop]);
      }
    }
  }
  // walk along top edge
  for (let y = 1; y < grid[0].length; y++) {
    // console.log(`Look from 0,${y}`);
    // console.log('Checking down');
    let max = parseInt(grid[0][y]);
    for (loop = 1; loop < grid[0].length - 2; loop++) {
      // console.log(`Max is ${max}m tall`);
      if (parseInt(grid[loop][y]) > max) {
        // console.log(`from here ${grid[loop][y]} is higher than ${max} so it will be visible`);
        output[loop][y] = true;
        max = parseInt(grid[loop][y]);
      }
    }
  }
  // walk along right hand edge
  for (let x = grid.length - 1; x >= 0; x--) {
    // console.log(`Look from ${x},${grid.length - 1}`);
    if (x !== 0) {
      // console.log('Checking left');
      let max = parseInt(grid[x][grid.length - 1]);
      for (loop = grid[0].length - 1; loop >= 1; loop--) {
        // console.log(`Max is ${max}m tall`);
        if (parseInt(grid[x][loop]) > max) {
          // console.log(`from here ${grid[x][loop]} is higher than ${max} so it will be visible`);
          output[x][loop] = true;
          max = parseInt(grid[x][loop]);
        }
      }
    }
  }
  // walk along bottom edge
  for (let y = grid[0].length - 1; y >= 0; y--) {
    // console.log(`Look from ${grid[0].length - 1},${y}`);
    if (y !== 0) {
      // console.log('Checking up');
      let max = parseInt(grid[grid[0].length - 1][y]);
      for (loop = grid.length - 1; loop >= 1; loop--) {
        // console.log(`Max is ${max}m tall`);
        if (parseInt(grid[loop][y]) > max) {
          // console.log(`from here ${grid[loop][y]} is higher than ${max} so it will be visible`);
          output[loop][y] = true;
          max = parseInt(grid[loop][y]);
        }
      }
    }
  }
}

function countVisible() {
  let count = 0;
  for (let x = 0; x <= output.length - 1; x++) {
    for (let y = 0; y <= output[0].length - 1; y++) {
      if (output[x][y] === true) {
        count++;
      }
    }
  }
  return count;
}

function getViewingDistance(cellX, cellY, direction) {
  let score = 0;
  if (direction === 'right') {
    if (cellX < output.length - 2) {
      // console.log('Scoring Right');
      let max = parseInt(grid[cellY][cellX]);
      // console.log(`Tree is ${max}m tall`);
      for (let x = cellX + 1; x < output.length; x++) {
        score ++;
        // console.log(`Next tree is ${grid[cellY][x]}m tall`);
        if (parseInt(grid[cellY][x]) >= max) {
          break;
        }
      }
    }
    return score;
  }
  if (direction === 'down') {
    if (cellY < output[0].length - 1) {
      // console.log('Scoring Down');
      let max = parseInt(grid[cellY][cellX]);
      // console.log(`Tree is ${max}m tall`);
      for (let y = cellY + 1; y < output[0].length; y++) {
        score++;
        // console.log(`Next tree is ${grid[y][cellX]}m tall`);
        if (parseInt(grid[y][cellX]) >= max) {
          break;
        }
      }
    }
    return score;
  }
  if (direction === 'left') {
    if (cellX > 0) {
      // console.log('Scoring Left');
      let max = parseInt(grid[cellY][cellX]);
      // console.log(`Tree is ${max}m tall`);
      for (let x = cellX - 1; x >= 0; x--) {
        score++;
        // console.log(`Next tree is ${grid[cellY][x]}m tall`);
        if (parseInt(grid[cellY][x]) >= max) {
          break;
        }
      }
    }
    return score;
  }
  if (direction === 'up') {
    if (cellY > 0) {
      // console.log('Scoring Up');
      let max = parseInt(grid[cellY][cellX]);
      // console.log(`Tree is ${max}m tall`);
      for (let y = cellY - 1; y >= 0; y--) {
        score++;
        // console.log(`Next tree is ${grid[y][cellX]}m tall`);
        if (parseInt(grid[y][cellX]) >= max) {
          break;
        }
      }
    }
    return score;
  }
}

function calcScenicScore(x, y) {
  let score = 0;
  const scoreR = getViewingDistance(x, y, 'right');
  const scoreD = getViewingDistance(x, y, 'down');
  const scoreL = getViewingDistance(x, y, 'left');
  const scoreU = getViewingDistance(x, y, 'up');
  return scoreR * scoreL * scoreD * scoreU;
}

const grid = [];
const output = [];

fs.readFile('input.txt', (err, data) => {
  if (err) throw err;
  const input = data.toString().split('\n');
  makeGrid(input);
  walkAround(grid);
  edges();
  console.log('Visible trees: ', countVisible());
  // console.log('Scenic Score: ', calcScenicScore(2, 3));
  let maxScenicScore = 0;
  for (let x = 0; x < output[0].length; x++) {
    for (let y = 0; y < output.length; y++) {
      const ss = calcScenicScore(x, y);
      if (ss > maxScenicScore) {
        maxScenicScore = ss;
      }
    }
  }
  console.log('Max Scenic Score:', maxScenicScore);
});
