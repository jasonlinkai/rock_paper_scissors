const { RAISE_TYPES } = require('./constants')

const computedRockPaperScissorsResult = (raisedRecord, raiseIds) => {
  let winner;
  const player1Hand = raisedRecord[raiseIds[0]]
  const player2Hand = raisedRecord[raiseIds[1]]
  if (player1Hand === player2Hand) {
    return "此局平手~再試一次吧!";
  } else if (
    (player1Hand === RAISE_TYPES.SCISSORS && player2Hand === RAISE_TYPES.PAPER) ||
    (player1Hand === RAISE_TYPES.ROCK && player2Hand === RAISE_TYPES.SCISSORS) ||
    (player1Hand === RAISE_TYPES.PAPER && player2Hand === RAISE_TYPES.ROCK)
  ) {
    winner = raiseIds[0];
  } else {
    winner = raiseIds[1];
  }
  return `贏家是${winner}`;
};

module.exports = {
  computedRockPaperScissorsResult,
}