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



    //Returns an Udim2 that represents the "value" Udim2 relative to the "origin" - "bound" Udim2 object. Ex: (.5, 0, .5, 0) => half way between the origin and bound.
    static GetRelativeUdim2(value, origin, bound){
        // const originVector = origin.GetVector();
        // const boundVector = bound.GetVector();

        // console.log(value, origin, bound);
                
        const xScale = lerp(origin._x.Scale, origin._x.Scale + bound._x.Scale, value._x.Scale);
        const xOffset = value._x.Offset;

        const yScale = lerp(origin._y.Scale, origin._y.Scale + bound._y.Scale, value._y.Scale);
        const yOffset = value._y.Offset;


        return Udim2.new(xScale, xOffset, yScale, yOffset);
    }



    static GetUdim2Value(...args){
        if(args.length == 1){ //An Udim2 object was passed as argument
            const obj = args[0];
            return [obj.x.Scale, obj.x.Offset, obj.y.Scale, obj.y.Offset];
        }else if(args.length == 2){ //Xscale and Yscale was passed as arguments
            return [args[0], 0, args[1], 0];
        }else{ //Raw arguments passed
            return [args[0], args[1], args[2], args[3]];
        }
    }
    


    //Constructor method
    constructor(xScale = 0, xOffset = 0, yScale = 0, yOffset = 0){
        this._x = new Udim(xScale, xOffset);
        this._y = new Udim(yScale, yOffset);

        this.onUpdate = null;
    }

    
    //Object core methods
    Update(){
        if(this.onUpdate){
            this.onUpdate();
        }
    }

    UpdateVector(){
        if(!this._vector){
            this._vector = createVector(this.x.Get(width), this.y.Get(height));
        }else{
            this._vector.x = this.x.Get(width);
            this._vector.y = this.y.Get(height);
        } 
    }

    GetVector(){
        this.UpdateVector();
        return this._vector;
    }

    ToRelativeUdim2(origin, bound){
        const RelativeUdim2 = Udim2.GetRelativeUdim2(this, origin, bound);
        this.x = RelativeUdim2.x;
        this.y = RelativeUdim2.y;

        return this;
    }

    Copy(){
        return Udim2.new(this.x.Scale, this.x.Offset, this.y.Scale, this.y.Offset);
    }


    //Object arithmetic methods
    Add(...args){
       const [xScale, xOffset, yScale, yOffset] = [...Udim2.GetUdim2Value(...args)];

       this.x.Add(xScale, xOffset);
       this.y.Add(yScale, yOffset);
       this.Update();

       return this;
    }

    Sub(...args){
        const [xScale, xOffset, yScale, yOffset] = [...Udim2.GetUdim2Value(...args)];

        this.x.Sub(xScale, xOffset);
        this.y.Sub(yScale, yOffset);
        this.Update();

        return this;
    }

    Mult(...args){
        const [xScale, xOffset, yScale, yOffset] = [...Udim2.GetUdim2Value(...args)];

        this.x.Mult(xScale, xOffset);
        this.y.Mult(yScale, yOffset);
        this.Update();

        return this;
    }


    //----------Getters/Setters-----------------//
    get Type(){
        return Udim2.Type;
    }

    get Magnitude(){
        return this.GetVector().mag();
    }


    get x(){
        return this._x;
    }
    set x(value){
        this._x = value;
        this.Update();
    }

    get y(){
        return this._y;
    }
    set y(value){
        this._y = value;
        this.Update();
    }



   





}