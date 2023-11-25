    class Udim2{
    //Static Variables
    static Type = "Udim2";


    //Static constants
    static zero = new Udim2();
    static half = new Udim2(.5, 0, .5, 0);
    static one = new Udim2(1, 0, 1, 0);


    static xAxis = new Udim2(1);
    static yAxis = new Udim2(0, 0, 1, 0);


    //Static methods
    static new(xScale = 0, xOffset = 0, yScale = 0, yOffset = 0){
        return new Udim2(xScale, xOffset, yScale, yOffset);
    }


    static fromScale = function(xScale, yScale){
        return new Udim2(xScale, 0, yScale, 0);
    }

    static toScale = function(xOffset, yOffset){
        return Udim2.fromScale(xOffset/width, yOffset/height);
    }


    static fromOffset = function(xOffset, yOffset){
        return new Udim2(0, xOffset, 0, yOffset);
    }

    static toOffset = function(xScale, yScale){
        return Udim2.fromOffset(xScale * width, yScale * height);
    }




    static GetUdim2Value(...args){
        // console.log(args);
        if(arguments.length == 1){ //An Udim object was passed as argument
            const obj = arguments[0];
            return [obj.x.Scale, obj.x.Offset, obj.y.Scale, obj.y.Offset];
        }else{ //Raw arguments passed
            return [arguments[0], arguments[1], arguments[2], arguments[3]];
        }
    }
    


    //Constructor method
    constructor(xScale = 0, xOffset = 0, yScale = 0, yOffset = 0){
        this.x = new Udim(xScale, xOffset);
        this.y = new Udim(yScale, yOffset);

       
    }

    
    //Object core methods
    Update(){
        if(!this._vector){
            this._vector = createVector(this.x.Get(width), this.y.Get(height));
        }else{
            this._vector.x = this.x.Get(width);
            this._vector.y = this.y.Get(height);
        } 
    }

    GetVector(){
        this.Update();
        return this._vector;
    }

    Copy(){
        return Udim2.new(this.x.Scale, this.x.Offset, this.y.Scale, this.y.Offset);
    }


    //Object arithmetic methods
    Add(...args){
       const [xScale, xOffset, yScale, yOffset] = [...Udim2.GetUdim2Value(...args)];

       this.x.Add(xScale, xOffset);
       this.y.Add(yScale, yOffset);

       return this;
    }

    Sub(...args){
        const [xScale, xOffset, yScale, yOffset] = [...Udim2.GetUdim2Value(...args)];

        this.x.Sub(xScale, xOffset);
        this.y.Sub(yScale, yOffset);

        return this;
    }



    //----------Getters/Setters-----------------//
    get Type(){
        return Udim2.Type;
    }

    get Magnitude(){
        return this.GetVector().mag();
    }



   





}