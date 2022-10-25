const botPlay = (function () {

    const _checkOnDifficulty = function () { return true }

    const _aiBotPlay = (function () {

        const _getBoard = function (choosenGrid, index) {

            let pos = ['topLeft', 'topCenter', 'topRight', 'midLeft', 'midCenter', 'midRight', 'botLeft', 'botCenter', 'botRight']

            let board = Array.from(choosenGrid.children)
                .map(square =>
                    Array.from(square.classList)
                        .find(classList => classList.includes('-play')
                        ))
                .map(function (square, squareIndex) {
                    if (square == undefined)
                        return [pos[squareIndex], squareIndex]
                    else
                        return [pos[squareIndex], square]
                })

            if (index)
                _aiBotPlay.board[index] = board

            return board

        }

        return {
            isTerminal: function (board, playClass = this.botClass) {

                if (!Array.isArray(board))
                    board = _getBoard(board)

                let classIndex = []

                board.forEach((squareInfo, index) => {
                    if (squareInfo[1] == playClass)
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

                let availableSquares = board.filter(squareInfo => typeof squareInfo[1] == 'number')

                return { isAvailable: Boolean(availableSquares.length), availableIndex: availableSquares }

            },

            miniMaxPlay: function (choosenGrid, depth = 10, currentClass = this.botClass) {

                const index = Array.from(document.querySelectorAll('.grid-bigSquare')).findIndex(grid => grid.classList[1] == choosenGrid.classList[1])

                let board = _getBoard(choosenGrid, index)

                // debugger

                allboards = []

                let availableIndexToPlay = this.getAvailableSquares(board).availableIndex

                let mainWin = this.isTerminal(board, currentClass)
                let oppWin = this.isTerminal(board, currentClass == 'x-play' ? 'o-play' : 'x-play')

                if (mainWin)
                    return { score: 100 }
                else if (oppWin)
                    return { score: -100 }
                else if (availableIndexToPlay.length == 0)
                    return { score: 0 }
                else if (depth == 0)
                    return { score: -50 }

                let allTestPlayInfos = [];

                for (let i = 0; i < availableIndexToPlay.length; i++) {

                    const currentTestPlayInfo = {};

                    currentTestPlayInfo.pos = availableIndexToPlay[i][0]
                    currentTestPlayInfo.index = availableIndexToPlay[i][1]

                    board[availableIndexToPlay[i][1]][1] = currentClass

                    let new_board = Array.from(document.querySelector('main.grid').children)
                        .find(grid => grid.classList.contains(availableIndexToPlay[i][0])
                        )

                    if (new_board.classList.contains('x-play') &&
                        new_board.classList.contains('o-play') &&
                        new_board.classList.contains('draw')
                    ) {
                        const available_boards = document.querySelectorAll('main.grid-bigSquare:not(x-play, o-play, draw)')
                        new_board = available_boards[Math.floor(Math.random() * available_boards.length - 1)]
                    }

                    debugger
                    // console.log(board)

                    if (currentClass == this.botClass) {
                        var result = this.miniMaxPlay(new_board, depth - 1, this.oppClass)

                        currentTestPlayInfo.score = result.score

                    } else {
                        var result = this.miniMaxPlay(new_board, depth - 1)

                        debugger

                        currentTestPlayInfo.score = result.score
                    }

                    // debugger

                    board[i][1] = currentTestPlayInfo.index

                    allTestPlayInfos.push(currentTestPlayInfo)

                    // debugger

                }


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