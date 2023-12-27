const DEFAULT_CANVAS_POSITION = {x: 0, y: 0};

class GuiObject{
    //-------------------------Private Static Variables Declaration-----------------------------------//
    #CAN_DISPLAY; #Methods; #Properties; #Accessors;


    //--------------------------------Static Methods-------------------------------------//
     
    //This function is responsible for retrieving information on the canvas element
     static GetCanvas(){ 
        return window.hasOwnProperty("canvas") && canvas;
    }

    static GetCanvasPosition(){
        const canvas = GuiObject.GetCanvas();
        const canvasPosition = canvas && canvas.position();
        
        return canvasPosition || DEFAULT_CANVAS_POSITION;
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
        ObjectEvents = {},
        
        Parent = null,
        AnchorPoint = [0,0],
        Position = Udim2.new(),
        Size = Udim2.new(), 
        Visible,} = {}){
        
        

        //Private properties
        this.#CAN_DISPLAY = true;
        this.#Methods = undefined;
        this.#Properties = undefined;
        this.#Accessors = undefined;


        //Public properties
        this.Debug = Debug;

        this.Name = Name;
        this._Class = Class;
        this._SetupCallback = Setup;
        this._ObjectEvents = ObjectEvents;

        
        this.Parent = Parent;

        this._AnchorPoint = createVector(...AnchorPoint); //AnchorPoint;
        
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
    Setup(args = {}){
        //Calling the custom setup function for the child class's object and initializing the object's methods
        const obj = this.GetObject();


        this.Position = this._Position;
        this.Size = this._Size;

        


        //Finalizing the class's metadata and properties/data
        for(const key in args){
            if(key.indexOf("_MetaData") == 0){
                const AdditionalMetaData = args[key];
                this.MetaData = {...this.MetaData, ...AdditionalMetaData};
            }else if(key.indexOf("_Data") == 0){
                const AdditionalData = args[key];
                for(const dataKey in AdditionalData){
                    this[dataKey] = AdditionalData[dataKey];
                }
            }
        }

        //Initializing the list of all the method/properties/accessors this object's class has, including the ones it inherits from
        const Methods = this.GetClassMethods();
        this.#Methods = Methods;
        // console.log(this.#Methods);

        const Properties = this.GetClassProperties();
        this.#Properties = Properties;
        // console.log(this.#Properties);

        const Accessors = this.GetClassAccessors();
        this.#Accessors = Accessors;
        // console.log(this.#Accessors);

        
        //Looping through all Udim2 properties and adding a listener that is called when a change occurs
        this.ForEachPropertyOfType("Udim2", (property, value) => {
            value.onUpdate = () => {
                this.UpdateDisplay(property == "_Size");
            }
        });

        // console.log(this);
        // const [newP, newS] = this.GetAbsoluteDimensions();
        // this.Position = newP;
        // this.Size = newS;
        // console.log(newP, newS);
       

        //Setting the class and id if this is a p5 element
        const isCustomElement = this.GetMetaData("__isCustomElement");
        if(!isCustomElement){
            if(this.Class) obj.class(this.Class);
            if(this.Id) obj.id(this.Id);
        }
        


        if(this._SetupCallback) this._SetupCallback(this, obj);
        this.InitializeObjectEvents();
    }

    //This function is responsible for looping through all the methods in the child class's object's method object and binding them to the actual object's corresponding method
    InitializeObjectEvents(){
        const ObjectEvents = this._ObjectEvents;
        const obj = this.GetObject();

        for(const ObjectEvent in ObjectEvents){
            obj[ObjectEvent](function(...args){
                ObjectEvents[ObjectEvent](obj, ...args);
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

        return elementObj;
    }



   





    //This function is called each frame for the gui object
    DefaultDisplay(){
        const Debug = this.Debug;

        const [BorderWidth, BorderColor] = [Debug.BorderWidth, Debug.BorderColor];
        if(typeof(BorderWidth) == "number" && BorderWidth > 0){
            const [size, pos] = [this._AbsoluteSize, this._AbsolutePosition];

            push();
            
            noFill();
            stroke(BorderColor ? BorderColor.Value : color(0));
            strokeWeight(Debug.BorderWidth);

            rect(pos.x, pos.y, size.x, size.y);

            pop();
        }
    }

    CustomDisplays(){
        let Methods = this.#Methods;
        if(!Methods){
            Methods = this.GetClassMethods();
            this.#Methods = Methods;
        }

        for(const Method of Methods.reverse()){
            if(Method.indexOf("_Update") == 0){
                this[Method]();   
            }
        }
    }

    
    //This function is responsible for updating the object displayed onto the screen
    UpdateDisplay(sizeChanged = false){
        //Calculating the raw position and size of object
        const obj = this.GetObject();
        const [Position, Size] = this.GetAbsoluteDimensions();
        const posVector = Position.GetVector();
        const sizeVector = Size.GetVector();


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
        // if(isCustomElement){
        //     const elementObj = this.GetCustomObjElement();
        //     if(typeof(elementObj.UpdateDisplay) == "function"){
        //         elementObj.UpdateDisplay(this._AbsolutePosition, this._AbsoluteSize, sizeChanged);
        //     }
        // }
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


    //----------------------------------General Class Methods-------------------------------//

    //Retrieves all the methods of this class including all the method it inherited from other classes
    GetClassMethods(){
        const Methods = GetAllPropertyNames(this, {includeEnumerables: false, includeNonenumerables:true});
        return Methods;
    }
    //Loops through every method within this class and applies the callback function to it
    ForEachMethod(callback, verifier){
        const Methods = this.#Methods;
        for(const method of Methods){
            const value = this[method];

            if(!verifier || verifier(method, value)){
                callback(method, value);
            }
        }
    }
    


    //Retrieves all the accessors(getters/setters) of this class including all the accessors it inherited from other classes
    GetClassAccessors(){
        const Descriptors = GetAllPropertyDescriptors(this);
        const Accessors = FilterObject(Descriptors, (_, descriptor) => {
            return typeof(descriptor.get) == "function" || typeof(descriptor.set) == "function";
        });
        
        return Accessors;
    }
    //Loops through every accessor within this class and applies the callback function to it
    ForEachAccessor(callback, verifier){
        const Accessors = this.#Accessors;
        for(const accessor in Accessors){
            const value = Accessors[accessor];

            if(!verifier || verifier(accessor, value)){
                callback(accessor, value);
            }
        }
    }
    //Retrieves the getter for the specified accessor if one exist


    //Retrieves the setter for the specified accessor if one exist




    //Retrieves all the properties of this class including all the properties it inherited from other classes
    GetClassProperties(){
        const Properties = GetAllPropertyNames(this, {includeEnumerables: true, includeNonenumerables: false});
        return Properties;
    }
    //Loops through every property within this class and applies the callback function to it
    ForEachProperty(callback, verifier){
        const Properties = this.#Properties;
        for(const property of Properties){
            const value = this[property];

            if(!verifier || verifier(property, value)){
                callback(property, value);
            }
        }
    }
    //Loops through every property within this class and applies the callback function to it if it is of a specific type
    ForEachPropertyOfType(type, callback){
        const verifier = typeof(type) == "string" && ((propType) => (propType == type)) || ((propType) => (type.includes(propType)));
        this.ForEachProperty(callback, (property) => (verifier(this.GetPropertyType(property))));
    }


    //Retrieves the class type of a property within this object if the property's value is an object
    GetPropertyType(property){
        const value = this[property];
        const dataType = typeof(value);

        return (value == null || value == undefined) ? value : dataType != "object" ? dataType : (value.Type || dataType);
    }

    //Retrieves the class reference of a property within this object if the property's value is an object
    GetPropertyClass(property){
        const propType = this.GetPropertyType(property);
        return propType && window[propType];
    }

    //Returns an Udim2 that represents a position relative to the position - size of the gui object. Ex: (.5, .5) => middle of gui.
    GetPositionRelative(xScale, yScale, expanded = false){
        const posVector = this._AbsolutePosition;
        const sizeVector = this._AbsoluteSize;

        const xOffset = lerp(posVector.x, posVector.x + sizeVector.x, xScale);
        const yOffset = lerp(posVector.y, posVector.y + sizeVector.y, yScale); 
        return Udim2.fromOffset(xOffset, yOffset);
    }


    //Returns an Udim2 that represents the absolute dimensions of the specified property on this object, relative to its parent's absolute dimensions
    GetAbsoluteUdim2(property, value = undefined, parent = undefined){
        value = value || this[property].Copy();
        parent = parent || this.Parent;

        
        const parentValue = parent[property];
        

        return value;
    }
    GetAbsoluteDimensions(position = undefined, size = undefined, parent = undefined){
        position = position || this._Position.Copy();
        size = size || this._Size.Copy();
        parent = parent || this.Parent;


        if(parent != null){
            const [parentPos, parentSize, parentAnchorPoint] = [parent._Position.Copy(), parent._Size.Copy(), parent._AnchorPoint];
            if(parentAnchorPoint.x != 0 || parentAnchorPoint.y != 0){
                const xScale = parentSize.x.Mult(parentAnchorPoint.x).Scale;
                const yScale = parentSize.y.Mult(parentAnchorPoint.y).Scale;
                parentPos.Sub(xScale, yScale);
            }
            

            console.log(size.x.Scale + "," + size.y.Scale + " | " + parentSize.x.Scale + "," + parentSize.y.Scale);
            size.Mult(parentSize.x.Scale, parentSize.y.Scale);
            console.log(size.x.Scale + "," + size.y.Scale + " | " + parentSize.x.Scale + "," + parentSize.y.Scale);
            
            const [origin, bound] = [parentPos, parentSize];
            position.ToRelativeUdim2(origin, bound);

            
        }
        

        const newParent = parent && parent.Parent;
        if(newParent){
            [position, size] = this.GetAbsoluteDimensions(position, size, newParent);
        }


        return [position, size];
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
                    This.UpdateDisplay(value == This._Size ? true : false);
                    
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
        this.UpdateDisplay();
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
        this.UpdateDisplay(true);
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












    //
    get Type(){
        return this.constructor.name;
    }




}


