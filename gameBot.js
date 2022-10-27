const botPlay = (function () {

    const _checkOnDifficulty = function () { return true }

    const _aiBotPlay = (function () {

        const _getBoard = function (choosenGrid) {

            return Array.from(choosenGrid.children)
                .map(square =>
                    Array.from(square.classList)
                        .find(classList => classList.includes('-play')
                        ))
                .map(function (square, squareIndex) {
                    if (square == undefined)
                        return squareIndex
                    else
                        return square
                })

        }

        return {
            isTerminal: function (board, playClass = this.botClass) {

                if (!Array.isArray(board))
                    board = _getBoard(board)

                let classIndex = []

                board.forEach((square, index) => {
                    if (square == playClass)
                        classIndex.push(index)
                })

                for (let index of this.winIndexes) {
                    if (index.every(value => classIndex.includes(value))) {
                        return true
                    }
                }

                return false

            },

            getAvailableSquares: function (board) {

                if (!Array.isArray(board))
                    board = _getBoard(board)

                let availableSquares = board.filter(square => typeof square == 'number')

                return { isAvailable: Boolean(availableSquares.length), availableIndex: availableSquares }

            },

            miniMaxPlay: function (board, depth = 5, currentClass = this.botClass) {

                let availableIndexToPlay = this.getAvailableSquares(board).availableIndex


                let mainWin = this.isTerminal(board, currentClass)
                let oppWin = this.isTerminal(board, currentClass == 'x-play' ? 'o-play' : 'x-play')

                if (mainWin)
                    return { score: 100 }
                else if (oppWin)
                    return { score: -100 }
                else if (availableIndexToPlay.length == 0 || depth == 0)
                    return { score: 0 }

                let allTestPlayInfos = [];

                // debugger

                for (let i = 0; i < availableIndexToPlay.length; i++) {

                    const currentTestPlayInfo = {};

                    currentTestPlayInfo.index = availableIndexToPlay[i]

                    board[availableIndexToPlay[i]] = currentClass

                    // console.log(board)

                    if (currentClass == this.botClass) {
                        var result = this.miniMaxPlay(board, depth - 1, this.oppClass)

                        currentTestPlayInfo.score = result.score

                    } else {
                        var result = this.miniMaxPlay(board, depth - 1)

                        currentTestPlayInfo.score = result.score
                    }

                    board[availableIndexToPlay[i]] = currentTestPlayInfo.index

                    allTestPlayInfos.push(currentTestPlayInfo)

                }

                // debugger

                let bestTestPlay = null;

                if (currentClass === this.botClass) {
                    let bestScore = -Infinity;
                    for (let i = 0; i < allTestPlayInfos.length; i++) {
                        if (allTestPlayInfos[i].score > bestScore) {
                            bestScore = allTestPlayInfos[i].score;
                            bestTestPlay = i;
                        }
                    }
                } else {
                    let bestScore = Infinity;
                    for (let i = 0; i < allTestPlayInfos.length; i++) {
                        if (allTestPlayInfos[i].score < bestScore) {
                            bestScore = allTestPlayInfos[i].score;
                            bestTestPlay = i;
                        }
                    }
                }
                // console.log(allTestPlayInfos)

                return allTestPlayInfos[bestTestPlay];

            },

            botDecision: function (currentActiveGrid, botClass, winIndexes) {

                this.botClass = botClass
                this.oppClass = botClass == 'x-play' ? 'o-play' : 'x-play'
                this.winIndexes = winIndexes

                let choosenGrid = currentActiveGrid

                if (currentActiveGrid.length > 1) {

                    choosenGrid = currentActiveGrid[Math.floor(Math.random() * currentActiveGrid.length)]

                    var choosenSquare = choosenGrid.children[this.miniMaxPlay(_getBoard(choosenGrid)).index]

                } else {

                    choosenGrid = currentActiveGrid[0]

                    var choosenSquare = choosenGrid.children[this.miniMaxPlay(_getBoard(choosenGrid)).index]

                }

                return [choosenSquare, choosenGrid]
            }
        }

    })();

    const _randomBotPlay = function (currentActiveGrid) {

        let choosenGrid = currentActiveGrid;

        if (currentActiveGrid.length > 1) {

            choosenGrid = currentActiveGrid[Math.floor(Math.random() * currentActiveGrid.length)]

            const squareOnChoosen = choosenGrid.querySelectorAll('.grid-smallSquare:not(.x-play, .o-play)')

            var choosenSquare = squareOnChoosen[Math.floor(Math.random() * squareOnChoosen.length)]

        } else {

            const squareOnChoosen = currentActiveGrid.querySelectorAll('.grid-smallSquare:not(.x-play, .o-play)')

            var choosenSquare = squareOnChoosen[Math.floor(Math.random() * squareOnChoosen.length)]

        }

        return [choosenSquare, choosenGrid]
    }

    return {
        updateBotTurn: function (botClass, currentActiveGrid, winIndexes) {

            let choosenGrid, choosenSquare

            if (_checkOnDifficulty())
                [choosenSquare, choosenGrid] = _aiBotPlay.botDecision(currentActiveGrid, botClass, winIndexes)
            else {
                [choosenSquare, choosenGrid] = _randomBotPlay(currentActiveGrid)
            }

            choosenSquare.classList.add(botClass)

            startGame.setLastActiveSquare(choosenSquare)

            if (startGame.gameCheckAfterEvent(
                choosenGrid ?? currentActiveGrid, botClass
            ))
                return true

            startGame.alternateValues()

            startGame.createListenersOnActive(choosenSquare)

        }
    }
})();