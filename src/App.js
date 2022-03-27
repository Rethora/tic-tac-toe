import { useEffect, useState } from "react";

import Choose from "./components/Choose";
import Board from "./components/Board";

import "./App.css";
import 'semantic-ui-css/semantic.min.css';

const { options, defaultBoard } = require("./controllers/gameOptions");
const { computerMove, checkForWin } = require('./controllers/gameLogic');

const App = () => {
	const [gameOptions, setGameOptions] = useState(options);
	const [currentGameBoard, setCurrentGameBoard] = useState(defaultBoard);
	const [winner, setWinner] = useState(false);
	const [highlight, setHighlight] = useState([]);

	useEffect(() => {
		if (gameOptions.state) {
			const gameBoardMap = Object.values(currentGameBoard);
			const playerWins = checkForWin(gameOptions.playerSym, currentGameBoard);
			const compWins = checkForWin(gameOptions.computerSym, currentGameBoard);

			// check for a winner on every board change
			if (playerWins) {
				setWinner('You win!')
				setHighlight(playerWins);
			} else if (compWins) {
				setWinner('You lose!');
				setHighlight(compWins);
			} else if (!gameBoardMap.includes(false)) setWinner('Draw!');
		}
	}, [gameOptions, currentGameBoard]);

	useEffect(() => {
		if (gameOptions.state && gameOptions.computersMove && !winner) {
			const timer = setTimeout(() => {
				computerMove({ gameOptions, setGameOptions, currentGameBoard, setCurrentGameBoard })
			}, 1500);
			return () => clearTimeout(timer);
		}
	}, [gameOptions, currentGameBoard, winner])


	// if winner or draw add points accordingly and reset board
	useEffect(() => {
		if (winner) {
			if (winner === 'You win!') setGameOptions(prev => ({ ...prev, playerScore: prev.playerScore++ }));
			else if (winner === 'You lose!') setGameOptions(prev => ({ ...prev, computerScore: prev.computerScore++ }));
			setTimeout(() => {
				setWinner(false);
				setCurrentGameBoard(defaultBoard);
				setHighlight([]);
			}, 4000);
		}
	}, [winner])

	return (
		<div className="App">
			{
				!gameOptions.state ? null : (
					<>
						<h2>Player: {gameOptions.playerScore} | Computer: {gameOptions.computerScore}</h2>
						{
							!winner ? (
								!gameOptions.computersMove ? <h4>Your turn</h4> : <h4>Computer's turn</h4>
							) : <h4>{winner}</h4>
						}
						<Board
							gameOptions={gameOptions}
							setGameOptions={setGameOptions}
							currentGameBoard={currentGameBoard}
							setCurrentGameBoard={setCurrentGameBoard}
							winner={winner}
							highlight={highlight}
						/>
					</>
				)
			}
			<Choose
				gameOptions={gameOptions}
				setGameOptions={setGameOptions}
				setCurrentGameBoard={setCurrentGameBoard}
			/>
			<br />
		</div>
	);
};

export default App;