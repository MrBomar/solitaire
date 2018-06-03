//Written by Leslie C. Bomar contact: mrlesbomar@gmail.com
const suite = (suite) => {
	switch(suite.substring(0,1)){
		case "S":
			return "♠";
		case "C":
			return "♣";
		case "H":
			return "♥";
		case "D":
			return "♦";
	}
}

const value = (name) => {
    let x = Number(name.substring(1,3));
    switch(x){
        case 1:
            return "A";
        case 11:
            return "J";
        case 12:
            return "Q";
        case 13:
            return "K";
        default:
            return x;
    }
}

const color = (name) => {
    switch(String(name).substring(0,1)){
        case "S":
        case "C":
            return "black";
        case "H":
        case "D":
            return "red";
    }
}

class Card{
    static cardFace(name, index, offset){
        let htmlDOM = document.createElement("div");
        htmlDOM.id = name;
        htmlDOM.classList.add("playingCard");
        htmlDOM.innerHTML = `<h6 class="playingCardLeftSymbol">${value(name)}</h6><h5 class="playingCardMidSymbol">${suite(name)}</h5><h6 class="playingCardRightSymbol">${value(name)}</h6>`;
        htmlDOM.zindex = `${index}`;
        htmlDOM.style.color = color(name);
        if(offset != 0) {htmlDOM.style.top = `${offset}vh`;}
        return htmlDOM;
    }
    static cardBack(name, index, offset){
        let htmlDOM = document.createElement("div");
        htmlDOM.id = name;
        htmlDOM.classList.add("playingCard");
        htmlDOM.classList.add("crosshatch");
        htmlDOM.zindex = `${index}`;
        if(offset != 0) {htmlDOM.style.top = `${offset}vh`;}
        return htmlDOM;
    }
    static moveCardToCard(fromCard, toCard){
        fromParent = eval(fromCard.parentNode.id);
        toParent = eval(toCard.parentNode.id);
        fromParent.removeCard(fromCard);
        toParent.addCard(fromCard);
    }
    static moveCardToStack(fromCard, toStack){
        let toParent = eval(toStack.id);
        let cardParent = eval(fromCard.parentNode.id);
        toParent.addCard(fromCard.id,"front");
        cardParent.removeCard(fromCard);
        cardParent.refresh();
        toParent.refresh();
    }
    static selectCard(myCard){
        selected.push(myCard);
        selected.forEach(thisCard => {thisCard.classList.add("selected")});
        selectedParent = myCard.parentNode;
    }
    static deselectCards(){
        selected.forEach(myCard => {myCard.classList.remove("selected")});
        selected = [];
    }
    static upSide(myCard){
        return (document.getElementById(myCard.id).classList.contains("crosshatch"))?"back":"face";
    }
    static setClick(name){
        document.getElementById(name).addEventListener("click", () => {
            let card1 = document.getElementById(name);
            let card1Parent = eval(card1.parentNode.id);
            card1Parent.cardClick(card1, card1Parent);
        })
    }
}

class Stack{
    constructor(name, initial){
        this._name = name;
        this._element = document.getElementById(name);
        this._initial = initial;
    }
    // topCard() { 
    //     return this._element.lastChild;
    // }
    // allCards() {
    //     return this._element.childNodes;
    // }
    // bottomCard() {
    //     return this._element.firstChild;
    // }
    // cardCount() {
    //     return this._element.childElementCount;
    // }
    removeTopCard() {
        this._element.removeChild(this.topCard());
    }
    removeBottomCard() {
        this._element.removeChild(this.bottomCard());
    }
    addCard(name,side){
        if(side === "front"){
            this._element.appendChild(Card.cardFace(name, this.cardCount(),0));
        }else{
            this._element.appendChild(Card.cardBack(name, this.cardCount(),0));
        }
        Card.setClick(name);
    }
    removeCard(myCard){
        this._element.removeChild(myCard);
    }
    reset(){
        if(this.cardCount() > 0){
            while(this._element.firstChild){
                this._element.removeChild(this._element.firstChild);
            }
        }
    }
    findCard(myCard){
        let cardArray = Array.from(this._element.children);
        for (let i = 0; i < cardArray.length; i++) {
            if(cardArray[i].id == myCard.id){
                return i;
            }
            
        }
    }
}

class DeckStack extends Stack{
    constructor(name, initial){
        super(name,initial);
    }
    reset() {
        //Remove any exsisting cards
        while(this._element.firstChild){
            this._element.removeChild(this._element.firstChild);
        }
        //Shuffle the deck
        let shuffle = randomizeArray(["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","S11","S12","S13",
        "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C13",
        "H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","H11","H12","H13",
        "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D13"]);
        shuffle.forEach(card => {
            this.addCard(card,"back");
        })
        this.refresh();
    }
    cardClick(myCard){
        let card1 = this.topCard();
        this.removeTopCard();
        draw.addCard(card1.id,"front");
        selected = [];
        selectedParent = null;
        this.refresh();
        draw.refresh();
    }
    stackClick(){
        while(draw.cardCount() > 0){
            this.addCard(draw.topCard().id,"back");
            draw.removeTopCard();
            draw.refresh();
            this.refresh();
        }
    }
    refresh(){
        (this.cardCount() == 0)?myEventHandler(this._element, this, true):myEventHandler(this._element, this, false);
    }
}

class LowerStack extends Stack{
    constructor(name,initial){
        super(name,initial);
        this.faceDownOffSet = 1;
        this.faceUpOffSet = 3;
    }
    addCard(name,side){
        if(side === "front"){
            let myOffset = Number(this.faceUpOffSet * this.cardCount());
            this._element.appendChild(Card.cardFace(name,this.cardCount(),myOffset));
        }else{
            let myOffset = this.faceUpOffSet * this.cardCount();
            this._element.appendChild(Card.cardBack(name,this.cardCount(),myOffset));
        }
    }
    cardClick(myCard, myParent){
        if(selected.length > 0){
            //attempt to move selected cards to clicked stack
            let selectedColor = color(selected[0].id);
            let selectedValue = Number(selected[0].id.substring(1,3));
            let thisCardColor = color(myCard.id);
            let thisCardValue = Number(myCard.id.substring(1,3));
            if((selectedColor != thisCardColor) && (selectedValue === (thisCardValue - 1))){
                selected.forEach(a => {
                    Card.moveCardToStack(a, myCard.parentNode);
                })
            }
        } else {
            //select multiple cards
            let myCardIndex = this.findCard(myCard); //find the index of the clicked card
            let allMyCards = Array.from(this.allCards()); //create new array from all the parent's child nodes
            let myCards = allMyCards.slice(myCardIndex, this.cardCount()); //create new array with only selected cards.
            myCards.forEach(singleCard => { 
                Card.selectCard(singleCard); //select each card in the new array.
            })
        }
    }
    refresh(){
        if(this.cardCount() > 0){
            if(Card.upSide(this.topCard()) == "back"){
                let myCard = this.topCard().id;
                this.removeCard(this.topCard());
                this.addCard(myCard, "front");
            }
        }
        (this.cardCount() == 0)?myEventHandler(this._element, this, true):myEventHandler(this._element, this, false);
    }
    stackClick(){
        //action taken when empty stack is clicked.
        console.log(this.id, "Stack Click");
    }
}

class DrawStack extends Stack {
    constructor(name, initial){
        super(name,initial);
    }
    cardClick(myCard){
        Card.selectCard(myCard);
    }
    refresh(){
        (this.cardCount() == 0)?myEventHandler(this._element, this, true):myEventHandler(this._element, this, false);
    }
    stackClick(){
        //Action taken when empty stack is clicked
        console.log(this);
    }
}

class SuiteStack extends Stack {
    constructor(name, initial, suite){
        super(name,initial);
        this.suite = suite;
    }
    cardClick(myCard) {
        console.log(myCard);
        if(selected.length == 0){
            Card.selectCard(myCard);
        } else if(selected.length > 1){
            Card.deselectCards();
        } else {
            let topCardValue = topCard().substring(1,3);
            let selectedCardValue = myCard.substring(1,3);
            let selectedCardSuite = suite(myCard);
            if((selectedCardValue == (topCardValue + 1)) && (selectedCardSuite == this.suite)){
                Card.moveCardToStack(myCard, this._element);
            }
            Card.deselectCards();
        }
    }
    refresh(){
        if(this.cardCount() > 0) {Card.setClick(this.topCard());};
        (this.cardCount() == 0)?myEventHandler(this._element, this, true):myEventHandler(this._element, this, false);
    }
    stackClick(){
        if(selected.length == 1) {
            if((value(selected[0].id) == "A") && (suite(selected[0].id) == this.suite)) {
                Card.moveCardToStack(selected[0], this._element);
            }
        }
        eval(selectedParent.id).refresh();
        Card.deselectCards();
    }
}

//Globals
const deck = new DeckStack("deck",0);
const draw = new DrawStack("draw",0);
const clubs = new SuiteStack("clubs", 0, suite("C1"));
const spades = new SuiteStack("spades", 0, suite("S1"));
const hearts = new SuiteStack("hearts", 0, suite("H1"));
const diamonds = new SuiteStack("diamonds", 0, suite("D1"));
const stack1 = new LowerStack("stack1", 0);
const stack2 = new LowerStack("stack2", 1);
const stack3 = new LowerStack("stack3", 2);
const stack4 = new LowerStack("stack4", 3);
const stack5 = new LowerStack("stack5", 4);
const stack6 = new LowerStack("stack6", 5);
const stack7 = new LowerStack("stack7", 6);
let selected = [];
let selectedParent = null;

const resetGame = () => {
    let allStacks = [deck,draw,clubs,spades,hearts,diamonds,stack1,stack2,stack3,stack4,stack5,stack6,stack7];
    let lowerStacks = [stack1,stack2,stack3,stack4,stack5,stack6,stack7];
    allStacks.forEach(stack => stack.reset());
    currentSelected = "";
    //deal face down cards
    lowerStacks.forEach(stack => {
        while(stack.cardCount() < stack._initial){
            let currentCard = deck.topCard().id;
            stack.addCard(currentCard,"back");
            deck.removeTopCard();
        }
    })
    //deal face up cards
    lowerStacks.forEach(stack =>{
        let currentCard = deck.topCard().id;
        stack.addCard(currentCard,"front");
        deck.removeTopCard();
        Card.setClick(currentCard);
    })
    allStacks.forEach(stack => stack.refresh());
}

const randomizeArray = (array) =>{
	let oldArray = array.slice();
	let newArray = [];
	do {
		let i = Math.floor(Math.random()*oldArray.length);
		newArray.push(oldArray[i]);
		oldArray.splice(i,1);
	} while (oldArray.length > 0);
	return newArray;
}

const myEventHandler = (myElement, myClass, add) => {
    if(add){
        myElement.addEventListener("click", () => myClass.stackClick());
    } else {
        myElement.removeEventListener("click", () => myClass.stackClick());
    }
}