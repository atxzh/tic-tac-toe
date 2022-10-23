const botPlay = (function () {

    const _checkOnDifficulty = function () { return false }

    return {
        updateBotTurn: function (botClass, currentActiveGrid) {

            if (_checkOnDifficulty())
                var currentCell = _miniMaxBotPlay()

            let squareOnChoosen, choosenSquare

            if (currentActiveGrid.length > 1) {

                var choosenGrid = currentActiveGrid[Math.floor(Math.random() * currentActiveGrid.length)]

                squareOnChoosen = choosenGrid.querySelectorAll('.grid-smallSquare:not(.x-play, .o-play)')

                choosenSquare = squareOnChoosen[Math.floor(Math.random() * squareOnChoosen.length)]

            } else {

                squareOnChoosen = currentActiveGrid.querySelectorAll('.grid-smallSquare:not(.x-play, .o-play)')

                choosenSquare = squareOnChoosen[Math.floor(Math.random() * squareOnChoosen.length)]

            }

            choosenSquare.classList.add(botClass)

            if (startGame.gameCheckAfterEvent(
                choosenGrid ?? currentActiveGrid, botClass
            ))
                return true

            startGame.alternateValues()

            startGame.createListenersOnActive(choosenSquare)

        }
    }
})();