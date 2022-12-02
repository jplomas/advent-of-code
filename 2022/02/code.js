const fs = require('fs');

function scoreRound(input) {
  const scoreMap = {
    'A': 1,
    'B': 2,
    'C': 3,
    'X': 1,
    'Y': 2,
    'Z': 3
  };
  const playerAMove = input[0];
  const playerBMove = input[2];
  let playerAScore = scoreMap[playerAMove];
  let playerBScore = scoreMap[playerBMove];
  if (playerAScore === playerBScore) {
    // draw
    playerAScore += 3;
    playerBScore += 3;
    return [playerAScore, playerBScore]
  }
  if (playerAMove === 'A' && playerBMove === 'Y') {
    playerBScore += 6;
  }
  if (playerAMove === 'A' && playerBMove === 'Z') {
    playerAScore += 6;
  }
  if (playerAMove === 'B' && playerBMove === 'X') {
    playerAScore += 6;
  }
  if (playerAMove === 'B' && playerBMove === 'Z') {
    playerBScore += 6;
  }
  if (playerAMove === 'C' && playerBMove === 'X') {
    playerBScore += 6;
  }
  if (playerAMove === 'C' && playerBMove === 'Y') {
    playerAScore += 6;
  }
  return [playerAScore, playerBScore];
}

function recode(game) {
  let wld = '';
  if (game[2] === 'X') {
    wld = 'L';
  }
  if (game[2] === 'Y') {
    wld = 'D';
  }
  if (game[2] === 'Z') {
    wld = 'W';
  }
  return `${game[0]}${game[1]}${wld}`;
}

function choose(code) {
  // use a lookup table to choose the correct move for the desired outcome
  const possibilities = {
    'A W': 'A Y',
    'A D': 'A X',
    'A L': 'A Z',
    'B W': 'B Z',
    'B D': 'B Y',
    'B L': 'B X',
    'C W': 'C X',
    'C D': 'C Z',
    'C L': 'C Y'
  }
  return possibilities[code];
}

fs.readFile('input.txt', (err, data) => {
  if (err) throw err;
  const games = data.toString().split('\n');
  const scores = games.map(game => scoreRound(game));
  let playerBTotal = 0;
  scores.forEach(score => { playerBTotal += score[1] });
  console.log(`Total for Player 1 in part One: ${playerBTotal}`);
  const outcomes = games.map(game => recode(game));
  const newGames = outcomes.map(outcome => choose(outcome));
  const newScores = newGames.map(game => scoreRound(game));
  let playerBNewTotal = 0;
  newScores.forEach(score => { playerBNewTotal += score[1] });
  console.log(`Total for Player 1 in part Two: ${playerBNewTotal}`);
});
