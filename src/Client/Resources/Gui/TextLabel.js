class TextLabel extends TextGui{
    //Static Variables
    static Type = "TextLabel";


    //Constructor Method
    constructor({} = {}){
        super(arguments[0]);

        

        
        ///Creating the button itself
        const _TextLabel = createButton(this.Text);
        _TextLabel.style("cursor", "default");
        // _TextLabel.center();
        this.TextLabel = _TextLabel;
        

       //Configuring the metatable for the object
        const MetaData = {
            __object: this.TextLabel,
        };

        this.MetaData = {...(this.MetaData), ...MetaData};



        //Setting up the button
        this.Setup();
        


        
    }



    //-------------------Getters/Setters-------------------------//
    get Type(){
        return TextLabel.Type;
    }
    
    
}