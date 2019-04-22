import Stock from './Stock';
import Tableau from './Tableau';
import Talon from './Talon';
import Card from  './Card';
import Foundation from './Foundation';
import MoveObj from './javAnimate';

class Solitaire{
    constructor(mobileUser){
        this.mobileUser = mobileUser;
        this.resize = this.resize.bind(this);
        this.suites = [{suite:"spade", symbol:"♠", color: "black"},
                       {suite:"club", symbol:"♣", color: "black"},
                       {suite:"heart", symbol:"♥", color: "red"},
                       {suite:"diamond", symbol:"♦", color:"red"}];
        this.spadeFoundation = new Foundation(this.suites[0], this.mobileUser);
        this.clubFoundation = new Foundation(this.suites[1], this.mobileUser);
        this.heartFoundation = new Foundation(this.suites[2], this.mobileUser);
        this.diamondFoundation = new Foundation(this.suites[3], this.mobileUser);
        this.stock = new Stock("stock");
        this.talon = new Talon("talon");
        this.tableau1 = new Tableau("tableau", 1);
        this.tableau2 = new Tableau("tableau", 2);
        this.tableau3 = new Tableau("tableau", 3);
        this.tableau4 = new Tableau("tableau", 4);
        this.tableau5 = new Tableau("tableau", 5);
        this.tableau6 = new Tableau("tableau", 6);
        this.tableau7 = new Tableau("tableau", 7);
        this.priorClick = [];
        this.allStacks = [this.spadeFoundation, this.clubFoundation, this.heartFoundation, this.diamondFoundation, this.stock, this.talon, this.tableau1, this.tableau2, this.tableau3, this.tableau4, this.tableau5, this.tableau6, this.tableau7];
        this.tableau = [this.tableau1, this.tableau2, this.tableau3, this.tableau4, this.tableau5, this.tableau6, this.tableau7];
        this.foundations = [this.spadeFoundation,this.clubFoundation,this.heartFoundation,this.diamondFoundation];
        this.dealOrder = [];
        this.deal = this.deal.bind(this);
        this.newGame = this.newGame.bind(this);
        this.moveCard = this.moveCard.bind(this);
        this.reStock = this.reStock.bind(this);
        this.clearPriorClick = this.clearPriorClick.bind(this);
        this.findCard = this.findCard.bind(this);
        this.dealEvent; //The variable storing the deal action sequence or Interval
        this.tableauCycle = this.tableauCycle.bind(this);
        this.moveHistory = []; //Stores moves made, part of the undo function
        this.cardMoveID = this.cardMoveID.bind(this);
        this.movePriorClick = this.movePriorClick.bind(this);
        this.talonCycle = this.talonCycle.bind(this);
        this.foundationMatch = this.foundationMatch.bind(this);
        this.storedStock = "";
        this.storeStock = this.storeStock.bind(this);
        this.sendSolvedDeck = this.sendSolvedDeck.bind(this);
        this.undo = this.undo.bind(this);
        this.won = false;
        this.solveTimer;
        this.fireCard = this.fireCard.bind(this);
        this.randomDeck = this.randomDeck.bind(this);
        this.celebrationTimer;
        this.celebrationCards = [];
        this.quickSolve = this.quickSolve.bind(this);
        this.cardClickEvent = this.cardClickEvent.bind(this);
        this.pileClickEvent = this.pileClickEvent.bind(this);
        this.reconstituteDeck = this.reconstituteDeck.bind(this);
    }
    toHex(num){
        return "0123456789ABCDEF".charAt(num)
    }
    toDec(alph){
        return "0123456789ABCDEF".indexOf(alph);
    }
    storeStock(){
        this.stock.cards.forEach(card=>{
            this.storedStock = this.storedStock + `${card.name.charAt(0)}${this.toHex(card.value)}`;
        })
    }
    resize(){
        this.allStacks.forEach(stack=>{
            stack.resize();
        })

    }
    timer(from, to){
        //Calculate the time
        let x = from.offsetTop - to.offsetTop;
        let y = from.offsetLeft - to.offsetLeft;
        let positive = (z) => {return (z<0)?z*-1:z;};
        return (positive(x) > positive(y))?positive(x):positive(y);
    }
    clearBoard(){
        //This function removes all the card elements and the foundation placeholders

        //Cycle through all stacks and remove the card DOM elements.
        this.allStacks.forEach(myStack=>{
            if(myStack.cards.length>0){
                myStack.cards.forEach(myCard=>{
                    myCard.element().parentElement.removeChild(myCard.element());
                })
            }
        })

        try {
        //Cycle through the foundations and remove the DOM elements.
        this.foundations.forEach(foundation=>{
            foundation.element().parentElement.removeChild(foundation.element());
        }) } catch{}

        //Cycle through main children and delete them
        let mainDIV = document.getElementsByTagName("main")[0];
        Array.from(mainDIV.children).forEach(child=>{
            mainDIV.removeChild(child);
        })
    }
    solvableDeck(){
        let returnDeck = this.getSolvedDeck();
    }
    randomDeck(){
        let tempDeck = [];
        this.suites.forEach(suite => {
            [1,2,3,4,5,6,7,8,9,10,11,12,13].forEach(number => {
                tempDeck.push(new Card(suite, number, false, this.mobileUser));
            })
        })

        //Shuffle deck and add return
        return this.randomizeArray(tempDeck)
    }
    newGame(myDeck){
        //Add selected deck to the stock
        myDeck.forEach(item => {
            this.stock.addCard(item);
        })

        //Store the shuffled deck for further use
        this.storeStock();

        //The goal is to deal the cards one at a time
        this.dealOrder = [
            [0,true,this.stock.cards[51]],[1,false,this.stock.cards[50]],[2,false,this.stock.cards[49]],[3,false,this.stock.cards[48]],[4,false,this.stock.cards[47]],[5,false,this.stock.cards[46]],[6,false,this.stock.cards[45]],
            [1,true,this.stock.cards[44]],[2,false,this.stock.cards[43]],[3,false,this.stock.cards[42]],[4,false,this.stock.cards[41]],[5,false,this.stock.cards[40]],[6,false,this.stock.cards[39]],
            [2,true,this.stock.cards[38]],[3,false,this.stock.cards[37]],[4,false,this.stock.cards[36]],[5,false,this.stock.cards[35]],[6,false,this.stock.cards[34]],
            [3,true,this.stock.cards[33]],[4,false,this.stock.cards[32]],[5,false,this.stock.cards[31]],[6,false,this.stock.cards[30]],
            [4,true,this.stock.cards[29]],[5,false,this.stock.cards[28]],[6,false,this.stock.cards[27]],
            [5,true,this.stock.cards[26]],[6,false,this.stock.cards[25]],
            [6,true,this.stock.cards[24]]
        ];

        this.dealEvent = setInterval(this.deal,150);
    }
    moveCard(thisCard, toStack, history, count){
        //We will only handle moving a card in this function, flipping the card must be managed outside this function.
        let origStack = this[thisCard.currentStack()]; //Identifies the card's origin
        if(history){this.moveHistory.push({action:"move",card:thisCard,to:origStack, history:false, ID:count})}; //Stores the move in the history

        //Capture object's target location -- GOOD
        let newPOS = {top: toStack.nextCardPOS().top, topUOM: "px", left: toStack.nextCardPOS().left, leftUOM: "px"};

        //Animate the card movement -- GOOD
        let myCard = new MoveObj(
            thisCard.element(), //The DOM object to be moved
            newPOS,toStack.element(), //The DIV we wish to add the element to
            this.timer(thisCard.element(),toStack.element()), //Adjusting the duration of animation based on distance
            40, //Frames per second
            true, //Keep the element on top of all other elements during animation
            toStack.cards.length, //The final z-index of the DOM object
            thisCard.events); //Array of click events to be reattached to the DOM object
        myCard.begin();

        //Perform the card object movement manually here -- GOOD
        toStack.cards.push(origStack.removeCard(thisCard.name));
    }
    movePriorClick(toPile){
        //Will transfer the priorClick.length to the moveCar()
        //moveCard will store the priorClick.length
        //Undo will then use the priorClick.length to move the correct number of cards
        //Remember to move the bottom card first.
        let fromPile = this[this.priorClick[0].currentStack()];
        let currentID = this.cardMoveID();
        do {
            let myCard = this.priorClick.shift();
            this.moveCard(myCard,toPile,true,currentID);
            if((fromPile instanceof Talon)&&(toPile instanceof Stock)){myCard.flip(true, currentID, this)}
        } while (this.priorClick.length > 0)
        this.clearPriorClick();                                   //Clear the selected cards
        if (fromPile instanceof Tableau){fromPile.topCardFlip(currentID, this)}  //If from Pile is Tableau then flip top Card
        if (toPile instanceof Talon){toPile.topCardFlip(currentID, this)}        //If to Pile is Talon then flip Talon top Card
        this.done(); //Runs code to check for a win.
        if(!this.cardsOnBoard){ //If there are no cards on the board, then we celebrate
            this.celebration();
        }
    }
    cardMoveID(){
        return this.moveHistory.length;
    }
    reStock(){
        this.talon.cards.reverse();
        this.talon.cards.forEach(card=>{this.priorClick.push(card)});
        this.movePriorClick(this.stock);
    }
    cardClickEvent(cardID){
        //Find the card
        let clickedCard = this.findCard(cardID);

        //Capture cards affected by this click
        let selectedStack = this[clickedCard.currentStack()];
        let selectedCards = selectedStack.selectCards(clickedCard);

        if(selectedStack.name == "stock"){                                 //Stock card clicked 
            this.priorClick = [this.stock.topCard()];    //Add the top Stock Card to the priorClick
            this.movePriorClick(this.talon);             //Execute moving of all cards in PriorClick
            return true;
        } else if (this.priorClick.length != 0){                  //All other Pile card clicks if Cards were previously selected
            if(selectedStack.validateMove(this.priorClick[0])){   //If selected cards can be moved to clicked Pile
                this.movePriorClick(selectedStack);               //Execute moving of all cards in PriorClick
                return true;
            } else {                                                       //If selected cards cannot be moved to the clicked pile.
                this.clearPriorClick();                           //Clear the selected cards
            }
        } else {
            //Action taken if no other cards were previously selected.
            this.priorClick = selectedCards;
            this.shade(this.priorClick);
            return this.fireCard(clickedCard);
        }
    }
    pileClickEvent(pileID){
        //Select clicked pile
        let clickedPile = this[pileID];

        if(this.priorClick.length != 0){
            //let fromPile = currentGame().priorClick[0].currentStack();    ***************Unused
            if(clickedPile.validateMove(this.priorClick[0])){
                this.movePriorClick(clickedPile);
            } else {
                //Action taken if the previously selected cards cannot be moved to the clicked stack.
                this.clearPriorClick();
            }
        }

        if(clickedPile.name == "stock"){this.reStock()};
    }
    randomizeArray(myArray){
        let newArray = [];
        do {
            newArray.push(myArray.splice(Math.floor(Math.random() * myArray.length),1)[0]);
        } while (myArray.length > 0);
        return newArray;
    }
    shade(cardArray){
        cardArray.forEach(x =>{
            x.element().classList.add("shade");
        })
    }
    clearPriorClick(){
        Array.from(document.getElementsByClassName("shade")).forEach(item=>{item.classList.remove('shade')});
        this.priorClick = [];
    }
    findCard(cardName){
        //Use this function to find the named card object
        for (let i = 0; i < this.allStacks.length; i++) {
            for (let j = 0; j < this.allStacks[i].cards.length; j++) {
                if(this.allStacks[i].cards[j].name == cardName){
                    return this.allStacks[i].cards[j];
                }
            }
        }
    }
    deal(){
        if(this.dealOrder.length == 0){
            clearInterval(this.dealEvent);
        } else {
            let info = this.dealOrder.shift();
            if(info[1]){info[2].flip(false)}
            this.moveCard(info[2],this.tableau[info[0]],false);
        }
    }
    undo(){
        //The beginning of the Undo event.
        if(this.moveHistory.length > 0){
            let currentID = this.moveHistory[this.moveHistory.length-1].ID;
            let undoMoves = this.moveHistory.filter((move)=>{return move.ID == currentID})
            this.moveHistory.splice(this.moveHistory.length - undoMoves.length,undoMoves.length);
            if(undoMoves[0].to instanceof Talon){undoMoves.reverse()};
            if(undoMoves[undoMoves.length-1].action == "flip"){undoMoves.unshift(undoMoves.pop())};
            undoMoves.forEach(move=>{
                (move.action == "flip")?move.card.flip(move.history):this.moveCard(move.card,move.to,move.history);
            })
        }
    }
    done(){
        let complete = true;
        this.tableau.forEach(tab=>{
            tab.cards.forEach(crd=>{
                if(crd.face==false){
                    complete = false;
                }
            })
        })

        if(complete && !this.won){
            this.won = true;
            this.sendSolvedDeck();

            //Render a solve button
            let solveButton = document.createElement('div');
            solveButton.id = "control";
            solveButton.innerHTML = `<h3 type="button" id="solve" class="solveClick clickable">Quick Solve</h3>`;
            document.getElementsByTagName('main')[0].appendChild(solveButton);
        }

        return complete;
    }
    quickSolve(){
        new Promise((resolve,reject)=>{
            if(true){
                resolve('Good Stuff');
            }
        }).then(
            this.tableauCycle()
        ).then(
            this.talonCycle()
        ).then(
            this.celebration()
        )
    }
    cardsOnBoard(){
        //Return true if card remains in stock, talon, or any tableau.
        let remainingPiles = this.tableau.concat(this.stock).concat(this.talon).filter(pile=>{
            return pile.cards.length > 0;
        });
        return (remainingPiles.length > 0)?true:false;
    }
    fireCard(myCard){
        let selectPiles = (this.priorClick.length === 1)?this.foundations.concat(this.tableau):this.tableau;
        let availablePiles = selectPiles.filter(pile => pile.name != myCard.currentStack().name);
        availablePiles.forEach(pile=>{
            if((pile.validateMove(myCard))&&(this.priorClick.length > 0)){
                this.movePriorClick(pile);
                return true;
            }
        });
    }
    tableauCycle(){
        //Currently Unused - part of quickSolve()
        this.solveTimer = setInterval(()=>{
            let found = false;
            let tableauWithCards = this.tableau.filter(tab=>tab.cards.length > 0);
            if(tableauWithCards.length > 0){
                tableauWithCards.forEach(tableau=>{
                    let topCard = tableau.topCard();
                    if(this.foundationMatch(topCard).validateMove(topCard)){
                        topCard.element().click();
                        found = true;
                    }
                })
            }
            //if(found)this.tableauCycle();
            if(!found)clearInterval(this.solveTimer);
        },250)
    }
    talonCycle(){
        //Currently Unused - part of quickSolve()
        this.solveTimer = setInterval(()=>{
            if(this.talon.cards.length > 0){
                if(this.foundationMatch(this.talon.topCard()).validateMove(this.talon.topCard())){
                    //Click card & exit
                    this.talon.topCard().element().click();
                } else {
                    //Click Stock Pile
                    (this.stock.cards.length > 0)?this.stock.topCard().element().click():this.stock.element().click;
                }
            } else if(this.stock.cards.length > 0){
                //Click Stock Pile
                this.stock.topCard().element().click();
            } else {
                //Exit
            }
        },250)
    }
    foundationMatch(aCard){
        return this.foundations.find(pile=>pile.suite == aCard.suite.suite);
    }
    sendSolvedDeck(){
        //This function will send the solved deck to the server.
        if(this.storedStock.length > 0){
            let xhr = new XMLHttpRequest;
            xhr.open("POST", "https://mrlesbomar.com/games/cgi-bin/add_solved_deck.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.send('input1='+this.storedStock);
            this.storedStock = "";
        }
    }
    getSolvedDeck(){
        let failed = false;
        new Promise((resolve, reject)=>{
            let xhr = new XMLHttpRequest;
            xhr.open('GET', "https://mrlesbomar.com/games/cgi-bin/get_solved_deck.php");
            xhr.onload = () =>{
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.statusText);
                }
            }
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
        }).then(stuff=>{
            this.newGame(this.reconstituteDeck(stuff));
        }).catch(error=>{
            //Create status screen and deal random deck
            let notice = document.createElement('div');
            notice.id = 'notice';
            notice.innerHTML = `<h1>Unable to connect to the server. Please choose a random deck.</h1>`;
            document.getElementsByTagName('main')[0].appendChild(notice);
        });
    }
    reconstituteDeck(stringDeck){
        let solvedDeckString = String(stringDeck).split("");
        let solvedDeckPairs = [];
        do {
            solvedDeckPairs.push([solvedDeckString.shift(), solvedDeckString.shift()]);
        } while (solvedDeckString.length > 0);
        let finishedDeck = solvedDeckPairs.map(pair=>{
            switch(pair[0]){
                case 's': return new Card(this.suites.find(x=> x.suite == 'spade'),this.toDec(pair[1]),false, this.mobileUser);
                case 'd': return new Card(this.suites.find(x=> x.suite == 'diamond'),this.toDec(pair[1]),false, this.mobileUser);
                case 'c': return new Card(this.suites.find(x=> x.suite == 'club'),this.toDec(pair[1]),false, this.mobileUser);
                case 'h': return new Card(this.suites.find(x=> x.suite == 'heart'),this.toDec(pair[1]),false, this.mobileUser);
            }
        })
        return finishedDeck;
    }
    celebration(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        const randomNumber = (num) => Math.floor(Math.random()*num);
        this.foundations.forEach(foundation=>{
            foundation.cards.forEach(card=>{
                let me = new MoveObj(
                    card.element(),
                    {top:randomNumber(height),left:randomNumber(width)},
                    false,
                    500,
                    26,
                    false,
                    1,
                    []
                )
                this.celebrationCards.push(me);
            })
        })
        this.celebrationTimer = setInterval(()=>{
            if(this.celebrationCards.length > 0){
                this.celebrationCards.shift().begin();
            } else {
                clearInterval(this.celebrationTimer);
            }
        },50)
        setTimeout(()=>{
            let winning = document.createElement('div');
            winning.id = "winner";
            winning.innerHTML = "<h1>WINNER!!</h1>";
            document.getElementsByTagName('main')[0].appendChild(winning);
            navBar.activate();
            winning.style.opacity = 1;
        },500);
    }
    restoreGameState(){
        let gameState = JSON.parse(localStorage.getItem("gameState"));
        gameState.forEach(pile=>{
            if(pile.cards.length > 0){
                pile.cards.forEach(card => {
                    let newCard = new Card(card.suite,card.value,(card.face === "true")?true:false, this.mobileUser);
                    this[pile.pile].addCard(newCard);
                })
            }
        })
        this.storedStock = localStorage.getItem('storedStock');
    }
    saveGameState(){
        //Saves the game state so user won't loose game progess.
        let gameState = this.allStacks.map(pile=> {return {pile:pile.name, cards:[]}})
        gameState.forEach(pile=>{
            pile.cards = this.stringifyCards(this[pile.pile].cards);
        })
        localStorage.clear();
        localStorage.setItem("gameState", JSON.stringify(gameState));
        localStorage.setItem("storedStock", this.storedStock);
    }
    stringifyCards(cardArray){
        return cardArray.map(card=>{return {name:card.name,value:card.value,suite:card.suite,face:String(card.face)}});
    }
}

export default Solitaire;