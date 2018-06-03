//Written June 2018 by Leslie C. Bomar: contact mrlesbomar@gmail.com

let allCards = ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","S11","S12","S13",
"C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C13",
"H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13",
"D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D13"]

class Stack{
    constructor(name){
        this.name = String(name);
        this.element = document.getElementById(this.name);
        this.topCard = () => this.element.lastChild;
        this.allCards = () => Array.from(this.element.childNodes);
        this.bottomCard = () => this.element.firstChild;
        this.cardCount = () => this.element.childElementCount;
    }
    moveTopCard(toStack, faceUp){
        let clone = this.topCard().cloneNode(); //copy the top card
        let thisCard = new Card(clone); //create new instance of top card
        this.element.removeChild(this.topCard()); //remove top card from stack
        thisCard.display(faceUp); //change the card to face up or down
        toStack.element.appendChild(clone); //add top card to new stack
    }
    refresh(){ 
        (this.cardCount() === 0 )?this.element.onclick = () => this.stackClick():this.element.onclick = "";
    }
    stackClick() {
        console.log("My stack has been clicked!");
    }
}

class DeckStack extends Stack{
    constructor(name){
        super(name);
    }
    refresh(){ //This function sets (1) the index values, (2) the facing, (3) the click function of each card in the stack
        if(deck.cardCount() === 0){
            deck.element.onclick = () => deck.stackClick();
        } else {
            let thisTopCard = new Card(deck.topCard());
            allCards.forEach(myCard => {
                let thisCard = new Card(document.getElementById(myCard));
                if(thisCard.id === thisTopCard.id){
                    thisCard.element.style.display = "block";
                    thisCard.onclick = () => deck.cardClick(cardClick.id);
                } else {
                    thisCard.element.style.display = "none";
                    thisCard.element.onclick = "";
                }
            })
        }
    }
    stackClick() {
        draw.allCards().forEach(card => {
            let myCard = new Card(card.id);
            myCard.moveTopCard(deck,false);
        })
        deck.refresh();
        draw.refresh();
    }
    cardClick(){
        deck.moveTopCard(draw, true);
        deck.refresh();
        draw.refresh();
    }
}

class Card{
    constructor(card){
        this.name = String(card.id);
        this.element = card;
        this.value = Number(this.name.substring(1,3));
        this.color = this._color();
        this.suit = this._suit();
        this.symbol = this._symbol();
    }
    _color(){
        switch(this.name.substring(0,1)){
            case "S": case "C": return "black";
            case "D": case "H": return "red";
        }
    }
    _suit(){
        switch(this.name.substring(0,1)){
            case "S": return "♠";
            case "C": return "♣";
            case "H": return "♥";
            case "D": return "♦";
        }
    }
    _symbol(){
        switch(this.value){
            case 1: return "A";
            case 11: return "J";
            case 12: return "Q";
            case 13: return "K";
            default: return this.value;
        }
    }
    display(faceUp){
        if(faceUp){
            if (this.element.classList.contains("crosshatch")) this.element.classList.remove("crosshatch");
            this.element.innerHTML = `<h6 class="playingCardLeftSymbol">${this.value}</h6><h5 class="playingCardMidSymbol">${this.suit}</h5><h6 class="playingCardRightSymbol">${this.value}</h6>`;
            this.element.style.color = this.color;
        } else {
            if (!this.element.classList.contains("crosshatch")) this.element.classList.add("crosshatch");
            this.element.innerHTML = "";
        }
    }
}

let draw = new Stack("draw", 0);
let deck = new DeckStack("deck", 0);
document.getElementById("drawButton").addEventListener("click", () => {
    deck.moveTopCard(draw, true);
})

const buildHTMLCard = (name, stack) => {
    let htmlDOM = document.createElement("div");
    htmlDOM.id = name;
    htmlDOM.classList.add("playingCard");
    htmlDOM.classList.add("crosshatch");
    htmlDOM.zindex = stack.element.childElementCount;
    stack.element.appendChild(htmlDOM);
}

allCards.forEach(card => {
    buildHTMLCard(card, deck);
})