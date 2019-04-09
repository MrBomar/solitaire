class Card {
    constructor(suite, value, face){
        this.name = `${suite.suite}${value}`;
        this.value = value;
        this.suite = suite;
        this.face = face;
        this.currentStack = this.currentStack.bind(this);
        this.element = this.element.bind(this);
        this.symbol = this.symbol.bind(this);
        this.render = this.render.bind(this);
        this.events = [];
    }
    element(){
        return document.getElementById(this.name);
    }
    flip(history, moveID){
        (this.face)?this.element().classList.add("cardBack"):this.element().classList.remove("cardBack");
        (this.face)?this.element().classList.remove("cardFront"):this.element().classList.add("cardFront");
        this.face = !this.face;
        if(history){currentGame().moveHistory.push({action:"flip",card:this,history:false, ID:moveID})};
    }
    symbol(){
        switch(this.value){
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            case 1:
                return "A";
            default:
                return this.value;
        }
    }
    render(){
        let me = document.createElement("div");
        me.innerHTML = `<h2 class="left top" style="color:${this.suite.color};">${this.symbol()}</h3>
                        <h2 class="right top" style="color:${this.suite.color};">${this.suite.symbol}</h2>                
                        <h1 style="color:${this.suite.color};">${this.suite.symbol}</h1>
                        <h2 class="left bottom" style="color:${this.suite.color};">${this.suite.symbol}</h2>
                        <h2 class="right bottom" style="color:${this.suite.color};">${this.symbol()}</h3>`;
        (this.face)?me.classList.add("cardFront"):me.classList.add("cardBack");
        me.classList.add("Card");
        me.classList.add("cardClick");
        me.classList.add ("clickable");
        me.id = this.name;
        return me;
    }
    pos(){
        return {top: this.element().offsetTop, left: this.element().offsetLeft};
    }
    currentStack(){
        return currentGame()[this.element().parentElement.id];
    }
}