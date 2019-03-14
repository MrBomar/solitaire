Simple Solitare

Goal: To create a simple random solitare game using only HTML5, CSS, and VanillaJS.

Purpose: To enhance my understanding of working with DOM objects.

Updates:

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
