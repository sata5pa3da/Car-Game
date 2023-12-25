class Udim{
    //Static methods
    static GetUdimValue(...args){
        // console.log(args);
        if(arguments.length == 1){ //An Udim object was passed as argument
            const obj = arguments[0];
            if(typeof(obj) == "object"){
                return [obj.Scale, obj.Offset];
            }else{ //Only scale was provided as argument
                return [obj, 0];
            }
            
        }else{ //Raw arguments passed
            return [arguments[0], arguments[1]];
        }
    }


    //Constructor method
    constructor(Scale = 0, Offset = 0){
        this.Scale = Scale;
        this.Offset = Offset;
    }

    //Core object methods
    Get(total){
        return total * this.Scale + this.Offset;
    }

    

    //Object arithmetic methods
    Add(...args){
        const [Scale, Offset] = [...Udim.GetUdimValue(...args)];

        this.Scale += Scale;
        this.Offset += Offset;

        return this;
    }
    
    Sub(...args){
        const [Scale, Offset] = [...Udim.GetUdimValue(...args)];

        this.Scale -= Scale;
        this.Offset -= Offset;

        return this;
    }

    Mult(...args){
        const [Scale, Offset] = [...Udim.GetUdimValue(...args)];

        this.Scale *= Scale;
        this.Offset *= Offset || Scale;

        return this;
    }

    Div(...args){
        const [Scale, Offset] = [...Udim.GetUdimValue(...args)];

        this.Scale /= Scale;
        this.Offset /= Offset || Scale;

        return this;
    }
}