export default class Pile{
    constructor(){
        this.cards = []; // stores all card in the stack
        this.element = this.element.bind(this);
        this.cardCount = this.cardCount.bind(this);
        this.topCard = this.topCard.bind(this);
        this.nextCard = this.nextCard.bind(this);
        this.bottomCard = this.bottomCard.bind(this);
        this.removeCard = this.removeCard.bind(this);
        this.topCardPOS = this.topCardPOS.bind(this);
        this.nextCardPOS = this.nextCardPOS.bind(this);
        this.addCard = this.addCard.bind(this);
        this.selectCards = this.selectCards.bind(this);
        this.render = this.render.bind(this);
        this.resize = this.resize.bind(this);
        this.topCardFlip = this.topCardFlip.bind(this);
    }
    element(){
        return document.getElementById(this.name);
    }
    cardCount(){
        return this.cards.length;
    }
    topCard(){
        return (this.cardCount() > 0)?this.cards[this.cardCount()-1]:false;
    }
    nextCard(){
        return (this.cardCount() > 1)?this.cards[this.cardCount()-2]:false;
    }
    bottomCard(){
        return (this.cardCount() > 0)?this.cards[0]:false;
    }
    removeCard(cardName){
        //Use this method for all card removal
        let realCardName = "";
        switch (cardName) {
            case "top":
                realCardName = this.topCard().name;
                break;
            case "bottom":
                realCardName = this.bottomCard().name;
                break;
            default:
                realCardName = cardName;
                break;
        }

        //Search the cards array and return the index value of the card
        let cardIndex = 0;
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].name == realCardName){cardIndex = i}
        }
        return this.cards.splice(cardIndex, 1)[0]; //Remove selected card from array.
    }
    topCardPOS(){
        return {left: this.element().offsetLeft, top:this.element().offsetTop};
    }
    nextCardPOS(){
        return {left: this.element().offsetLeft, top:this.element().offsetTop};
    }
    addCard(aCard){
        let renderedCard = aCard.render();
        renderedCard.style.zIndex = this.cardCount();
        renderedCard.style.top = `${this.nextCardPOS().top}px`;
        this.element().appendChild(renderedCard);
        this.cards.push(aCard);
        aCard.events.forEach(item=>{aCard.element().addEventListener(item[0],item[1])})
    }
    selectCards(clickedCard){
        return [clickedCard];
    }
    render(){
        //Build the element
        let me = document.createElement("div");
        me.id = this.name;
        this.classList.forEach(cssClass => {
            me.classList.add(cssClass);
        })
        document.getElementsByTagName("main")[0].appendChild(me);
    }
    resize(){
        if(this.cards.length != 0){
            this.cards.forEach(card=>{
                card.element().style.top = this.element().offsetTop+ "px";
                card.element().style.left = this.element().offsetLeft + "px";
            })
        }
    }
    topCardFlip(moveID, myGame){
        if(this.cardCount() != 0){
            if(this.topCard().face == false){this.topCard().flip(true, moveID, myGame)}
        }
    }
}