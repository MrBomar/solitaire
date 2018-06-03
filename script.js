//Written by Leslie C. Bomar contact: mrlesbomar@gmail.com

const suiteChart = (suite) => {
	switch(suite){
		case "A":
			return "♠";
		case "C":
			return "♣";
		case "H":
			return "♥";
		case "D":
			return "♦";
	}
}

const valueChart = (value) => {
	switch(value){
		case 1:
			return "A";
		case 11:
			return "J";
		case 12:
			return "Q";
		case 13:
			return "K";
		default:
			return value;
	}
}

class Stack{
	constructor(name, initial, offset, direction) {
		this._initial = initial;
		this._offset = offset;
		this._direction = direction;
		this._name = name;
		this._element = document.getElementById(name);
	}

	topCardVar() {
		return eval(this._element.firstChild.id);
	}

	topCardDom() {
		return this._element.firstChild;
	}

	count(){
		return this._element.childElementCount;
	}

	topCardPostion(){
		this.topCard().offset;
	}

	reset(){
		while(this._element.firstChild){
			this._element.removeChild(this._element.firstChild);
		}
	}

	removeCard(name){
		//let children = this._element.childNodes;
		this._element.childNodes.forEach(child => {
			if(name === child.id){
				child.parentNode.removeChild(child);
			}
		})
	}
}

class LaneStack extends Stack{
	constructor(name, initial){
		super(name, initial, 0, "down");
	}

	validMove(thisCard){
		//verify that incoming card is a valid move
		return true;
	}
}

class SuiteStack extends Stack{
	constructor(name){
		super(name, 0, 0, "none");
	}

	validMove(thisCard){
		//verify that incoming card is a valid move
		return true;
	}
}

class DeckStack extends Stack{
	constructor(name){
		super(name, 0, 0, "none");
	}
	reset(){
		//Delete all exsisting cards
		while(this._element.firstChild){
			this._element.removeChild(this._element.firstChild);
		}
		//shuffle cards and build deck
		let newDeck = randomizeArray(fullDeck);
		for (let i = 0; i < newDeck.length; i++) {
			newDeck[i].reset(i);
		}
	}
}

class DrawStack extends Stack{
	constructor(name){
		super(name,0,0,"none");
	}
}

class Card{
	constructor(suite, value) {
		this._name = String(suite) + String(value)
		this.element = document.getElementById(this._name);
		this.face = `<h6 class="playingCardLeftSymbol">${valueChart(value)}</h6><h5 class="playingCardMidSymbol">${suiteChart(suite)}</h5><h6 class="playingCardRightSymbol">${valueChart(value)}</h6>`;
		this.stack = "poop"; //Change This Value
		this.suite = suite;
		this.value = value;
	}
	show() {
		this.element.innerHTML = this.face;
		this.element.style.display = "block";
		this.element.classList.add("playingCard");
	}
	hide(index) {
		this.element.innerHTML = "";
		this.element.style.display = "block";
		this.element.style.zIndex = index;
		this.element.classList.add("playingCard");
		this.element.classList.add("crosshatch");
	}
	move(from, to, validate) {
		(validate)?validate = to.validMove(this):validate=true;
		if(validate){ //validate the move
			from.removeCard(this);
			createDOM(to._name,"div",this._name,["playingCard","crosshatch"],10);
		}
	}
	reset(index){
		let myResult = createDOM("deck","div",this._name,["playingCard","crosshatch"],index);
		this.element = document.getElementById(myResult.id);
	}
}

const A1 = new Card("A", 1);
const A2 = new Card("A", 2);
const A3 = new Card("A", 3);
const A4 = new Card("A", 4);
const A5 = new Card("A", 5);
const A6 = new Card("A", 6);
const A7 = new Card("A", 7);
const A8 = new Card("A", 8);
const A9 = new Card("A", 9);
const A10 = new Card("A", 10);
const A11 = new Card("A", 11);
const A12 = new Card("A", 12);
const A13 = new Card("A", 13);
const C1 = new Card("C", 1);
const C2 = new Card("C", 2);
const C3 = new Card("C", 3);
const C4 = new Card("C", 4);
const C5 = new Card("C", 5);
const C6 = new Card("C", 6);
const C7 = new Card("C", 7);
const C8 = new Card("C", 8);
const C9 = new Card("C", 9);
const C10 = new Card("C", 10);
const C11 = new Card("C", 11);
const C12 = new Card("C", 12);
const C13 = new Card("C", 13);
const H1 = new Card("H", 1);
const H2 = new Card("H", 2);
const H3 = new Card("H", 3);
const H4 = new Card("H", 4);
const H5 = new Card("H", 5);
const H6 = new Card("H", 6);
const H7 = new Card("H", 7);
const H8 = new Card("H", 8);
const H9 = new Card("H", 9);
const H10 = new Card("H", 10);
const H11 = new Card("H", 11);
const H12 = new Card("H", 12);
const H13 = new Card("H", 13);
const D1 = new Card("D", 1);
const D2 = new Card("D", 2);
const D3 = new Card("D", 3);
const D4 = new Card("D", 4);
const D5 = new Card("D", 5);
const D6 = new Card("D", 6);
const D7 = new Card("D", 7);
const D8 = new Card("D", 8);
const D9 = new Card("D", 9);
const D10 = new Card("D", 10);
const D11 = new Card("D", 11);
const D12 = new Card("D", 12);
const D13 = new Card("D", 13);
const deck = new DeckStack("deck");
const draw = new DrawStack("draw");
const aces = new SuiteStack("aces");
const hearts = new SuiteStack("hearts");
const diamonds = new SuiteStack("diamonds");
const spades = new SuiteStack("spades");
const stack1 = new LaneStack("stack1",0);
const stack2 = new LaneStack("stack2",1);
const stack3 = new LaneStack("stack3",2);
const stack4 = new LaneStack("stack4",3);
const stack5 = new LaneStack("stack5",4);
const stack6 = new LaneStack("stack6",5);
const stack7 = new LaneStack("stack7",6);
const allStacks = [deck, draw, aces, hearts, diamonds, spades, stack1,stack2,stack3,stack4,stack5,stack6,stack7];
const bottomStacks = [stack1,stack2,stack3,stack4,stack5,stack6,stack7];
const suiteStacks = [aces,hearts,diamonds,spades];
const fullDeck = [A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13,
	C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12,C13,
	H1,H2,H3,H4,H5,H6,H7,H8,H9,H10,H11,H12,H13,
	D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13];

const newGame = () => {
	allStacks.forEach(stack => stack.reset()); //resets all stack arrays and deals new hand
	bottomStacks.forEach(stack => {
		while(stack.initial > stack.count()){
			deck.topCard().move(deck,stack,false);
		}
	})	
}

const justTheNumbers = (input) => {
	let newString = input.slice();
	let upper = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"];
	let lower = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m"];
	let symbol = ["~","!","@","#","$","%","^","&","/*","_","-","=","|",";",":","<",">",","," "];
	let combine = [].concat(upper,lower,symbol);
	combine.forEach(key => {
		newString = newString.replace(new RegExp(key, 'g'),"");
	})
	return newString;
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

const createDOM = (location,type,id,classList,zIndex) =>{
	let newDOM = document.createElement(type);
	newDOM.id = id;
	classList.forEach(myClass => {
		newDOM.classList.add(myClass);
	})
	newDOM.zIndex = zIndex;
	document.getElementById(location).appendChild(newDOM);
	return newDOM;
}