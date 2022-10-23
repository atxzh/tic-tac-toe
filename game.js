const createPlayers = function (name, colorValue, firstPlay, gameMode) {
    const playerName = name.length < 1 ?
        firstPlay ?
            gameMode == 'pvb' ?
                'Bot' : 'Player X' :
            gameMode == 'pvb' ?
                'Bot' : 'Player O' :
        name;

    const hexToRGB = function (hex) {
        const rgbResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

        return [parseInt(rgbResult[1], 16), parseInt(rgbResult[2], 16), parseInt(rgbResult[3], 16)].toString()

    };

    const playerColor = hexToRGB(colorValue)

    const playerClassChoice = firstPlay ?
        playerName == 'Bot' ?
            'o-play' : 'x-play' :
        playerName == 'Bot' ?
            'x-play' : 'o-play'

    const playerType = playerName == 'Bot' ? 'Bot' : 'Person'

    return { playerName, playerColor, playerClassChoice, playerType }
}

const startGameEvent = function (playerInfo, turnIndicator) {

    let classListNames = [playerInfo[0].playerClassChoice, playerInfo[1].playerClassChoice];

    getActiveGrid()

    const selectionOverlay = document.querySelector('section.overlay-selection');

    selectionOverlay.classList.add('hidden');

    let colorValue = ['--color-o', '--color-x'];

    const updatePlayerTurn = function updatePlayerTurn(event) {

        // Add ClassList to current Event Element
        event.currentTarget.classList.add(classListNames[0])

        document.documentElement.style.setProperty('--main-play', `var(${[colorValue[0]]})`)

        // Remove all Event Listener
        document.querySelectorAll('main.grid-smallSquare:not(.x-play, .o-play)').forEach(smallSquare => {
            smallSquare.removeEventListener('click', updatePlayerTurn)
        })

        // Check Game Win for Current Player
        let checkOnGame = gameCheckOnGrids(event.currentTarget.parentElement, classListNames[0])

        // Run only if a function exists
        if (typeof checkOnGame == 'function')
            var gameStatus = checkOnGame()

        if (gameStatus?.state) {
            // TODO Stop Here
            // End Game
            const winPlayerName = playerInfo.find(player =>
                player.playerClassChoice == gameStatus.result)

            console.log(winPlayerName)

            const replayGameButton = document.getElementById('gameReplay');

            const gameWinDisplay = displayGameResult(gameStatus.result, winPlayerName, turnIndicator)

            return replayGameButton.addEventListener('click', (e) =>
                restartGame.call(e, selectionOverlay, null, gameWinDisplay)
            )
        }

        // Create Listeners for smallSquare in Active Grid
        let activeGrids = getActiveGrid(event.currentTarget)

        if (activeGrids.length > 1) {
            activeGrids.forEach(activeGrid =>
                activeGrid.querySelectorAll('.grid-smallSquare:not(.x-play, .o-play)').forEach(smallGrid =>
                    smallGrid.addEventListener('click', updatePlayerTurn, { once: true })
                )
            )
        } else {
            activeGrids = activeGrids[0] || activeGrids

            activeGrids.querySelectorAll('.grid-smallSquare:not(.x-play, .o-play)').forEach(smallGrid =>
                smallGrid.addEventListener('click', updatePlayerTurn, { once: true })
            )
        }

        // Alternate Values
        classListNames = [classListNames[1], classListNames[0]]
        colorValue = [colorValue[1], colorValue[0]]
        turnIndicator.forEach(indicator => indicator.classList.toggle('active'))

        // console.log(event.currentTarget.classList[1])
    }

    // Adding Event Listener to each square
    document.querySelectorAll('main.grid-smallSquare').forEach(smallSquare => {
        smallSquare.addEventListener('click', updatePlayerTurn, { once: true });
    })

    const restartGameButton = document.getElementById('gameRestart');

    restartGameButton.addEventListener('click', (e) =>
        restartGame.call(e, selectionOverlay, turnIndicator)
    )

};

const getActiveGrid = function (gridPos = null) {

    const gridBigSquares = Array.from(document.querySelectorAll('main.grid.grid-bigSquare:not(.x-play, .o-play, .draw)'));

    if (!gridPos) {
        gridBigSquares.forEach(bigSquare => bigSquare.classList.add('active'))

        return false
    }

    gridBigSquares.forEach(bigSquare => bigSquare.classList.remove('active'))

    // console.log(gridPos.classList[1])

    const makeActiveSquare = document.querySelector(`main.grid.grid-bigSquare.${gridPos.classList[1]}:not(.x-play, .o-play, .draw)`)

    // console.log(makeActiveSquare)

    if (gridBigSquares.includes(makeActiveSquare)) {

        makeActiveSquare.classList.add('active')

        return makeActiveSquare

    } else {
        gridBigSquares.forEach(bigSquare => bigSquare.classList.add('active'))

        return gridBigSquares
    }

};

const restartGame = function (sectionOverlay, turnIndicator, gameWinDisplay) {

    // document.querySelector('main.grid-win').classList.add('hidden')
    if (this.currentTarget.id == `gameReplay`) {
        gameWinDisplay.classList.add('hidden')
        gameWinDisplay.parentElement.classList.add('hidden')
    }
    else
        turnIndicator.forEach(turn => turn.classList.remove('active'))

    let squares = document.querySelectorAll('.grid-bigSquare:is(.x-play, .o-play, .draw, .active), .grid-smallSquare:is(.x-play, .o-play)');

    squares.forEach(square => square.classList.remove('x-play', 'o-play', 'draw', 'active'));

    sectionOverlay.classList.remove('hidden');
};

const gameCheckOnGrids = function (currentMainGrid, currentPlayerClass) {

    const allSquares = Array.from(currentMainGrid.querySelectorAll('main.grid-smallSquare'));

    const playerScoredSquares = Array.from(currentMainGrid.querySelectorAll(`main.grid-smallSquare.${currentPlayerClass}`));

    if (playerScoredSquares.length < 3) return false

    let scoredIndexes = [];

    playerScoredSquares.forEach(scoredSquare => {
        scoredIndexes.push(allSquares.findIndex(square => square == scoredSquare))
    })

    const winIndexes = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for (let index of winIndexes) {
        if (index.every(value => scoredIndexes.includes(value))) {
            currentMainGrid.classList.add(currentPlayerClass)
            currentMainGrid.classList.remove('active')

            // console.log('Player with', { currentPlayerClass }, 'won the Grid by', { scoredIndexes })

            // NOTE: Partial Application
            return gameWinCheck.bind(null, winIndexes, currentMainGrid.parentElement, currentPlayerClass)
        }
    }

    // For Game Draw
    if (!(currentMainGrid.querySelectorAll('main.grid-smallSquare:not(.x-play, .o-play)').length > 0)) {
        currentMainGrid.classList.add('draw')
        currentMainGrid.classList.remove('active')

        return false
    }
};

const gameWinCheck = function (winIndexes, gameGrid, currentPlayerClass) {
    const allGrids = Array.from(gameGrid.children)

    const playerScoredGrids = Array.from(gameGrid.querySelectorAll(`.grid-bigSquare.${currentPlayerClass}`))

    if (playerScoredGrids.length < 3)
        return { state: false, result: undefined }

    let scoredIndexes = []

    playerScoredGrids.forEach(scoredGrid => {
        scoredIndexes.push(allGrids.findIndex(grid => grid == scoredGrid))
    })

    for (let index of winIndexes) {
        if (index.every(value => scoredIndexes.includes(value))) {
            return { state: true, result: currentPlayerClass }
        }
    }

    // All Game Draw
    if (!(gameGrid.querySelectorAll('.grid-bigSquare:not(.x-play, .o-play, .draw)').length > 0))
        return { state: true, result: 'draw' }

};

const displayGameResult = function (gameResult, player, turnIndicator) {

    debugger

    const winDisplayGrid = document.querySelector('main.grid-win');

    winDisplayGrid.classList.remove('hidden');

    const resultDisplay = winDisplayGrid.querySelector(`.win-player.${gameResult}`);

    resultDisplay.classList.remove('hidden');

    if (gameResult != 'draw')
        resultDisplay.children[2].textContent = player.playerName

    turnIndicator.forEach(turn => turn.classList.remove('active'));

    document.querySelectorAll('main.grid.grid-bigSquare.active').forEach(activeGrid => activeGrid.classList.remove('active'))

    return resultDisplay
};

(function () {
    const startGameButton = document.getElementById('gameStart');

    function updatePlayerInfo(playerA, playerB) {

        const turnIndicator = document.querySelectorAll('.turn');

        turnIndicator[0].classList.add('active')

        if (playerA.playerClassChoice == 'x-play') {
            turnIndicator[0].lastElementChild.innerText = playerA.playerName;

            turnIndicator[1].lastElementChild.innerText = playerB.playerName;

            document.documentElement.style.setProperty('--color-x', playerA.playerColor);

            document.documentElement.style.setProperty('--color-o', playerB.playerColor);

            return [turnIndicator, [playerA, playerB]]

        } else {

            turnIndicator[0].lastElementChild.innerText = playerB.playerName;

            turnIndicator[1].lastElementChild.innerText = playerA.playerName;

            document.documentElement.style.setProperty('--color-x', playerB.playerColor)

            document.documentElement.style.setProperty('--color-o', playerA.playerColor)

            return [turnIndicator, [playerB, playerA]]

        }

    }

    function getGamePlayInfo() {
        // TODO Change Later
        const gameModeSelect = document.querySelector('input[name="play-type"]:checked') ?? document.querySelectorAll('input[name="play-type"]')[0]

        const gameModeSelection = gameModeSelect.value;

        const infoSection1 = gameModeSelect.nextElementSibling.firstElementChild;

        const infoSection2 = gameModeSelect.nextElementSibling.lastElementChild;

        let playerA = createPlayers(
            infoSection1.firstElementChild.value,
            infoSection1.lastElementChild.firstElementChild.value ?? '#b73f2a',
            infoSection2.lastElementChild.checked ?? true);

        let playerB = createPlayers(
            infoSection2.firstElementChild?.value ?? '', infoSection2.lastElementChild.firstElementChild?.value ?? '#1766b5',
            infoSection2.lastElementChild.checked ?? false,
            gameModeSelection);

        const [turnIndicator, players] = updatePlayerInfo(playerA, playerB);

        startGameEvent(players, turnIndicator);

    }

    startGameButton.addEventListener('click', getGamePlayInfo);

})();
