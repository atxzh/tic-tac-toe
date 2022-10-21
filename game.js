(function () {
    const startGameButton = document.getElementById('gameStart');

    const sectionOverlay = document.querySelector('section.overlay');

    const turnIndicator = document.querySelectorAll('.turn');

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

})();

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
        event.currentTarget.classList.add(classListNames[0])
        event.currentTarget.removeEventListener('click', updatePlayerTurn)

        document.documentElement.style.setProperty('--main-play', `var(${[colorValue[0]]})`)

        // Remove all Event Listener
        document.querySelectorAll('main.grid-smallSquare:not(.x-play):not(.o-play)').forEach(smallSquare => {
            smallSquare.removeEventListener('click', updatePlayerTurn)
        })

        // Alternate Values
        classListNames = [classListNames[1], classListNames[0]]
        colorValue = [colorValue[1], colorValue[0]]
        turnIndicator.forEach(indicator => indicator.classList.toggle('active'))

        // Check for Grid Draw
        const currentMainGrid = event.currentTarget.parentElement

        if (!(currentMainGrid.querySelectorAll('main.grid-smallSquare:not(.x-play):not(.o-play)').length > 0)) {
            currentMainGrid.classList.add('draw')
            currentMainGrid.classList.remove('active')
        }

        // Create Listeners for smallSquare in Active Grid
        activeGrids = getActiveGrid(event.currentTarget)

        if (activeGrids.length > 1) {

            activeGrids.forEach(activeGrid =>
                activeGrid.querySelectorAll('.grid-smallSquare:not(.x-play):not(.o-play)').forEach(smallGrid =>
                    smallGrid.addEventListener('click', updatePlayerTurn, { once: true })
                )
            )

        } else {

            activeGrids.querySelectorAll('.grid-smallSquare:not(.x-play):not(.o-play)').forEach(smallGrid =>
                smallGrid.addEventListener('click', updatePlayerTurn, { once: true })
            )

        }

        // console.log(event.currentTarget.classList[1])
    }

}

const getActiveGrid = function (gridPos = null) {

    const gridBigSquares = Array.from(document.querySelectorAll('main.grid.grid-bigSquare:not(.x-play):not(.o-play):not(.draw)'));

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

}