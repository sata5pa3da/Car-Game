const DEFAULT_CANVAS_POSITION = {x: 0, y: 0};

class GuiObject{
    //-------------------------Private Static Variables Declaration-----------------------------------//
    #CAN_DISPLAY;


    //--------------------------------Static Methods-------------------------------------//
     
    //This function is responsible for retrieving information on the canvas element
     static GetCanvas(){ 
        return window.hasOwnProperty("canvas") && canvas;
    }

    static GetCanvasPosition(){
        const canvas = GuiObject.GetCanvas();
        const canvasPosition = canvas && canvas.position();
        
        return canvasPosition || DEFAULT_CANVAS_POSITION
    }



    //-------------------------------Constructor-------------------------------------//
    constructor({
        Debug = {
            BorderWidth: 0,
            BorderColor: null,

        },


        Name = "",
        Class = "",
        Id = "",
        Setup = null,
        Methods = {},
        
        AnchorPoint = [0,0],
        Position = Udim2.new(),
        Size = Udim2.new(), 
        Visible,} = {}){
        
        

        //Private properties
        this.#CAN_DISPLAY = true;
        

        //Public properties
        this.Debug = Debug;


        this.Name = Name;
        this._Class = Class;
        this._Id = Id;
        this._SetupCallback = Setup;
        this._Methods = Methods;


        this._AnchorPoint = createVector(AnchorPoint[0], AnchorPoint[1]); //AnchorPoint;
        
        this._Position = typeof(Position) == "function" ? Position() : Position;
        this._AbsolutePosition = {x: 0, y: 0};
        this._AbsoluteAnchorPosition = {x: 0, y:0};
        
        this._Size = typeof(Size) == "function" ? Size() : Size;
        this._AbsoluteSize = {x: 0, y: 0};

        this._Visible = typeof(Visible) == "boolean" ? Visible : true;
    }



    //-------------------------------------Private Methods------------------------------------//
    

    //-------------------------------------Core Methods----------------------------------------//

    //Called when a class that inherits from this class wants to complete their setup
    Setup(){
        //Calling the custom setup function for the child class's object and initializing the object's methods
        const obj = this.GetObject();


        this.Position = this._Position;
        this.Size = this._Size;


        //Setting the class and id if this is a p5 element
        const isCustomElement = this.GetMetaData("__isCustomElement");
        if(!isCustomElement){
            if(this.Class) obj.class(this.Class);
            if(this.Id) obj.id(this.Id);
        }
        


        if(this._SetupCallback) this._SetupCallback(this, obj);
        this.InitializeMethods();
    }

    //This function is responsible for looping through all the methods in the child class's object's method object and binding them to the actual object's corresponding method
    InitializeMethods(){
        const Methods = this._Methods;
        const obj = this.GetObject();

        for(const Method in Methods){
            obj[Method](function(...args){
                Methods[Method](obj, ...args);
            });
        }
    }



    //Returns the MetaData for the object
    GetMetaData(property){
        const MetaData = this.MetaData;

        return property ? MetaData[property] : MetaData;
    }

    //Returns the actual Gui object
    GetObject(){
        const MetaData = this.GetMetaData();
        const obj = MetaData.__object;

        return obj;
    }

    //Returns the raw element of the object (if the object is a p5 wrapper)
    GetObjectElement(){
        const obj = this.GetObject();
        return obj.elt;
    }





    //Returns the desired property of the gui object
    Index(property){
        const obj = this.GetObject();
        return obj[property];
    }

    //This function calls the desired method on the gui object with the given arguments
    Call(property, ...args){
        return this.Index(property)(...args);
    }

    


    //Returns the object responsible for the basic rendering & updating of the display
    GetCustomObjElement(){
        const elementPath = this.GetMetaData("__elementPath");
        const elementObj = StringToPath(this, elementPath);

        return elementObj
    }



   





    //This function is called each frame for the gui object
    DefaultDisplay(){
        // console.log("Called");
        const Debug = this.Debug;

        const [BorderWidth, BorderColor] = [Debug.BorderWidth, Debug.BorderColor];
        // console.log
        if(typeof(BorderWidth) == "number" && BorderWidth > 0){
            // console.log("Passed");
            const [size, pos] = [this._AbsoluteSize, this._AbsolutePosition];
            // console.log(pos, this.Position, this);

            push();
            
            noFill();
            stroke(BorderColor ? BorderColor.Value : color(0));
            strokeWeight(Debug.BorderWidth);

            rect(pos.x, pos.y, size.x, size.y);

            pop();
        }
    }
    
    //This function is responsible for updating the button displayed onto the screen
    Update(sizeChanged = false){
        //Calculating the raw position and size of object
        const obj = this.GetObject();
        const posVector = this._Position.GetVector();
        const sizeVector = this._Size.GetVector();


        const canvasPosition = GuiObject.GetCanvasPosition();

        const absX = (canvasPosition.x) + posVector.x - (sizeVector.x * this._AnchorPoint.x);
        const absY = (canvasPosition.y) + posVector.y - (sizeVector.y * this._AnchorPoint.y);

        

        //Updating the absolute position/size property of the object
        this._AbsoluteAnchorPosition.x = posVector.x;
        this._AbsoluteAnchorPosition.y = posVector.y;

        this._AbsolutePosition.x = absX;
        this._AbsolutePosition.y = absY;


        this._AbsoluteSize.x = sizeVector.x;
        this._AbsoluteSize.y = sizeVector.y;
        


        //Checking if this is a custom element that requires a special way to set its position
        const isCustomElement = this.GetMetaData("__isCustomElement");
        if(!isCustomElement){
            obj.position(absX, absY);
        }
        
        
        
        //Checking if the actual size of the object is different from its specified size before updating it
        if(sizeChanged){
            //Checking if this is a custom element that requires a special way to set its size
            if(!isCustomElement){
                obj.size(sizeVector.x, sizeVector.y);
            }
            
            if(this._Visible){
                if(sizeVector.mag() == 0){
                    this.Visible = false;
                }else{
                    this.Visible = true;
                }
            }
            
        }
        

        //Checking if this is a custom element that has a designated method to update its display
        if(isCustomElement){
            const elementObj = this.GetCustomObjElement();
            if(typeof(elementObj.UpdateDisplay) == "function"){
                elementObj.UpdateDisplay(this._AbsolutePosition, this._AbsoluteSize, sizeChanged);
            }
        }
    }


    //Deletes the gui object
    Delete(){
        //Checking if this is a custom element that requires a special way to delete its object
        const isCustomElement = this.GetMetaData("__isCustomElement");
        if(isCustomElement){
            const elementObj = this.GetCustomObjElement();
            if(typeof(elementObj.DeleteObject) == "function"){
                elementObj.DeleteObject();
            }
        }else{
            //Deleting the object like normal
            const obj = this.GetObject();
            obj.remove();
        }

        delete this;
    }



    //----------------------------------Tweening Methods------------------------------------//
    CreateTween(value, goal, duration, easing_style, name){
        //Goal: {Size: Udim2.fromScale(-0.5, myObj.Size.Y.Scale)}
        const Tween = TweenManager.addTween(value, name || GenerateUniqueId());

        if(value.Type == "Udim2"){
            const [x, y] = [value.x, value.y];
            const tracker = {"x.Scale": x.Scale, "x.Offset": x.Offset, "y.Scale": y.Scale, "y.Offset": y.Offset};
            const motions = [];

            for(const key in tracker){
                const motion = {key: key, target: StringToPath(goal, key)};
                motions.push(motion);
            }

            const This = this;
            return Tween.addMotions(motions, duration, easing_style)
                .bindToUpdate("__Update", (tween, dt) => {
                    This.Update(value == This._Size ? true : false);
                    
                    if(This.GetMetaData("__requiresRefresh")){
                        This.Display();
                    }
                });
        }

    }

    WaitForTweens(...tweens){
        const promises = [];
        for(const tween of tweens){
            promises.push(tween.startTween(true));
        }

        return Promise.all(promises);
    }


    //-----------------------Getters/Setters For Private Properties------------------------//
    get CanDisplay(){
        return this.#CAN_DISPLAY;
    }


    //-----------------------Getters/Setters-----------------------//
    get Class(){
        return this._Class;
    }
    set Class(value = ""){
        const obj = this.GetObject();
        obj.class(value);

        this.Class = value;
    }

    get Id(){
        return this._Id;
    }
    set Id(value = ""){
        const obj = this.GetObject();
        obj.id(value);

        this.Id = value;
    }



    get AbsolutePosition(){
        return this._AbsolutePosition;
    }
    get AbsoluteAnchorPosition(){
        return this._AbsoluteAnchorPosition;
    }
    get Position(){
        return this._Position;
    }
    set Position(value = Udim2.half){
        // console.log("Before:", this.AbsolutePosition);
        this._Position = value;
        this.Update();
        // console.log("After:", this.AbsolutePosition);
    }

    get AbsoluteSize(){
        return this._AbsoluteSize;
    }
    get Size(){
        return this._Size;
    }
    set Size(value = Udim2.half){
        // console.log("Updated!");
        this._Size = value;
        this.Update(true);
    }

    get Visible(){
        return this._Visible;
    }
    set Visible(value = false){
        const isCustomElement = this.GetMetaData("__isCustomElement");
       
        if(!isCustomElement){
            const obj = this.GetObject();

            if(value && this.CanDisplay){
                obj.show();
            }else{
                obj.hide();
            }
        }else if(typeof(this.UpdateVisibility) == "function"){
            this.UpdateVisibility(this.CanDisplay ? value : false);
        }
        

        this._Visible = value;
    }


}


