class Button extends TextGui{
    //Static Variables
    static Type = "Button";


    //Constructor Method
    constructor({} = {}){
        super(arguments[0]);

        

        
        ///Creating the button itself
        const _Button = createButton(this.Text);
        this.Button = _Button;
        // console.log(this.Button);

        //Configuring the metatable for the object
        const MetaData = {
            __object: this.Button,
        };

        this.MetaData = {...(this.MetaData), ...MetaData};



        //Setting up the button
        this.Setup();
        


        
    }



    //-------------------Getters/Setters-------------------------
    get Type(){
        return Button.Type;
    }
    
    
}