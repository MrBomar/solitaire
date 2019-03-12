//The seven piles at the bottom.

class Tableau extends Pile{
    constructor(name, limit){
        super();
        this.limit = limit;
        this.name = String(name) + String(limit);
        this.addCard = this.addCard.bind(this);
        this.classList = ["pile", "tableau"];
        this.render = this.render.bind(this);
        this.render();
        this.topCardPOS = this.topCardPOS.bind(this);
        this.selectCards = this.selectCards.bind(this);
        this.topCardFlip = this.topCardFlip.bind(this);
    }
    validateMove(aCard){
        let valid = true;
        if((this.cardCount() == 0) && (aCard.value == 13)) {
            return true;
        } else if((aCard.suite.color != this.topCard().suite.color) && (aCard.value == this.topCard().value-1)){
            return true;
        } else {
            return false;
        }
    }
    nextCardPOS(){
        let cardHeight = solitare.stock.element().offsetHeight;
        let baseMargin = cardHeight / 4;
        let returnMargin = 0;
        if(this.cardCount() > 0){
            this.cards.forEach(item =>{
                (item.face)?returnMargin = returnMargin + baseMargin:returnMargin = returnMargin + (baseMargin/2);
            })
        } else {
            returnMargin = 0;
        }
        return {left: this.element().offsetLeft, top:returnMargin+this.element().offsetTop};
    }
    selectCards(clickedCard){
        if(clickedCard.face){ //Performed if the card is face up.
            //Will find the position of the clicked card.
            let curPOS = this.cards.map(function(x){return x.name;}).indexOf(clickedCard.name);
            return this.cards.slice(curPOS, this.cards.length); //Select card plus card on top.
        } else {
            return []; //Return an empty array.
        }
    }
    topCardPOS(){
        let myTopCard = (this.cards.length > 0)?this.cards[this.cardCount() -1].element():this.element();
        return {left: myTopCard.offsetLeft, top: myTopCard.offsetTop};
    }
    topCardFlip(){
        if(this.cardCount() != 0){
            if(this.topCard().face == false){
                solitare.moveCard(this.topCard(),true,"flip",true,true);
            }
        }
    }
}