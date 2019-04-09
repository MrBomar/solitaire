//I might change this to a React.js at a later date
//This Nav bar is going to permit the playing of different games in the future.

let games = [];

const currentGame = () => {
    return games[games.length-1];
}

const newSolitaire = (type) => {
    if(games.length>0) currentGame().clearBoard(); //Only clear the board if a game is already created.
    games.push(new Solitaire); //Create a new instance of the the solitare game.
    (type=='random')?currentGame().newGame(currentGame().randomDeck()): //Set up the board with a random deck.
    currentGame().getSolvedDeck(currentGame().newGame);                 //Set up the board with a solved deck.
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
            let moveMenu = new MoveObj(this.element(),{top:0,topUOM:"px",left:0, leftUOM:"px"},false,250,26,false,100,false);
            moveMenu.begin();
            this.open = true;

            //Time the application of the mouseleave eventListener to append after animation is complete.
            this.deActivateTimer = setTimeout(()=>{
                this.element().addEventListener("mouseleave", this.deActivate);
            },250)
        }   
    }
    deActivate(){
        if(this.open){
            let hide = ((window.innerHeight / 100) * 14) * -1;
            let moveMenu = new MoveObj(this.element(),{top:hide,topUOM:"vh",left:0, leftUOM:"px"},false,250,26,false,100,false);
            moveMenu.begin();
            this.open = false
            this.element().removeEventListener("mouseleave", this.deActivate);
        }
    }
    element(){
        return document.getElementsByTagName('nav')[0];
    }
}

let navBar = new MenuBar;

navBar.element().addEventListener("click", function(event){navBar.click(event.target.innerText);});
