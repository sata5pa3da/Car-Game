class EngineService{
    //----------Constants----------//
    static widthScale = .999;
    static heightScale = .999;

    //----------Variables----------//
    static _ActiveEngine;


    //----------Methods----------//
    static Init(){

    }

    /**Checks if there is an active engine and calls its update method if it exists*/
    static UpdateActiveEngine(){
        const ActiveEngine = this._ActiveEngine;

        if(ActiveEngine){
            ActiveEngine.Update();
        }
    }
    
    /**Sets the active engine to the specified one if valid*/
    static SetActiveEngine(Engine){
        if(!Engine instanceof EngineInstance){return}


        //Disabling the currect active engine before updating it to the new one
        if(this._ActiveEngine){
            this._ActiveEngine.Disable();
        }

        this._ActiveEngine = Engine;
    }


    //------------Calculation Methods-----------//

    /**Calculates the dimensions for the canvas based on the client's window's width and height*/
    static CalculateWindowSize(){
        return [windowWidth * this.widthScale, windowHeight * this.heightScale];
    }

    //------------Event Callback(s)-------------//

    /**Callback that is invoked when the client's window is resized*/
    static OnWindowResized(){
        resizeCanvas(...this.CalculateWindowSize());
        this.UpdateActiveEngine();
    }





    //----------------Getter/Setters-----------------//
    static get ActiveEngine(){
        return this._ActiveEngine;
    }
    
}

function windowResized(){
    console.log("Hello");
    EngineService.OnWindowResized();
}