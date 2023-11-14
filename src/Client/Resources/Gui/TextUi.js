class TextGui extends GuiObject{
    //-------------------Constructor Method-----------------------//
    constructor({Text = "", TextScaled = false, FontSize = 0} = {}){
        super(arguments[0]);
        

        //Storing the configs for the Text Gui object
        this.Text = Text;
        this.TextScaled = TextScaled;
        this._FontSize = FontSize;
        

        //Initializing the metadata for the object
        const MetaData = {
            __requiresRefresh: true,
        };
        this.MetaData = MetaData;
        

        
    }


    //--------------------Core Methods----------------------//
    CalculateFontSize(){
        if(this.TextScaled){
            const lettersAmount = this.Text.length;
            const objSize = this.Size.GetVector();
            let [objWidth, objHeight] = [objSize.x, objSize.y];

            this._FontSize = (min(objWidth, objHeight) / lettersAmount) * 2;
        }

        return this._FontSize;
    }

    Display(){
        // console.log("sdkjhsd");
        if(this.TextScaled){
            const FontSize = this.CalculateFontSize();

            const obj = this.GetObject();
            const objElement = obj.elt;

            objElement.style.setProperty("--FontSize", FontSize + "px");
        }
    }




    //------------------Getters/Setters----------------------------//
    get FontSize(){
        return this._FontSize;
    }
    set FontSize(newSize){
        if(typeof(newSize) == "number" && !this.TextScaled){
            this._FontSize = newSize;
            this.Display();
        }
    }
    
}