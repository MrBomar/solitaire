import Pile from './Pile';

export default class Talon extends Pile{
    constructor(name){
        super();
        this.name = name;
        this.classList = ["pile", "talon", "pileClick", "clickable"];
        this.dealMe = this.dealMe.bind(this);
        this.validateMove = this.validateMove.bind(this);
        this.render = this.render.bind(this);
        this.render();
    }
    dealMe(card, face){
        card.face = face;
        this.pushCard(card);
    }
    validateMove(tryCard){
        return (document.getElementById(tryCard.name).parentElement.id == "stock")?true:false;
    }
}