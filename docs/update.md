## Basics

1. Setting up a Header, Body and Footer with `header`, `section`, `main` and `footer`

2. Setup Grid of Grids
    - `.grid` containing 9 `.grid.grid-bigSquare`
    - with each `.grid.grid-bigSquare` containing 9 `.grid-smallSquare`

3. Create a [External SVG Icon File Set](../icons.svg) of `defs` / `symbols` - These are called **Sprites**
    - Extract specific icons with `<use>` tag linked with `id` of the `defs`
    - Add all icons to the same file

4. Create Accordion for User Play Selection

## Creating P2P

1. Create a Private Scoped Function for Game Start. Auto-Executed
    - Gets Player Info & Updates
    - Call `startGameEvent()`
    - Call to create Players using `createPlayers()`

2. Create a Factory Functions for creating Players (`createPlayers()`)

3. Created `startGameEvent()` to initiate Grid Activation for Game Play
    - Calls inner Function `updatePlayerTurn` for Each squares in Active Grid collected from `showActiveGrid`
        - `showActiveGrid` gets `gridPos` to return Active Grid of the same Position.