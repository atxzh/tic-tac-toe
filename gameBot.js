const botPlay = (function () {

    const _checkOnDifficulty = function () { return false }

    const _miniMaxBotPlay = function () {

        return [choosenSquare, choosenGrid]
    }

    const _randomBotPlay = function (currentActiveGrid) {
        let squareOnChoosen, choosenSquare

        if (currentActiveGrid.length > 1) {

            var choosenGrid = currentActiveGrid[Math.floor(Math.random() * currentActiveGrid.length)]

            squareOnChoosen = choosenGrid.querySelectorAll('.grid-smallSquare:not(.x-play, .o-play)')

            choosenSquare = squareOnChoosen[Math.floor(Math.random() * squareOnChoosen.length)]

        } else {

            squareOnChoosen = currentActiveGrid.querySelectorAll('.grid-smallSquare:not(.x-play, .o-play)')

            choosenSquare = squareOnChoosen[Math.floor(Math.random() * squareOnChoosen.length)]

        }

        return [choosenSquare, choosenGrid]
    }

    return {
        updateBotTurn: function (botClass, currentActiveGrid) {

            let choosenGrid, choosenSquare

            if (_checkOnDifficulty())
                [choosenSquare, choosenGrid] = _miniMaxBotPlay(currentActiveGrid)
            else {
                [choosenSquare, choosenGrid] = _randomBotPlay(currentActiveGrid)
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