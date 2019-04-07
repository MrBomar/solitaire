//An easy to use function that will move an object to a specified location
//You must specify;
    //The DOM object to move
    //New Position - Expressed as an object {top: value, topUOM: "value", left: value, leftUOM "value"}
    //New Parent Element - Either DOM object or boolean false
    //Length of animation - numerical in ms
    //Frames per Minute - numerical
    //Keep element on top - boolean
    //End Position zIndex - numerical
    //Event Listeners - Specify an array of listeners you need to keep attached, or return false.

//The begin() allows you to control when to fire the animation.

class MoveObj{
    constructor(obj, to, newDIV, msec, frames, onTop, zIndex, eventListeners){
        this.obj = obj;
        this.to = to;
        this.newDIV = newDIV;
        this.msec = msec;
        this.onTop = onTop;
        this.zIndex = zIndex;
        this.eventListeners = eventListeners;
        this.objChildren = [];
        this.totalFrames = Math.floor((msec/1000)*frames);
        this.frameLength = Math.floor(msec/this.totalFrames);
        this.draw = this.draw.bind(this);
        this.begin = this.begin.bind(this);
        this.end = this.end.bind(this);
        this.trajectory = this.trajectory.bind(this);
    }
    copyChildren(){
        let childList = Array.from(this.obj.children);
        childList.forEach(kiddo =>{
            this.objChildren.push([kiddo.cloneNode(),kiddo.innerText]);
        })
    }
    pasteChildren(){
        this.objChildren.forEach(kiddo =>{
            kiddo[0].innerText = kiddo[1];
            this.obj.appendChild(kiddo[0]);
        })
    }
    trajectory(){
        let newTop = javAnimate.round((this.to.top - this.obj.offsetTop) / this.totalFrames) + this.obj.offsetTop;
        let newLeft = javAnimate.round((this.to.left - this.obj.offsetLeft) / this.totalFrames) + this.obj.offsetLeft;
        this.totalFrames = this.totalFrames - 1;
        return {top:newTop, left:newLeft};
    }
    draw(){
        let newPOS = this.trajectory();
        this.obj.style.left = newPOS.left + 'px';
        this.obj.style.top = newPOS.top + 'px';

    }
    begin(){
        this.start = Date.now();

        //This code keeps the moving object on top of all other elements.
        if(this.onTop){
            let obj3 = this.obj.cloneNode();
            this.copyChildren();

            //Set cloned object properties
            obj3.style.top = this.obj.offsetTop + "px";
            obj3.style.left = this.obj.offsetLeft + "px";

            //Delete event listeners
            if(this.eventListeners != false){
            this.eventListeners.forEach(listener =>{
                this.obj.removeEventListener(listener[0],listener[1]);
            })}

            //Delete element and paste in body
            this.obj.parentElement.removeChild(this.obj);
            document.getElementsByTagName("body")[0].appendChild(obj3);

            //Set zIndex and reassign object pointer
            obj3.style.zIndex = this.zIndex;
            this.obj = obj3;

            this.pasteChildren();
        }

        this.time = setInterval(()=>{
            let timePassed = Date.now() - this.start;
            if((timePassed >= this.msec)||(this.totalFrames < 0)){
                this.end();
                return;
            }
            this.draw();
        }, this.frameLength)
    }
    end(){
        clearInterval(this.time);

        //This code moves the element to it's new parent element.
        if(this.newDIV != false){
            let obj2 = this.obj.cloneNode();
            this.obj.parentElement.removeChild(this.obj);
            this.newDIV.appendChild(obj2);
            obj2.style.zIndex = this.zIndex;
            this.obj = obj2;
            this.pasteChildren();

            //Add back event listeners
            if(this.eventListeners != false){
                this.eventListeners.forEach(listener=>{
                    this.obj.addEventListener(listener[0], listener[1]);
                })
            }
        }

        //Applying the specified unit of measure and fixing final position
        this.obj.style.top = javAnimate.calcUOM(this.to.top,this.to.topUOM);
        this.obj.style.left = javAnimate.calcUOM(this.to.left,this.to.leftUOM);
    }
}

const javAnimate = {
    calcUOM(pixels, uom){
        switch(uom){
            case "px":
                return pixels + uom;
            case "vw":
                return (pixels / window.innerWidth) * 100 + uom;
            case "vh":
                return (pixels / window.innerHeight) * 100 + uom;
        }
    },
    round(figure){
        let tempFigure = (figure < 0)?figure*-1:figure;
        let anotherFigure = (tempFigure <= .5)?Math.floor(tempFigure):Math.floor(tempFigure) + 1;
        return (figure < 0)?anotherFigure*-1:anotherFigure;
    }
}

let storedAnimations = [];

Array.from(document.getElementsByTagName("div")).forEach(div=>{
    storedAnimations.push(new MoveObj(div,{top:600, topUOM:"vw",left:500, leftUOM:"vh"},false,2000,90,true,2));
})