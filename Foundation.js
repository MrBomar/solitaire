//The four stacks for collecting the suites.

class Foundation extends Pile{
    constructor(suite){
        super();
        this.name = `${suite.suite}Foundation`;
        this.color = `${suite.color}`;
        this.symbol = `${suite.symbol}`;
        this.classList = ["pile", "foundation", "symbol"];
        this.render = this.render.bind(this);
        this.suite = suite.suite;
        this.render();
    }
    dealMe(card, face){
        card.face = face;
        this.pushCard(card);
    }
    render(){
        //New Symbol
        let me = document.createElement("h1");
        me.id = this.name;
        this.classList.forEach(cssClass => {
            me.classList.add(cssClass);
        })
        me.style.color = `${this.color}`;
        me.innerText = `${this.symbol}`;
        document.getElementsByTagName("body")[0].appendChild(me);
    }
    selectCards(aCard){
        return (this.cardCount() > 0)?[this.topCard()]:[];
    }
    validateMove(aCard){
        if((aCard.suite.suite == this.suite) && (this.cardCount() == 0) && (aCard.value == 1)){
            return true;
        } else if((aCard.suite.suite == this.suite) && (aCard.value == this.topCard().value+1)){
            return true;
        } else {
            return false;
        }
    }
}