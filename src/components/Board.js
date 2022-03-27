import { Grid } from 'semantic-ui-react';

const { userMove } = require('../controllers/gameLogic');

const Board = ({ gameOptions, setGameOptions, currentGameBoard, setCurrentGameBoard, winner, highlight }) => (

    <Grid columns={3} className="game-container">
        <Grid.Row>
            {Object.values(currentGameBoard).map((value, idx) => (
                <div
                    key={idx}
                    className={winner && highlight.includes(idx) ? winner === 'You win!' ? 'tic-tac-toe-square highlight-win' : 'tic-tac-toe-square highlight-loss' : 'tic-tac-toe-square'}
                    onClick={() => userMove({ value, idx, gameOptions, setGameOptions, setCurrentGameBoard, winner })}
                >
                    {value || ''}
                </div>
            ))}
        </Grid.Row>
    </Grid>
);

export default Board;
