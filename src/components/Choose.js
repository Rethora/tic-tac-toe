const {
    playerSymChoice,
    chooseDifficulty,
    resetGame
} = require("../controllers/gameOptions");

const Choose = ({ gameOptions, setGameOptions, setCurrentGameBoard }) => {
    if (!gameOptions.state && !gameOptions.playerSym) {
        return (
            <>
                <h1>Choose what you want to be.</h1>
                <div id="player-choose-btn-group">
                    <button
                        onClick={(e) => playerSymChoice({ e, setGameOptions })}
                        value="X"
                    >
                        X's
                    </button>
                    <button
                        onClick={(e) => playerSymChoice({ e, setGameOptions })}
                        value="O"
                    >
                        O's
                    </button>
                </div>
            </>
        );
    } else if (!gameOptions.state && gameOptions.playerSym) {
        return (
            <>
                <h1>Select difficulty</h1>
                <button
                    onClick={(e) => chooseDifficulty({ e, setGameOptions })}
                    value="easy"
                >
                    easy
                </button>
                <button
                    onClick={(e) => chooseDifficulty({ e, setGameOptions })}
                    value='medium'
                >
                    medium
                </button>
                <button
                    onClick={(e) => chooseDifficulty({ e, setGameOptions })}
                    value="hard"
                >
                    hard
                </button>
            </>
        );
    } else if (gameOptions.state)
        return <button onClick={() => resetGame({ setGameOptions, setCurrentGameBoard })}>reset</button>;
};

export default Choose;
