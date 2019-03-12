class Card {
    constructor(suite, value){
        this.name = `${suite.suite}${value}`;
        this.value = value;
        this.suite = suite;
        this.face = false;
        this.currentStack = this.currentStack.bind(this);
        this.element = this.element.bind(this);
        this.symbol = this.symbol.bind(this);
        this.render = this.render.bind(this);
        this.events = [["click", clickEvent]];
    }
    element(){
        return document.getElementById(this.name);
    }
    flip(){
        let parent = this.element().parentElement;
        let top = this.element().offsetTop;
        let left = this.element().offsetLeft;
        let zIndex = this.element().zIndex;
        this.events.forEach(stuff=>{
            this.element().removeEventListener(stuff[0],stuff[1]);
        })
        parent.removeChild(this.element());

        this.face = (this.face)?false:true;
        let newCard = this.render();
        newCard.top = javAnimate.calcUOM(top,"vw");
        newCard.left = javAnimate.calcUOM(left,"vw");
        newCard.zIndex = zIndex;
        parent.appendChild(newCard);
        this.events.forEach(stuff=>{
            this.element().addEventListener(stuff[0],stuff[1]);
        })
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
        if(this.face){
            me.innerHTML = `<h2 class="left top" style="color:${this.suite.color};">${this.symbol()}</h3>
                            <h2 class="right top" style="color:${this.suite.color};">${this.suite.symbol}</h2>                
                            <h1 style="color:${this.suite.color};">${this.suite.symbol}</h1>
                            <h2 class="left bottom" style="color:${this.suite.color};">${this.suite.symbol}</h2>
                            <h2 class="right bottom" style="color:${this.suite.color};">${this.symbol()}</h3>`;
            me.classList.add("cardFront");
        } else {
            me.classList.add("cardBack");
        }
        me.classList.add("Card");
        me.id = this.name;
        return me;
    }
    pos(){
        return {top: this.element().offsetTop, left: this.element().offsetLeft};
    }
    currentStack(){
        return solitare[this.element().parentElement.id];
    }
    eventListeners(){
        return [
            ["click", clickEvent]
        ]
    }
}