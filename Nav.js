//This Nav bar is going to permit the playing of different games in the future.

let games = [];

const currentGame = () => {
    return games[games.length-1];
}

const newSolitaire = (type) => {
    if(games.length>0) currentGame().clearBoard();                      //Only clear the board if a game is already created.
    games.push(new Solitaire);                                          //Create a new instance of the the solitare game.
    (type=='random')?currentGame().newGame(currentGame().randomDeck()): //Set up the board with a random deck.
    currentGame().getSolvedDeck();                                      //Set up the board with a solved deck.
}

class MenuBar {
    constructor(){
        this.open = true;
        this.click = this.click.bind(this);
        this.activate = this.activate.bind(this);
        this.deActivate = this.deActivate.bind(this);
        this.element = this.element.bind(this);
        this.deActivateTimer;
        this.element().addEventListener("mouseenter", this.activate);
    }
    click(text){
        switch (text) {
            case "Solvable Game":
                newSolitaire('solvable');
                this.deActivate();
                break;
            case "Random Game":
                newSolitaire('random');
                this.deActivate();
            case "Undo":
                currentGame().undo();
                this.deActivate();
                break;
            default:
                break;
        }
    }
    activate(){
        if(!this.open){
            this.element().style.height = "15vh";
            this.open = true;

            //Time the application of the mouseleave eventListener to append after animation is complete.
            this.deActivateTimer = setTimeout(()=>{
                this.element().addEventListener("mouseleave", this.deActivate);
            },300)
        }   
    }
    deActivate(){
        if(this.open){
            this.element().style.height = "0px";
            this.open = false
            this.element().removeEventListener("mouseleave", this.deActivate);
        }
    }
    element(){
        return document.getElementsByTagName('nav')[0];
    }
}

const possibleActivate = () => {
    let curPos = window.event.pageY;
    let windowH = window.innerHeight;
    let mar = windowH * .98;
    if(curPos > mar)navBar.activate();
}

let navBar = new MenuBar;

document.getElementsByTagName('main')[0].addEventListener('mousemove', possibleActivate);
navBar.element().addEventListener("click", function(event){navBar.click(event.target.innerText);});
