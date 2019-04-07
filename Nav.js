//I might change this to a React.js at a later date
//This Nav bar is going to permit the playing of different games in the future.

let games = [];

const currentGame = () => {
    return games[games.length-1];
}

const newSolitaire = () => {
    if(games.length>0) currentGame().clearBoard(); //Only clear the board if a game is already created.
    games.push(new Solitaire); //Create a new instance of the the solitare game.
    currentGame().newGame(); //Set up the board and deal the cards.
}

class MenuBar {
    constructor(){
        this.open = true;
        this.click = this.click.bind(this);
        this.activate = this.activate.bind(this);
        this.deActivate = this.deActivate.bind(this);
        this.element = this.element.bind(this);
    }
    click(text){
        switch (text) {
            case "New Game":
                newSolitaire();
                this.deActivate();
                break;
            case "Undo":
                currentGame().undo();
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
        }   
    }
    deActivate(){
        if(this.open){
            let hide = ((window.innerHeight / 100) * 14) * -1;
            let moveMenu = new MoveObj(this.element(),{top:hide,topUOM:"vh",left:0, leftUOM:"px"},false,250,26,false,100,false);
            moveMenu.begin();
            this.open = false
        }
    }
    element(){
        return document.getElementsByTagName('nav')[0];
    }
}

let navBar = new MenuBar;

navBar.element().addEventListener("click", function(event){navBar.click(event.target.innerText);});
navBar.element().addEventListener("mouseenter", navBar.activate);
