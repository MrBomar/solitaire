Simple Solitare

Purpose: To create a simple random solitare game using only HTML5, CSS, and Javascript.

Design Overview:
    A - The game is organized into "stacks"
        a. Stock Stack
        b. Waste Stack
        c. Spade Stack
        d. Heart Stack
        e. Club Stack
        f. Diamond Stack
        g. 7 Tableau Stacks
    B - All cards will be stored inside of these stacks.
    C - Each stack will have to folowing property.
        a. Cards.
    D - Each stack will have the following method.
        a. legalMove (Will assess the selected card against the rules of the stack, and return a true or false value)
        b. render (Will redraw the stack and the cards held within)
        c. selectCards (Will select the cards within the stack and return an Array with the listed cards)
    E - Each card will have the following properties.
        a. value
        b. suite
    F - Each card will have the following methods.
        a. face (Will return the HTML needed to render the card)
        b. click (Will execute the selectCards function in the parent stack)
