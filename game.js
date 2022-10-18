(function () {
    const startGameButton = document.getElementById('gameStart')

    function getGamePlayInfo() {
        const gameModeSelect = document.querySelector('input[name="play-type]:checked')

        const gameModeSelection = gameModeSelect.value

        const infoSection1 = gameModeSelection.nextElementSibling.firstElementChild

        const infoSection2 = gameModeSelection.nextElementSibling.lastElementChild

        var playerAChoice = {
            playerName: infoSection1.firstElementChild.value || 'Player A',
            colorValue: hexToRGB(infoSection1.lastElementChild.firstElementChild.value),
            selectClassValue: `x-play`
        }

        if (gameModeSelection.id == 'pvp') {

            var playerBChoice = {
                playerName: infoSection2.firstElementChild.value || 'Player B',
                colorValue: hexToRGB(infoSection2.lastElementChild.firstElementChild.value),
                selectClassValue: `o-play`
            }

        } else {

            var playerBChoice = {
                playerName: 'Bot',
                colorValue: hexToRGB('#1766b5'),
                selectClassValue: `o-play`
            }

            if (!infoSection2.lastElementChild.checked) {
                playerAChoice.selectClassValue = 'o-play'
                playerBChoice.selectClassValue = 'x-play'
            }

        }

    }

    startGameButton.addEventListener('click', getGamePlayInfo)
})();

const hexToRGB = function (hex) {
    const rgbResult = /^#?([a-f/d]{2})([a-f/d]{2})([a-f/d]{2})$/i.exec(hex)

    return [parseInt(rgbResult[0], 16), parseInt(rgbResult[1], 16), parseInt(rgbResult[2], 16)].toString()

}