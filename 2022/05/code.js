const fs = require('fs');

function transpose(a) {
  return Object.keys(a[0]).map(function (c) {
    return a.map(function (r) {
      return r[c];
    });
  });
}

function parseMoves(input) {
  const lines = input.split('\n');
  let moves = [];
  lines.forEach((line) => {
    const instruction = line.split(' ');
    moves.push({
      quantity: parseInt(instruction[1]),
      from: parseInt(instruction[3]),
      to: parseInt(instruction[5]),
    });
  });
  return moves;
}

function parseSetup(input) {
  const lines = input.split('\n');
  const piles = (lines[0].length + 1) / 4;
  let setup = [];
  lines.forEach((line) => {
    const pile = [];
    for (let i = 0; i < piles; i++) {
      const content = line.substr(i * 4, 3);
      if (content !== '   ') {
        pile.push(content[1]);
      } else {
        pile.push(' ');
      }
    }
    setup.push(pile);
  });
  setup.length -= 1;
  const transposed = transpose(setup);
  let result = [];
  transposed.forEach((pile) => {
    result.push(removeBlanks(pile));
  });
  return result;
}

function removeBlanks(pile) {
  return pile.filter((item) => item !== ' ');
}

function doMoves(setup, moves, alt) {
  let shuffled = setup;
  moves.forEach((move) => {
    const from = move.from - 1;
    const to = move.to - 1;
    const quantity = move.quantity;
    for (let i = 0; i < quantity; i++) {
      let toShuffle = null;
      for (let j = 0; j < shuffled[from].length; j++) {
        if (shuffled[from][j] !== ' ') {
          toShuffle = shuffled[from][j];
          break;
        }
      }
      shuffled[to].unshift(toShuffle);
      shuffled[from].shift();
    }
    if (alt === true) {
      if (quantity > 1) {
        const newShuffle = shuffled[to];
        const keep = newShuffle.slice(quantity);
        newShuffle.length = quantity;
        newShuffle.reverse();
        const first = newShuffle;
        const second = keep;
        shuffled[to] = first.concat(second);
      }
    }
  });
  return shuffled;
}

function getMessage(input) {
  let result = '';
  input.forEach((pile) => {
    result += pile[0];
  });
  return result;
}

fs.readFile('input.txt', (err, data) => {
  if (err) throw err;
  const input = data.toString().split('\n\n');
  const moves = parseMoves(input[1]);
  const shuffle = doMoves(parseSetup(input[0]), moves, false);
  console.log(`CrateMover 9000 message: ${getMessage(shuffle)}`);
  const altShuffle = doMoves(parseSetup(input[0]), moves, true);
  console.log(`CrateMover 9001 message: ${getMessage(altShuffle)}`);
});
