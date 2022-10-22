## Basics

### UI Look

1. Setting up a Header, Body and Footer with `header`, `section`, `main` and `footer`

2. Setup Grid of Grids
    - `.grid` containing 9 `.grid.grid-bigSquare`
    - with each `.grid.grid-bigSquare` containing 9 `.grid-smallSquare`

3. Create a [External SVG Icon File Set](../icons.svg) of `defs` / `symbols` - These are called **Sprites**
    - Extract specific icons with `<use>` tag linked with `id` of the `defs`
    - Add all icons to the same file

4. Create Accordion for User Play Selection

### Functions

1. Create a Private Scoped Function for Game Start. Auto-Executed
    - Gets Player Info & Updates
    - Call `startGameEvent()`
    - Call to create Players using `createPlayers()`
    - Add Event Listener on Reset Button, calling `restartGame()`

2. Create a Factory Functions for creating Players (`createPlayers()`)

## Game Action

1. Created `startGameEvent()` to initiate Grid Activation for Game Play
    - Calls inner Function `updatePlayerTurn` for Each squares in Active Grid collected from `showActiveGrid`
        - `showActiveGrid` gets `gridPos` to return Active Grid of the same Position.

2. `updatePlayerTurn` also calls below Functions on each play:
    1. `gameCheckOnGrids` check on each Grid Square 
    2. `gameWinCheck` check the whole game

3. Both `gameCheckOnGrids` and `gameWinCheck` Returns False, if the wins are less than 3 (either for square or for Grid)
    - Check only if the player makes a winning move
    - Check Procedure:
        1. Get all Sqaures / Grid Elements
        2. Get Player Scored Ones
        3. Get Indexes of Player Scored Ones from all the Grids
        4. Check by over Winning Index Array (`winIndexes`)
            1. 3 Horizontal Wins
            2. 3 Vertical Wins
            3. 2 Diagonal Wins
        5. Return if Win
        6. Check for Draw, Return Draw
        7. Exits with Undefined

4. `gameCheckOnGrids` returns a binded function of `gameWinCheck`, if the `gameCheckOnGrids` is a win
    - The Function is later run

5. `gameWinCheck` returns `gameStatus` with `{state: true | false, result}`
    - `gameStatus.result` can be:
        - `undefined`
        - `currentPlayerClass`
        - `draw` a string

6. If the `gameStatus.result` is checked with the `playerInfo` and the right `playerInfo.playerName` is sent to `displayGameResult`
    - The `displayGameResult` is returns the `resultDisplay`:
        - `resultDisplay` shows the current gameState: Win by X, Win by O or Draw

7. The result of `displayGameResult` is stored in a variable
    - The stored variable is sent to `restartGame` function. That triggers the game Restart