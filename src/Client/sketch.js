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
        background(app.displaySettings.Background.Value);


        const Elements = app.GetElement();
        // console.log(Elements);
        for(const key in Elements){
            const Element = Elements[key];

            const obj = Element.Object;
            const requiresRefresh = obj.GetMetaData("__requiresRefresh");
            // console.log(requiresRefresh);

            obj.DefaultDisplay();
            if(requiresRefresh){
                const elementPath = obj.GetMetaData("__elementPath");
                if(elementPath){
                    const elementObj = StringToPath(obj, elementPath);
                    elementObj.Display();
                }else{
                    obj.Display();
                }
                
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


