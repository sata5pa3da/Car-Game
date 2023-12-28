class Color{
    //-------------------Static methods-------------------//
    static new(red = 0, green = 0, blue = 0){
        return new Color(red, green, blue);
    }

    static fromRGB(red = 0, green, blue){
        if(typeof(green) != "number"){green = red}
        if(typeof(blue) != "number"){blue = red}
        
        red /= 255;
        green /= 255;
        blue /= 255;

        return new Color(red, green, blue);
    }



    //---------------------Constructor----------------------//
    constructor(red = 0, green, blue){
        if(typeof(green) != "number"){green = red}
        if(typeof(blue) != "number"){blue = red}

        this.R = red, this.G = green, this.B = blue;
        this._Value = undefined;
    }


    //------------------Getters/Setters--------------------//
    get Value(){
        if(!this._Value){this._Value = color(this.R * 255, this.G * 255, this.B * 255)}

        return this._Value;
    }

}