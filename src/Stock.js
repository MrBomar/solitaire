import Pile from './Pile';

export default class Stock extends Pile{
    constructor(name){
        super();
        this.name = name;
        this.element = this.element.bind(this);
        this.classList = ["pile", "stock", "pileClick", "clickable"];
        this.render = this.render.bind(this);
        this.validateMove = this.validateMove.bind(this);
        this.render();
    }
    element(){
        return document.getElementById(this.name);
    }
    dealMe(card, face){
        card.face = face;
        this.pushCard(card);
    }
    validateMove(aCard){
        return true;
    }
}