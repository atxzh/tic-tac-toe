### Some Terminologies

![grid](assets/Screenshot_20221025_201540.png)

**Active Grid**

<br>

![inactive grid](assets/Screenshot_20221025_203902.png)

**Inactive Grid**

<br>

![](assets/Screenshot_20221025_204038.png)

Normal Square

![](assets/Screenshot_20221025_204029.png)

Last Active Square

<br>

**Square** inside the Grid

Last Played Squares have different hue and brightness level

  

* * *

  

### How to Play ?

1.  First Player (Playing **X**) is allowed to Play in any Grid (All Grids are Active)
    
2.  The Player Chooses the Position (Square) to Play on that Grid
    
    *   and the same Position of the Square Choosen (ex: topLeft Square) by First Player is the active Grid (topLeft Grid) on which the second Player Plays
        
    *   Second Player has to play on that Active Grid
        
    *   _example_:
        
        1.  **Player X** Chooses Top Left of a Square in the Center Grid
            
            ![first play](assets/Screenshot_20221025_201908.png)
        2.  Since the Choosen Square is Top Left, the next Active Grid is Top Left
            
            ![second play](assets/Screenshot_20221025_202011.png)
        3.  **Player O** plays the Top Left Grid and Chooses a Square Center
            
        4.  Choosen Square is Center so, Center Grid Becomes Active for **Player X**
            
            ![second play after](assets/Screenshot_20221025_202259.png)
        5.  **Player X** chooses a Square in Center Grid
            
            ![third play](assets/Screenshot_20221025_202324.png)

3.  A Grid is captured by the Player if he wins in that Grid. The same Grid will never become Active Grid.
    
    *   If the same Position of a Square is Played in any Other Grid, the Other Grids Become Active
    *   _example_:
        
        1.  **Player O** wins Top Left Grid
            
        2.  If **Player X** chooses the Top Left Square in an Active Grid, **Player O** will be allowed to play any other Grid
            
            ![](assets/Screenshot_20221025_202617.png)
        3.  **Player O** will be able to play any Grid except the Top Left Grid (or any Grid won or that is draw)
            

4.  A Grid Becomes Draw if there are no Squares to Play
    
    ![Draw](assets/Screenshot_20221025_202828_2.png)

5.  The final Game is won if a Player Wins 3 Grids in the Order of a Normal Tic-Tac-Toe
    
    ![Player Win Game](assets/Screenshot_20221025_203045.png)

* * *

### Rules

1.  Players can only Play in an Active Grid (Dark Border)
    
2.  Players can't play in Grid won before, or that becomes draw
    
    ![Can't Play over Won / Draw Grid](assets/Screenshot_20221025_202828.png)