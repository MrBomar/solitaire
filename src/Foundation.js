import Pile from './Pile';

export default class Foundation extends Pile{
    constructor(suite, mobileUser){
        super();
        this.mobileUser = mobileUser;
        this.name = `${suite.suite}Foundation`;
        this.color = `${suite.color}`;
        this.symbol = `${suite.symbol}`;
        this.classList = ["pile", "foundation", "pileClick", "clickable"];
        this.render = this.render.bind(this);
        this.suite = suite.suite;
        this.render();
    }
    element(){
        return document.getElementById(this.name);
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
        me.classList.add((this.mobileUser)?"mobileSymbol":"symbol");
        document.getElementsByTagName("main")[0].appendChild(me);
    }
    selectCards(aCard){
        return (this.cardCount() > 0)?[this.topCard()]:[];
    }
    validateMove(aCard){
        if(!!this.cards.length && aCard.suite.suite === this.suite){
            return (this.topCard().value === aCard.value -1)?true:false;
        } else if(aCard.value === 1 && aCard.suite.suite === this.suite){
            return true;
        } else {
            return false;
        }
    }
}