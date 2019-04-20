import Pile from './Pile';

export default class Foundation extends Pile{
    constructor(suite, mobileUser){
        super();
        this.mobileUser = mobileUser;
        this.name = `${suite.suite}Foundation`;
        this.color = `${suite.color}`;
        this.symbol = `${suite.symbol}`;
        this.classList = ["pile", "foundation", "symbol", "pileClick", "clickable"];
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
        if(this.mobileUser) me.classList.add("mobileH1");
        document.getElementsByTagName("main")[0].appendChild(me);
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