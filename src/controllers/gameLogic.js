const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const corners = [0, 2, 6, 8];
const cornerGroups = [[0, 8], [2, 6]];
const outerMids = [1, 3, 5, 7];

// onClick to set the player's move
const userMove = ({ value, idx, gameOptions, setGameOptions, setCurrentGameBoard, winner }) => {
    // if already has a value or is computer's turn do not let user make turn
    if (value) return;
    if (gameOptions.computersMove) return;
    if (winner) return;
    setCurrentGameBoard(prev => {
        let copy = { ...prev };
        copy[idx] = gameOptions.playerSym;
        return copy;
    });
    // set to computer's turn
    setGameOptions(prev => ({ ...prev, computersMove: true }));
};

// what moves the computer will make based on the set difficulty
const computerMove = ({ gameOptions, setGameOptions, currentGameBoard, setCurrentGameBoard }) => {
    const allowedMoves = getAllowedMoves(currentGameBoard);
    const randomIndex = getRandomAllowed(allowedMoves);
    const userIndices = getBoardIndices(currentGameBoard, gameOptions.playerSym);
    const stopPlayer = isPlayerAboutToWin(userIndices, allowedMoves);
    let move;
    // no more squares
    if (allowedMoves.length === 0) return;
    // easy
    if (gameOptions.computerDifficulty === 'easy') move = allowedMoves[randomIndex];
    // medium
    else if (gameOptions.computerDifficulty === 'medium') {
        if (!stopPlayer) move = allowedMoves[randomIndex];
        else move = stopPlayer;
        // hard
    } else if (gameOptions.computerDifficulty === 'hard') {
        const compIndices = getBoardIndices(currentGameBoard, gameOptions.computerSym);
        const makeCompWin = isPlayerAboutToWin(compIndices, allowedMoves);
        // second move and player went in a corner
        if (allowedMoves.length === 8 && corners.includes(userIndices[0]) && allowedMoves.includes(4)) move = 4;
        // third move and player went in the center
        else if (allowedMoves.length === 7 && !allowedMoves.includes(4)) move = moveAcross(compIndices, cornerGroups);
        else if (allowedMoves.length === 6 && !allowedMoves.includes(4) && playerHasCorners(userIndices, cornerGroups, outerMids))
            move = playerHasCorners(userIndices, cornerGroups, outerMids);
        // if computer can win
        else if (makeCompWin !== false) move = makeCompWin;
        // if computer cannot win and doesn't have to block player
        else if (stopPlayer !== false) move = stopPlayer;
        else {
            const emptyCorners = corners.filter(x => allowedMoves.includes(x));
            if (emptyCorners.length !== 0) move = getMove(allowedMoves, corners);
            else move = allowedMoves[randomIndex];
        }
    };
    // place move on board
    setCurrentGameBoard(prev => {
        const copy = { ...prev };
        copy[move] = gameOptions.computerSym;
        return copy;
    });
    // set to user's turn
    setGameOptions(prev => ({ ...prev, computersMove: false }))
};

// checking for win on every board change
const checkForWin = (player, currentGameBoard) => {
    const indices = getBoardIndices(currentGameBoard, player);
    // check win combo indices against player and computer's indices
    let winningIndices = [];
    winCombos.forEach((combo) => {
        const filteredArr = indices.filter(x => combo.includes(x));
        if (
            combo.length === filteredArr.length
            &&
            combo.every((val, i) => val === filteredArr[i])
        ) winningIndices.push(...combo)
        return false;
    });
    if (winningIndices.length >= 3) return winningIndices;
    return false;
};

//////// helpers ////////

// get all postions on board that are empty
const getAllowedMoves = (currentGameBoard) => {
    let arr = [];
    Object.values(currentGameBoard).forEach((itm, idx) => {
        if (itm === false) arr.push(idx);
    });
    return arr;
};

// will return the index that is needed to complete the win combo or false if there is not two in a row
// used for winning and blocking player when about to win
const isPlayerAboutToWin = (userIndices, allowedMoves) => {
    let combosToCheck = [];
    let thirdInARow = [];
    // see if user has 2 in a row
    winCombos.forEach((combo) => {
        const userPlacesInARow = userIndices.filter(x => combo.includes(x));
        if (userPlacesInARow.length === 2) {
            combosToCheck.push({ userPlaces: userPlacesInARow, toWin: combo });
        };
    });
    // get the 3rd position if 2 in a row
    combosToCheck.forEach((combo) => {
        thirdInARow.push(Number(combo.toWin.filter(x => !combo.userPlaces.includes(x))));
    });
    // if two in a row and have to block  return 1st block
    const canBlock = thirdInARow.filter(x => allowedMoves.includes(x));
    if (canBlock.length !== 0) return canBlock[0];
    return false;
};

// computer function for returning an index that is needed in a specific case like a corner (random)
const getMove = (allowedMoves, arr) => {
    const allowed = arr.filter(x => allowedMoves.includes(x));
    if (allowed.length === 0) return false;
    const randomIndex = getRandomAllowed(allowed);
    return allowed[randomIndex];
};

// get the indices of the values on the board
const getBoardIndices = (currentGameBoard, playerSym) => {
    let arr = [];
    Object.values(currentGameBoard).forEach((itm, idx) => {
        if (itm === playerSym) arr.push(idx);
    });
    return arr;
};

// get random number of an array length
const getRandomAllowed = (allowedMoves) => {
    return Math.floor(Math.random() * allowedMoves.length);
};

// computer had first turn and player went in the center
const moveAcross = (indices, arrs) => {
    let result;
    arrs.forEach((itm) => {
        if (itm.includes(indices[0])) result = Number(itm.filter(x => !indices.includes(x)));
    });
    return result;
};

// player has across corners return an index of an outer middle square
const playerHasCorners = (indices, arrs, outerMids) => {
    let result = [];
    arrs.forEach((arr) => {
        result.push(arr.every(x => indices.includes(x)));
    });
    if (!result.includes(true)) return false;
    else {
        const randomIndex = getRandomAllowed(outerMids);
        return outerMids[randomIndex];
    }
};

module.exports = {
    userMove,
    computerMove,
    checkForWin
};