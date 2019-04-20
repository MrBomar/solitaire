export default class MenuBar {
    constructor(navClick){
        this.open = true;
        this.activate = this.activate.bind(this);
        this.deActivate = this.deActivate.bind(this);
        this.element = this.element.bind(this);
        this.deActivateTimer;
        this.element().addEventListener("mouseenter", this.activate);
    }
    activate(){
        if(!this.open){
            this.element().style.height = "15vh";
            this.open = true;

            //Time the application of the mouseleave eventListener to append after animation is complete.
            this.deActivateTimer = setTimeout(()=>{
                this.element().addEventListener("mouseleave", this.deActivate);
            },300)
        }   
    }
    deActivate(){
        if(this.open){
            this.element().style.height = "0px";
            this.open = false
            this.element().removeEventListener("mouseleave", this.deActivate);
        }
    }
    element(){
        return document.getElementsByTagName('nav')[0];
    }
}