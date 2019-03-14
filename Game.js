const clickEvent = (event) => {
    let myElement = event.currentTarget;
    let myElementClasses = myElement.classList; 
    myElementClasses.forEach(elmClass =>{
        if(elmClass == "Card"){
            solitare.cardClickEvent(solitare.findCard(myElement.id));
        } else if (elmClass == "pile"){
            solitare.pileClickEvent(solitare[myElement.id]);
            console.log(solitare[myElement.id]);
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
        this.addPileClickEvents = this.addPileClickEvents.bind(this);
        this.addPileClickEvents();
        this.moveHistory = []; //Stores moves made, part of the undo function
        window.addEventListener("resize", this.resize);
        this.cardMoveID = this.cardMoveID.bind(this);
        this.movePriorClick = this.movePriorClick.bind(this);
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
    addPileClickEvents(){
        let myArray = Array.from(document.getElementsByTagName("body")[0].children);
        myArray.forEach(obj =>{
            obj.addEventListener("click", clickEvent);
        })
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
        let myCard = new MoveObj(thisCard.element(),newPOS,toStack.element(),this.timer(thisCard.element(),toStack.element()),40,true,toStack.cards.length,thisCard.eventListeners());
        myCard.begin();

        //Perform the card object movement manually here -- GOOD
        toStack.cards.push(origStack.removeCard(thisCard.name));
        
        //Check to see if the game has been solved
        if(this.done()==true){
            document.getElementById("solve").display = "block";
        }

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
    }
    cardMoveID(){
        return this.moveHistory.length;
    }
    reStock(){
        this.talon.cards.reverse();
        this.talon.cards.forEach(card=>{this.priorClick.push(card)});
        this.movePriorClick(this.stock);
    }
    cardClickEvent(clickedCard){
        //Capture cards affected by this click
        let selectedStack = clickedCard.currentStack();
        let selectedCards = selectedStack.selectCards(clickedCard);

        if(selectedStack.name == "stock"){                                 //Stock card clicked 
            this.priorClick = [this.stock.topCard()];                           //Add the top Stock Card to the priorClick
            this.movePriorClick(this.talon);                                    //Execute moving of all cards in PriorClick
        } else if (solitare.priorClick.length != 0){                       //All other Pile card clicks if Cards were previously selected
            if(selectedStack.validateMove(solitare.priorClick[0])){        //If selected cards can be moved to clicked Pile
                this.movePriorClick(selectedStack);                             //Execute moving of all cards in PriorClick
            } else {                                                       //If selected cards cannot be moved to the clicked pile.
                solitare.clearPriorClick();                                     //Clear the selected cards
            }
        } else {
            //Action taken if no other cards were previously selected.
            solitare.priorClick = selectedCards;
            solitare.shade(solitare.priorClick);
        }
        
        event.stopPropagation(); //Stops the event
    }
    pileClickEvent(clickedPile){
        if(this.priorClick.length != 0){
            let fromPile = solitare.priorClick[0].currentStack();
            if(clickedPile.validateMove(solitare.priorClick[0])){
                this.movePriorClick(clickedPile);
            } else {
                //Action taken if the previously selected cards cannot be moved to the clicked stack.
                solitare.clearPriorClick();
            }
        }

        if(clickedPile.name == "stock"){this.reStock()};

        //Insterted to stop the parent DIV from attempting to handle the click.
        event.stopPropagation();
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
    unShade(cardArray){
        cardArray.forEach(x =>{
            x.element().classList.remove('shade');
        })
    }
    clearPriorClick(){
        this.allStacks.forEach(pile=>{this.unShade(pile.cards)})
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
            
        } while (this.cardsOnBoard());
    }
    cardsOnBoard(){
        this.allStacks.forEach(stck=>{
            if(stck.cards.length > 0){
                return true;
            }
        })
        return false;
    }
    tableauCycle(){
        complete = true;
        do {
            this.tableau.forEach(tab=>{
                tab.topCard()
            })
        } while (complete == false);
    }
}

let solitare = new Game;