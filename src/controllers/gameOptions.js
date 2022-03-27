// default game options
const options = {
	state: false,
	playerSym: false,
	computerSym: false,
	computerDifficulty: false,
	computersMove: false,
	playerScore: 0,
	computerScore: 0
};

// default game board
let defaultBoard = {};
Array(9).fill(false).forEach((itm, idx) => defaultBoard[idx] = itm);

// onclick for player to choose X's or O's
const playerSymChoice = ({ e, setGameOptions }) => {
	const playerSym = e.target.value;
	let computerSym;
	if (playerSym === 'X') { computerSym = 'O' } else { computerSym = 'X' }
	setGameOptions((prev) => ({ ...prev, playerSym: playerSym, computerSym: computerSym }));
};

// onclick to choose game difficulty (starts the game)
const chooseDifficulty = ({ e, setGameOptions }) => {
	setGameOptions((prev) => ({
		...prev,
		computerDifficulty: e.target.value,
		computersMove: whoGoesFirst(),
		state: true
	}));
};

// onclick to reset game
const resetGame = ({ setGameOptions, setCurrentGameBoard }) => {
	setGameOptions(options);
	setCurrentGameBoard(defaultBoard);
};

// decide who gets first move
const whoGoesFirst = () => {
	const coinFlip = Math.floor(Math.random() * 2);
	if (coinFlip === 0) { return false } else { return true };
}

module.exports = {
	options,
	defaultBoard,
	playerSymChoice,
	chooseDifficulty,
	resetGame
};
