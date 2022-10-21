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

    const playerColor = hexToRGB(colorValue || '#1766b5')

    const playerClassChoice = firstPlay ?
        playerName == 'Bot' ?
            'o-play' : 'x-play' :
        playerName == 'Bot' ?
            'x-play' : 'o-play'

    const playerType = playerName == 'Bot' ? 'Bot' : 'Person'

    return { playerName, playerColor, playerClassChoice, playerType }
}

const startGameEvent = function (classListNames, turnIndicator) {

    let activeGrids = getActiveGrid()

    let colorValue = ['--color-o', '--color-x']

    document.querySelectorAll('main.grid-smallSquare').forEach(smallSquare => {
        smallSquare.addEventListener('click', updatePlayerTurn, { once: true })
    })

    function updatePlayerTurn(event) {

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
        let gameStatus = checkOnGame ? checkOnGame() : false

        if (gameStatus?.state) {
            // TODO Stop Here
            console.log('It\'s a Game Win for', gameStatus.result)
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
            activeGrids[0].querySelectorAll('.grid-smallSquare:not(.x-play, .o-play)').forEach(smallGrid =>
                smallGrid.addEventListener('click', updatePlayerTurn, { once: true })
            )
        }

        // Alternate Values
        classListNames = [classListNames[1], classListNames[0]]
        colorValue = [colorValue[1], colorValue[0]]
        turnIndicator.forEach(indicator => indicator.classList.toggle('active'))

        // console.log(event.currentTarget.classList[1])
    }

};

const getActiveGrid = function (gridPos = null) {

    const gridBigSquares = Array.from(document.querySelectorAll('main.grid.grid-bigSquare:not(.x-play, .o-play, .draw)'));

    if (!gridPos) {
        gridBigSquares.forEach(bigSquare => bigSquare.classList.add('active'))

        return false
    }

    gridBigSquares.forEach(bigSquare => bigSquare.classList.remove('active'))

    // console.log(gridPos.classList[1])

    const makeActiveSquare = document.querySelector(`main.grid.grid-bigSquare.${gridPos.classList[1]}`)

    // console.log(makeActiveSquare)

    if (gridBigSquares.includes(makeActiveSquare)) {

        makeActiveSquare.classList.add('active')

        return makeActiveSquare

    } else {
        gridBigSquares.forEach(bigSquare => bigSquare.classList.add('active'))

        return gridBigSquares
    }

};

const restartGame = function (sectionOverlay, turnIndicator) {

    const grid = document.querySelector('main.grid');
    // TODO Also Add  grid after Win / Loss / Draw

    let squares = document.querySelectorAll('.grid-bigSquare:is(.x-play, .o-play, .draw, .active), .grid-smallSquare:is(.x-play, .o-play)');

    squares.forEach(square => square.classList.remove('x-play', 'o-play', 'draw', 'active'));

    sectionOverlay.style.setProperty('display', 'flex');

    turnIndicator.forEach(turn => turn.classList.remove('active'));

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
    if (!(gameGrid.querySelectorAll(`.grid-bigSquare:not(.x-play, .o-play, .draw)`).length > 0))
        return { state: false, result: 'draw' }

};

(function () {
    const startGameButton = document.getElementById('gameStart');

    const sectionOverlay = document.querySelector('section.overlay');

    const turnIndicator = document.querySelectorAll('.turn');

    const restartGameButton = document.getElementById('gameRestart')

    function updatePlayerInfo(playerA, playerB) {

        turnIndicator[0].lastElementChild.innerText = playerA.playerName;
        turnIndicator[0].classList.add('active')

        document.documentElement.style.setProperty('--color-x', playerA.playerColor)

        turnIndicator[1].lastElementChild.innerText = playerB.playerName;

        document.documentElement.style.setProperty('--color-o', playerB.playerColor)

    }

    function getGamePlayInfo() {
        // TODO Change Later
        const gameModeSelect = document.querySelector('input[name="play-type"]:checked') ?? document.querySelectorAll('input[name="play-type"]')[0]

        const gameModeSelection = gameModeSelect.value

        const infoSection1 = gameModeSelect.nextElementSibling.firstElementChild

        const infoSection2 = gameModeSelect.nextElementSibling.lastElementChild

        let playerA = createPlayers(
            infoSection1.firstElementChild.value,
            infoSection1.lastElementChild.firstElementChild.value ?? '#b73f2a',
            infoSection2.lastElementChild.checked ?? true)

        let playerB = createPlayers(
            infoSection2.firstElementChild?.value ?? '', infoSection2.lastElementChild.firstElementChild?.value,
            infoSection2.lastElementChild.checked ?? false,
            gameModeSelection)

        updatePlayerInfo(playerA, playerB)

        startGameEvent([playerA.playerClassChoice, playerB.playerClassChoice], turnIndicator)

        sectionOverlay.style.setProperty('display', 'none')
    }

    startGameButton.addEventListener('click', getGamePlayInfo)

    restartGameButton.addEventListener('click', restartGame.bind(this, sectionOverlay, turnIndicator))

})();
