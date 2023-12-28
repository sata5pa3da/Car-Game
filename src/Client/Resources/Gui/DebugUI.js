class Debugger extends GuiObject{
    //-------------------Constructor Method-----------------------//
    constructor({
        DisplayType = "ellipse", //"ellipse" | "rect"
        Color = Color.fromRGB(255),

        Scale = 1, 
    } = {}){
        const args = arguments[0];
        super({...args, Size: Udim2.fromOffset(5, 5).Mult(Scale, Scale), _Data_Debugger: {
            DisplayType, Color, Scale,
        }});
        

        //Initializing the metadata for the object
        const MetaData = {
            __isCustomElement: true,
            __requiresRefresh: true,

        };
        this.MetaData = MetaData;
        

        //Setting up the debugger
        this.Setup();  
    }
    


    //--------------------Core Methods----------------------//
    Display(){
        if(!this.Visible || !this.CanDisplay){return}
        push();
        fill(this.Color.Value);

        const [position, size] = [this._AbsolutePosition, this._AbsoluteSize];
        switch (this.DisplayType) {
            case "ellipse":
                ellipseMode(CENTER);
                ellipse(position.x, position.y, size.x, size.y);
                break;
        
            case "rect":
                rectMode(CENTER);
                rect(position.x, position.y, size.x, size.y);
                break;

            default: break;
        }

        pop();
    }




    //------------------Getters/Setters----------------------------//
    
}