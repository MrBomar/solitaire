let isClickable = (obj) => {
    if(obj.classList.length == 0){
        return (obj.parentElement === null)?false:isClickable(obj.parentElement);
    } else {
        let clickAble = (Array.from(obj.classList).includes("clickable"))?obj:false
        return (clickAble)?clickAble:isClickable(obj.parentElement);
    }
}
let clickEvent = (event) => {
    let item = isClickable(event.target);
    event.stopPropagation();
    if(item === false){
        (navBar.open)?navBar.deActivate():navBar.activate();
        return;
    }
    let clickClasses = [
        {text:"solveClick",exec:currentGame().solve},
        {text:"cardClick",exec:currentGame().cardClickEvent},
        {text:"pileClick",exec:currentGame().pileClickEvent}
    ];
    clickClasses.forEach(obj=>{
        if(Array.from(item.classList).includes(obj.text)){
            obj.exec(item.id);
            return;
        }
    })
    if(navBar.open) navBar.deActivate();
}

class Solitaire{
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
        this.won = false;
        this.solveTimer;
        this.fireCard = this.fireCard.bind(this);
    }
    toHex(num){
        return "0123456789ABCDEF".charAt(num)
    }
    storeStock(){
        currentGame().stock.cards.forEach(card=>{
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

        //Cycle through the foundations and remove the DOM elements.
        this.foundations.forEach(foundation=>{
            foundation.element().parentElement.removeChild(foundation.element());
        })

        //Cycle through main children and delete them
        let mainDIV = document.getElementsByTagName("main")[0];
        Array.from(mainDIV.children).forEach(child=>{
            mainDIV.removeChild(child);
        })
    }
    newGame(){
        //Render Foundations
        this.foundations.forEach(foundation=>{
            foundation.render();
        })

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
        let fromPile = this.priorClick[0].currentStack();
        let currentID = this.cardMoveID();
        do {
            let myCard = this.priorClick.shift();
            this.moveCard(myCard,toPile,true,currentID);
            if((fromPile instanceof Talon)&&(toPile instanceof Stock)){myCard.flip(true,currentID)}
        } while (this.priorClick.length > 0)
        currentGame().clearPriorClick();                                //Clear the selected cards
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
        
        let clickedCard = currentGame().findCard(cardID);

        //Capture cards affected by this click
        let selectedStack = clickedCard.currentStack();
        let selectedCards = selectedStack.selectCards(clickedCard);

        if(selectedStack.name == "stock"){                                 //Stock card clicked 
            currentGame().priorClick = [currentGame().stock.topCard()];    //Add the top Stock Card to the priorClick
            currentGame().movePriorClick(currentGame().talon);             //Execute moving of all cards in PriorClick
        } else if (currentGame().priorClick.length != 0){                  //All other Pile card clicks if Cards were previously selected
            if(selectedStack.validateMove(currentGame().priorClick[0])){   //If selected cards can be moved to clicked Pile
                currentGame().movePriorClick(selectedStack);               //Execute moving of all cards in PriorClick
            } else {                                                       //If selected cards cannot be moved to the clicked pile.
                currentGame().clearPriorClick();                           //Clear the selected cards
            }
        } else {
            //Action taken if no other cards were previously selected.
            currentGame().priorClick = selectedCards;
            currentGame().shade(currentGame().priorClick);
            currentGame().fireCard(clickedCard);
        }
    }
    pileClickEvent(pileID){
        //Select clicked pile
        let clickedPile = currentGame()[pileID];

        if(currentGame().priorClick.length != 0){
            //let fromPile = currentGame().priorClick[0].currentStack();    ***************Unused
            if(clickedPile.validateMove(currentGame().priorClick[0])){
                currentGame().movePriorClick(clickedPile);
            } else {
                //Action taken if the previously selected cards cannot be moved to the clicked stack.
                currentGame().clearPriorClick();
            }
        }

        if(clickedPile.name == "stock"){currentGame().reStock()};
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
            solveButton.innerHTML = `<h2 id="solve" class="solveClick clickable">Quick Solve</h2>`;
            document.getElementsByTagName('main')[0].appendChild(solveButton);
        }

        return complete;
    }
    solve(){
        this.solveTimer = setTimeout(()=>{
            if(this.cardsOnBoard()){
                this.tableauCycle();
                this.talonCycle();
            }
        },500)
    }
    fireCard(myCard){
        let selectPiles = (this.priorClick.length === 1)?this.foundations.concat(this.tableau):this.tableau;
        let availablePiles = selectPiles.filter(pile => pile.name != myCard.currentStack().name);
        
        availablePiles.forEach(pile=>{
            if((pile.validateMove(myCard))&&(this.priorClick.length > 0)){
                this.movePriorClick(pile);
                return;
            }
        });
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
        if(this.storedStock.length > 0){
            let xhr = new XMLHttpRequest;
            xhr.open("POST", "https://mrlesbomar.com/solitaire/cgi-bin/add_solved_deck.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.send('input1='+this.storedStock);
            this.storedStock = "";
        }
    }
}

const saveGameState = () =>{
    //Experiment with storing game state
    let gameState = [];
    currentGame().allStacks.forEach(pile=>{gameState.push({pile:pile.name,cards:[]})});
    gameState.forEach(pile=>{
        currentGame()[pile.pile].cards.forEach(card=>{
            pile.cards.push({name:card.name,value:card.value,suite:card.suite,face:card.face});
        });
    })
    let newString = JSON.stringify(gameState);
    console.log(newString);
    console.log(newString.length)
}

const currentGameResize = () => {
    if(games.length>0){
        currentGame().resize()
    }
}

document.getElementsByTagName("main")[0].addEventListener("click", clickEvent);
window.addEventListener("resize", currentGameResize);
window.addEventListener("orientationchange", currentGameResize);