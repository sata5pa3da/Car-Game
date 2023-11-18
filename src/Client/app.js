//---------------------------App Initialization------------------------------//
const app = {
    //App display properties
    displaySettings: {
        Background: Color.new(),
    },


    //App status properties
    loaded: false,
    processed: false,
    env: {_G:{}},


    //Scene properties
    scenes: ["StartScene", "GameScene"],
    
    registered_scenes: {},
    registered_scenes_amount: 0,


    previous_scene: undefined,
    scene: "StartScene",
    scene_status: "Setup",


    //Scenes data
    uiElements: {},







    //------------Method declaration-------------//

    ///-----App Display Methods-----///
    
    /**Refreshes the whole display*/
    RefreshDisplay: undefined,



    ///-----App Environment Methods-----///

    /**Clears all environment variables in the app, excluding the ones stored in the global space "_G"*/
    ClearEnvironment: undefined,



    ///-----Scenes Properties Methods-----///
    
    /**Registers the callbacks for a specific scene*/
    RegisterScene: undefined,

    /**Sets the current scene of the app*/
    SetScene: undefined,


    ///-----Scenes Control Methods-----///

    /**Returns the scene object for the specified name*/
    GetScene: undefined,

    /**Returns the scene object for the current scene*/
    GetCurrentScene: undefined,


    /**Returns the scene object for the previous scene (if one exists)*/
    GetPreviousScene: undefined,



    ///-----Scenes Data Methods-----///

    /**Retrieves an element with the given id*/
    GetElement: undefined,
    /**Retrieves the element with the given id's object*/
    GetElementObject: undefined,
    /**Loops through all the elements and them to the list to be returned if it meets the criteria given, if any*/
    GetElements: undefined,

    /**Retrieves all the elements with the given tag */
    GetElementsWithTag: undefined,


    /**Adds the ui element(s) provided to the list of ui elements*/
    AddElement: undefined,
    /**Creates ui element(s) for the gui object(s) provided*/
    CreateElement: undefined,
    /**Creates ui element(s) for the gui object(s) provided with the specified tag(s)*/
    CreateElementWithTags: undefined,


    /**Loops through every element and calls the callback function on each of them*/
    ForEachElement: undefined,


    /**Removes the ui element(s)'s names provided from the list*/
    RemoveElement: undefined,
    /**Removes all ui elements from the list*/
    ClearElements: undefined,


    
}   



//---------------------App related functionality----------------------//

//Add Display Methods
app.RefreshDisplay = function(){
    noLoop();

    const displaySettings = app.displaySettings;

    background(displaySettings.Background.Value);

    app.ForEachElement((_, Element) => {
        const obj = Element.Object;
        obj.Update(true);
    });

    loop();
}

 //App Environment Methods
 app.ClearEnvironment = function(){
    const env = app.env;
    for(const key in env){
        if(key != "_G"){
            delete env[key];
        }
    }
 }


//Scenes Properties Methods
app.RegisterScene = function(scene, {Setup, Update, Cleanup, ElementDatas} = {}){
    app.registered_scenes[scene] = {
        Setup: Setup,
        Update: Update,
        Cleanup: Cleanup,

        ElementDatas: ElementDatas, 
    }
    app.registered_scenes_amount ++;
}

app.SetScene = function(newScene, clearEnv = true){
    const oldScene = app.scene;

    app.previous_scene = oldScene;
    app.scene = newScene;

    app.scene_status = "Setup";


    if(clearEnv){
        app.ClearEnvironment();
    }
}


//Scenes Control Methods
app.GetScene = function(SceneName){
    const Scenes = app.registered_scenes;

    return SceneName ? Scenes[SceneName] : Scenes;
}

app.GetCurrentScene = function(){
    return app.GetScene(app.scene);
}

app.GetPreviousScene  = function(){
    const PreviousScene = app.previous_scene;
    return PreviousScene ? app.GetScene(PreviousScene) : null;
}



//Scenes Data Methods
app.GetElement = function(ElementName){
    const Elements = app.uiElements;
    return ElementName ? Elements[ElementName] : Elements;
}

app.GetElementObject = function(ElementName){
    if(ElementName){
        return app.GetElement(ElementName).Object;
    }else{
        const Objects = {};

        const Elements = app.GetElement();
        for(const Name in Elements){
            Objects[Name] = Elements[Name].Object;
        }

        return Objects;
    }
}

app.GetElements = function(Criteria){
    const Elements = app.GetElement();
    const CustomElements = [];

    for(const ElementName in Elements){
        const Element = Elements[ElementName];
        if(!Criteria || Criteria(Element)){
            CustomElements.push(Element);
        }
    }

    return CustomElements;
}


app.GetElementsWithTag = function(...Tags){
    //Converts the Tags array to an object
    Tags = ArrayToObject(Tags);
    
    return app.GetElements((Element) => {
        return Tags[Element.Tag];
    });
}






app.AddElement = function(...NewElements){
    const Elements = app.GetElement();
    // ArrayToObject(NewElements, null, Elements, (_, val) => {return val.Name});
    for(const NewElement of NewElements){
        Elements[NewElement.Name] = NewElement;
    }
}

app.CreateElement = function(...Data){
    // console.log(Data);
    const NewElements = [];

    for(const ElementData of Data){
        //Creating a new instance of the specified class
        const Obj = new (ElementData.Class)(...ElementData.Args);
        Obj.Name = ElementData.Name;
        // console.log(Obj);

        const Tags = (typeof(ElementData.Tags) != "object") ? {[ElementData.Tags]: true} : ArrayToObject(ElementData.Tags, true);

        NewElements.push({
            Name: ElementData.Name,
            Object: Obj,
            Tags: Tags,

        });
    }

    app.AddElement(...NewElements);
    // console.log(app.GetElement());
    return NewElements;
}

app.CreateElementWithTags = function(Tags, ...Data){
    //Converting the tag argument to an array if it is not an array
    Tags = (typeof(Tags) != "object") ? {[Tags]: true} : ArrayToObject(Tags, true);

    //Setting the tag property of the element datas
    for(const ElementData of Data){
        ElementData.Tags = Tags;
    }

    return app.CreateElement(...Data);
}



app.ForEachElement = function(callback, isSync = true){
    let resolve;
    const returnPromise = new Promise((res) => {resolve = res});


    const PendingLoops = 0;

    const Elements = app.GetElement();
    for(const ElementName in Elements){
        if(isSync){
            callback(ElementName, Elements[ElementName]);
        }else{
            PendingLoops++;
            new Promise(() => {
                callback(ElementName, Elements[ElementName]);

                PendingLoops--;
                if(PendingLoops <= 0){
                    resolve();
                }
            });
        }
    }


    if(isSync){
        resolve();
    }
    return returnPromise;
}



app.RemoveElement = function(...ElementNames){
    const Elements = app.GetElement();
    for(const ElementName of ElementNames){
        const Element = Elements[ElementName];
        const Obj = Element.Object;

        Obj.Delete();
        delete Elements[ElementName];
    }
}
app.ClearElements = async function(){
    const ElementNames = [];

    await app.ForEachElement((ElementName) => {ElementNames.push(ElementName)});
    app.RemoveElement(...ElementNames);
}





//----------------------------------Window event detection---------------------------------//
