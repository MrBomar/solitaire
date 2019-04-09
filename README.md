Simple Solitare

Goal: To create a simple random solitare game using only HTML5, CSS, and VanillaJS.

Purpose: To enhance my understanding of working with DOM objects and application flow.

Current Features:
    ** Choice of random or solvable decks
    ** Solvable decks added to server as users win games
    ** Single click card moves
    ** Undo feature gives players unlimited undos

Updates:

Future Planned Updates:
    --Create user accounts with game play data
    --Reinstate Quick Solve feature
    --Save user stats

Update 04/09/2019 @ 16:53 Eastern
    --Added client side save game state, will resume game when player returns.

Update 04/09/2019 @ 15:00 Eastern
    --Added error message when server is unavailable.

Update 04/09/2019 @ 12:43 Eastern
    --Animated celebration routine added when user wins
    --Added function to continue with random deck if user cannot connect to the server.

Update 04/08/2019 @ 22:17 Eastern--
    --Improved navBar style.
    --Moved navBar to bottom of page.

Update 04/08/2019 @ 20:15 Eastern--
    --Added the ability to play with a solved/solvable deck.
    --Used a Promise and XMLHttpRequest for pulling solved decks from server.

Update 04/08/2019 @ 18:17 Eastern--
    --Corrected display problem with Quick Solve button
    --Removed trouble shooting comments.
    --Fixed auto move cycle issue.

Update 04/08/2019 @ 17:58 Eastern --
    --Improved menu bar performance, added mouseleave listener.
    --Added trouble shooting comments.

Update 04/08/2019 @ 16:45 Eastern --
    --Enhanced menu bar activation/deactivation.
    --Corrected card alignment on resize and rotation.
    --Corrected error with bottom of card click detection.
    --Added single click move ability.
    --Solved decks now saved to the server.

Update 4/7/2019 @ 18:30 Eastern --
    --Added a popout menu.
    --Changed the game state to an array and updated functions to handle array of games.
    --Changed the Foundation so that it doesn't auto render.

Update 03/26/2019 @ 12:45 Eastern --
    --Corrected the control buttons sizing and spacing.
    --Corrected the resize function.

Update 03/22/2019 @ 19:03 Eastern --
    --Found a problem with attaching click events to moved DIV elements. Revised the click event and attached
      it to the entire document.
    --Unfortunatly this resets my double click solution, will have to rework it.
    --This solution includes my first ever recursive function.
    --Also added new function to store the shuffled deck within the Game.
    --Added new test function to transmit the shuffled deck to the server upon successfull completion of the deck.

Update 03/14/2019 @ 05:29 Eastern --
    --Added a double click feature, but there is a bug.
    --After clicking the stock, regardless of the delay the talon click is handled as a double click.

Update 03/14/2019 @ 02.04 Eastern --
    --Added auto solve feature

Update 03/13/2019 @ 20:07 Eastern --
    --Redesigned the Undo function to better handle multiple card moves.
    --Indexed each item in the history so that single moves that effect multiple cards are tied tegether.

Update 03/13/2019 @ 18:51 Easterm --
    - Card placement has been corrected, all cards now move to their appropriate places on resize.

Update 03/13/2019 @ 17:56 Eastern --
    - The undo function has been perfected and is working properly, will perform more testing as I continue development.

Update 03/13/2019 @ 16:35 Eastern --
    - The card.flip() has been simplified.

Update: 03/12/2019 --
    It's been a few months since I have updated this repository, but I havn't stopped making progress. Here are the current changes.
    
        - Play control has been shifted to the Game.js
        
        - Animation is now controlled by a seperate class I am calling javAnimate.
        
            - I will continue to develop this frame work to handle my animations moving forward.
            
            - Provides the ability to stack the animations and start/end them at specified intervals easily.
            
            - Also renders moving element on top of all other objects on the page during the move action.
            
        - I am no longer using images on the game instead opting for symbols. Keeps the game light.
        
        - Game logic is working perfectly.
        
        - Added control buttons to enhance game play.
        
        - Added undo function
        
            - This feature is currently not working properly.
            
            - Reworking the game flow and moveCard() so that moves can be stacked and run in reverse.
            
        - Still need to work on positioning of the cards.
        
            - Currently the POS of the cars is set in px, needs to be set to vh or vw.
            
            - Will need to create a function to handle screen rotation.
            
                - This function will need to go through all card objects and adjust the position to vh or vw based on orientation.
                
        - Considering changing the cardFlip()
        
            - Want to change the card's DOM Object to a single render that includes all symbols.
            
            - Adding/Removing a CSS class will alter the card visual
            
                - Hide all symbols
                
                - Change border properties
                
                - Change the background properties.
