(function () {
    const startGameButton = document.getElementById('gameStart')

    const sectionOverlay = document.querySelector('section.overlay')

    function getGamePlayInfo() {
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