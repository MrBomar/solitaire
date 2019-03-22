let isClickable = (obj) => {
    if(obj.classList.length == 0){
        return (obj.parentElement === null)?false:isClickable(obj.parentElement);
    } else {
        return (Array.from(obj.classList).includes("clickable"))?obj:false;
    }
}
let clickEvent = (event) => {
    let item = isClickable(event.target);
    event.stopPropagation();
    if(item === false){return;}
    let clickClasses = [
        {text:"newGameClick",exec:solitare.newGame},
        {text:"undoClick",exec:solitare.undo},
        {text:"solveClick",exec:solitare.solve},
        {text:"cardClick",exec:solitare.cardClickEvent},
        {text:"pileClick",exec:solitare.pileClickEvent}
    ];
    clickClasses.forEach(obj=>{
        if(Array.from(item.classList).includes(obj.text)){
            obj.exec(item.id);
            return;
        }
    })
}

class Game{
    constructor(){
        this.resize = this.resize.bind(this);
        this.suites = [{suite:"spade", symbol:"♠", color: "black"},
                       {suite:"club", symbol:"♣", color: "black"},
                       {suite:"heart", symbol:"♥", color: "red"},
                       {suite:"diamond", symbol:"♦", color:"red"}];
        this.spadeFoundation = new Foundation(this.suites[0]);
        this.clubFoundation = new Foundation(this.suites[1]);
        this.heartFoundation = new Foundation(this.suites[2]);
        this.diamondFoundation = new Foundation(this.suites[3]);
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
        this.solve = this.solve.bind(this);
    }
    toHex(num){
        return "0123456789ABCDEF".charAt(num)
    }
    storeStock(){
        solitare.stock.cards.forEach(card=>{
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
    newGame(){
        //Clear the playing board.
        this.allStacks.forEach(stack =>{
            stack.cards.forEach(thisCard => {
                document.getElementById(stack.name).removeChild(thisCard.element());
            })
            stack.cards = [];
        })

        //Empty the move history
        this.moveHistory = [];

        //Now that the table has been cleared, we can build the deck.
        let tempDeck = [];
        this.suites.forEach(suite => {
            [1,2,3,4,5,6,7,8,9,10,11,12,13].forEach(number => {
                tempDeck.push(new Card(suite, number));
            })
        })

        //Shuffle deck and add to stock
        this.randomizeArray(tempDeck).forEach(item => {
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
        let origStack = thisCard.currentStack(); //Identifies the card's origin
        if(history){this.moveHistory.push({action:"move",card:thisCard,to:origStack, history:false, ID:count})}; //Stores the move in the history

        //Capture object's target location -- GOOD
        let newPOS = {top: toStack.nextCardPOS().top, topUOM: "vh", left: toStack.nextCardPOS().left, leftUOM: "vw"};

        //Animate the card movement -- GOOD
        let myCard = new MoveObj(thisCard.element(),newPOS,toStack.element(),this.timer(thisCard.element(),toStack.element()),40,true,toStack.cards.length,thisCard.events);
        myCard.begin();

        //Perform the card object movement manually here -- GOOD
        toStack.cards.push(origStack.removeCard(thisCard.name));

        //Toggle the undo button
        if(this.moveHistory.length > 0){
            document.getElementById("undo").style.display = "block";
        } else {
            document.getElementById("undo").style.display = "none";
        }
    }
    movePriorClick(toPile){
        //Will transfer the priorClick.length to the moveCar()
        //moveCard will store the priorClick.length
        //Undo will then use the priorClick.length to move the correct number of cards
        //Remember to move the bottom card first.
        let fromPile = this.priorClick[0].currentStack();
        let currentID = this.cardMoveID();
        do {
            let myCard = this.priorClick.shift();
            this.moveCard(myCard,toPile,true,currentID);
            if((fromPile instanceof Talon)&&(toPile instanceof Stock)){myCard.flip(true,currentID)}
        } while (this.priorClick.length > 0)
        solitare.clearPriorClick();                                //Clear the selected cards
        if (fromPile instanceof Tableau){fromPile.topCardFlip(currentID)}   //If from Pile is Tableau then flip top Card
        if (toPile instanceof Talon){toPile.topCardFlip(currentID)}       //If to Pile is Talon then flip Talon top Card
        this.done(); //Runs code to check for a win.
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
        let clickedCard = solitare.findCard(cardID);

        //Capture cards affected by this click
        let selectedStack = clickedCard.currentStack();
        let selectedCards = selectedStack.selectCards(clickedCard);

        if(selectedStack.name == "stock"){                                 //Stock card clicked 
            solitare.priorClick = [solitare.stock.topCard()];                           //Add the top Stock Card to the priorClick
            solitare.movePriorClick(solitare.talon);                                    //Execute moving of all cards in PriorClick
        } else if (solitare.priorClick.length != 0){                       //All other Pile card clicks if Cards were previously selected
            if(selectedStack.validateMove(solitare.priorClick[0])){        //If selected cards can be moved to clicked Pile
                solitare.movePriorClick(selectedStack);                             //Execute moving of all cards in PriorClick
            } else {                                                       //If selected cards cannot be moved to the clicked pile.
                solitare.clearPriorClick();                                     //Clear the selected cards
            }
        } else {
            //Action taken if no other cards were previously selected.
            solitare.priorClick = selectedCards;
            solitare.shade(solitare.priorClick);
        }
        
        //if(!wasTriggered){event.stopPropagation()}; //Stops the event
    }
    pileClickEvent(pileID){
        //Select clicked pile
        let clickedPile = solitare[pileID];

        if(solitare.priorClick.length != 0){
            let fromPile = solitare.priorClick[0].currentStack();
            if(clickedPile.validateMove(solitare.priorClick[0])){
                solitare.movePriorClick(clickedPile);
            } else {
                //Action taken if the previously selected cards cannot be moved to the clicked stack.
                solitare.clearPriorClick();
            }
        }

        if(clickedPile.name == "stock"){solitare.reStock()};

        //Insterted to stop the parent DIV from attempting to handle the click.
        //if(!wasTriggered){event.stopPropagation()}
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
        document.getElementById("solve").style.display = (complete)?"block":"none";
        return complete;
    }
    solve(){
        do {
            this.tableauCycle();
            this.talonCycle();
        } while (this.cardsOnBoard());
    }
    cardsOnBoard(){
        let result = false;
        let myPiles = Array.from(this.tableau);
        myPiles.push(this.stock,this.talon);
        myPiles.forEach(pile=>{if(pile.cards.length > 0){result = true}});
        return result;
    }
    tableauCycle(){
        let tabs = this.tableau.filter((tab)=>{return tab.cards.length > 0 });
        let found = false;
        tabs.forEach(tab=>{
            let myFoundation = this.foundationMatch(tab.topCard());
            if(myFoundation.validateMove(tab.topCard())){
                found = true;
                this.cardClickEvent(tab.topCard(),true);
                this.pileClickEvent(myFoundation,true);
            }
        })
        if(found){this.tableauCycle()};
    }
    talonCycle(){
        if((this.talon.cards.length == 0) && (this.stock.cards.length == 0)){
            return;
        } else if (this.talon.cards.length == 0){
            this.cardClickEvent(this.stock.topCard(),true);
        }
        let myFoundation = this.foundationMatch(this.talon.topCard());
        if(myFoundation.validateMove(this.talon.topCard())){
            this.cardClickEvent(this.talon.topCard(),true);
            (myFoundation.cards.length == 0)?this.pileClickEvent(myFoundation,true):this.cardClickEvent(myFoundation.topCard(),true);
        } else {
            (this.stock.cards.length == 0)?this.pileClickEvent(this.stock,true):this.cardClickEvent(this.stock.topCard(),true);
        }
    }
    foundationMatch(aCard){
        return this.foundations.find(pile=>pile.suite == aCard.suite.suite);
    }
    sendSolvedDeck(){
        //This function will send the shuffled deck to the server for storage
        let xhr = new XMLHttpRequest;
        xhr.open("POST", "http://mrlesbomar.com/solitaire/cgi-bin/add_solved_deck.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.send(this.storedStock);
    }
}

let solitare = new Game;
const saveGameState = () =>{
    //Experiment with storing game state
    let gameState = [];
    solitare.allStacks.forEach(pile=>{gameState.push({pile:pile.name,cards:[]})});
    gameState.forEach(pile=>{
        solitare[pile.pile].cards.forEach(card=>{
            pile.cards.push({name:card.name,value:card.value,suite:card.suite,face:card.face});
        });
    })
    let newString = JSON.stringify(gameState);
    console.log(newString);
    console.log(newString.length)
}

document.addEventListener("click", clickEvent);