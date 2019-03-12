Simple Solitare

Goal: To create a simple random solitare game using only HTML5, CSS, and VanillaJS.

Purpose: To enhance my understanding of working with DOM objects.

Design Overview:

Update: 03/12/2019 --
    It's been a few months since I have updated this reposity, but I havn't stopped making progress. Here are the current changes.
    
        - Play control has been shifted to the solitair.js
        
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
