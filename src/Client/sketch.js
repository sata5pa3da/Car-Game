// Global
let canvas;


/**This function is used to individually load an asset on the client*/
function LoadAsset(asset){
    let resolve;
    const LoadPromise = new Promise((res) => {
        resolve = res;
    });


    loadImage("Assets/" + asset, (img) => {
        resolve(img);
    });


    return LoadPromise;
}

/**This function is used to loop through all the assets on the client and call the appropriate method to load them (images) */
async function LoadAssets(){
    //Loading all the client's assets
    for(const asset in ASSETS){
        ASSETS[asset] = await LoadAsset(asset);
    }
}
let myB;
async function setup(){
    //Loading stuff
    await LoadAssets();

    
    //Main setup
    canvas = createCanvas(...CalculateWindowSize());
    canvas.position(0,0);
    background(0);

    
    
    app.loaded = true;


    const testElement = {
        //
        Name: "Button2",
        Class: Button,
        Tags: "MainScreen",
    
    
        Args: [{
           // Position: 1,
           Id: "Label",
           Class: "Img",
    
        //    src: "img2.png",

           // scaleType: "Stretch",

           AnchorPoint: createVector(.5, .5),
           Position: Udim2.fromScale(.5, .5),
           Size: Udim2.fromScale(0.25, 0.25),
    
           // AnchorPoint: createVector(.5, .5),
           Text: "Hello", 
           TextScaled: true,
        }],
    
    
    }
   

}

async function draw(){
    if(!app.loaded || (app.registered_scenes_amount < app.scenes.length)){return}

    if(app.processed){return}
    app.processed = true;


    const scene_status = app.scene_status;
    const Scene = app.GetCurrentScene();

    const env = app.env;

    if(scene_status == "Setup"){
        app.CreateElement(...(Scene.ElementDatas));
        await Scene.Setup(env, env["_G"]);

        app.scene_status = "Update";
    }else if(scene_status == "Update"){
        const Elements = app.GetElement();
        for(const key in Elements){
            const Element = Elements[key];

            const obj = Element.Object;
            const requiresRefresh = obj.GetMetaData("__requiresRefresh");
            if(requiresRefresh){
                obj.Display();
            }
        }

        if(Scene && Scene.Update){
            await Scene.Update(env, env["_G"]);
        }else{
            noLoop();
        }
        
    }
   
    
    app.processed = false;
}

//-----------------Canvas Related Update Methods-------------------//
function windowResized() {
    resizeCanvas(...CalculateWindowSize());
    // myButton.Update(true);
    app.RefreshDisplay();
}

function CalculateWindowSize(){
    widthScale = .999;
    heightScale = .999;

    return [windowWidth * widthScale, windowHeight * heightScale];
}




// //---------------------App related functionality----------------------//

// //Add Display Methods
// app.RefreshDisplay = function(){
//     noLoop();

//     const displaySettings = app.displaySettings;

//     background(displaySettings.Background.Value);

//     app.ForEachElement((_, Element) => {
//         const obj = Element.Object;
//         obj.Update(true);
//     });

//     loop();
// }


// //Scenes Properties Methods
// app.RegisterScene = function(scene, Setup, Update, Cleanup){
//     app.registered_scenes[scene] = {
//         Setup: Setup,
//         Update: Update,
//         Cleanup: Cleanup,
//     }
//     app.registered_scenes_amount ++;
// }


// //Scenes Data Methods
// app.GetElement = function(ElementName){
//     const Elements = app.uiElements;
//     return ElementName ? Elements[ElementName] : Elements;
// }

// app.GetElements = function(Criteria){
//     const Elements = app.GetElement();
//     const CustomElements = [];

//     for(const ElementName in Elements){
//         const Element = Elements[ElementName];
//         if(!Criteria || Criteria(Element)){
//             CustomElements.push(Element);
//         }
//     }

//     return CustomElements;
// }


// app.GetElementsWithTag = function(...Tags){
//     //Converts the Tags array to an object
//     Tags = ArrayToObject(Tags);
    
//     return app.GetElements((Element) => {
//         return Tags[Element.Tag];
//     });
// }





// function clone(obj){
//     const newObj = {};
//     for(const key in obj){
//         newObj[key] = obj[key];
//     }
//     return newObj;
// }

// app.AddElement = function(...NewElements){
//     const Elements = app.GetElement();
//     ArrayToObject(NewElements, null, Elements, (_, val) => {return val.Name});
// }

// app.CreateElement = function(...Data){
//     const NewElements = [];

//     for(const ElementData of Data){
//         //Creating a new instance of the specified class
//         const Obj = new (ElementData.Class)(...ElementData.Args);
//         const Tags = (typeof(ElementData.Tags) != "object") ? {[ElementData.Tags]: true} : ArrayToObject(ElementData.Tags, true);

//         NewElements.push({
//             Name: ElementData.Name,
//             Object: Obj,
//             Tags: Tags,

//         });
//     }

//     app.AddElement(...NewElements);
//     return NewElements;
// }

// app.CreateElementWithTags = function(Tags, ...Data){
//     //Converting the tag argument to an array if it is not an array
//     Tags = (typeof(Tags) != "object") ? {[Tags]: true} : ArrayToObject(Tags, true);

//     //Setting the tag property of the element datas
//     for(const ElementData of Data){
//         ElementData.Tags = Tags;
//     }

//     return app.CreateElement(...Data);
// }



// app.ForEachElement = function(callback, isSync = true){
//     let resolve;
//     const returnPromise = new Promise((res) => {resolve = res});


//     const PendingLoops = 0;

//     const Elements = app.GetElement();
//     for(const ElementName in Elements){
//         if(isSync){
//             callback(ElementName, Elements[ElementName]);
//         }else{
//             PendingLoops++;
//             new Promise(() => {
//                 callback(ElementName, Elements[ElementName]);

//                 PendingLoops--;
//                 if(PendingLoops <= 0){
//                     resolve();
//                 }
//             });
//         }
//     }


//     if(isSync){
//         resolve();
//     }
//     return returnPromise;
// }



// app.RemoveElement = function(...ElementNames){
//     for(const ElementName of ElementNames){
//         const Element = app.GetElement(ElementName);
//         const Obj = Element.Obj;

//         Obj.Delete();
//     }
// }

// app.ClearElements = async function(){
//     const ElementNames = [];

//     await app.ForEachElement((ElementName) => {ElementNames.push(ElementName)});
//     app.RemoveElement(...ElementNames);
// }


