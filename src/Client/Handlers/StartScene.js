const StartSceneElements = [
    {
        //
        Name: "Button2",
        Class: Button,
        Tags: "StartScene",
    
    
        Args: [{
           Id: "Label",
           Class: "StartSceneButtons",
    
           AnchorPoint: [.5, .5],
           Position: Udim2.fromScale(.5, .5),
           Size: Udim2.fromScale(.5, .1),
    
           Text: "Play", 
           TextScaled: true,
        }],
    
    },

    // {
    //       //
    //       Name: "TextLabel",
    //       Class: TextLabel,
    //       Tags: "StartScene",
      
      
    //       Args: [{
    //         // Id: "Label3",
    //         Class: "trainLabel",

    //         AnchorPoint: [.5, .5],
    //         Position: Udim2.fromScale(.5, .5),
    //         Size: Udim2.fromScale(.5, .1),
    
    //         Text: "Hello World", 
    //         // TextScaled: true,
    //       }],
    // },

    // {
    //     Name: "Road1",
    //     Class: Road,
    //     Tags: "Roads",

    //     Args: [
    //         {
    //             Size: Udim2.fromScale(.35,.5),
    //             Position: Udim2.fromScale(.5, .5),
    //             AnchorPoint: [.5, .5],

    //             data: [
    //                 {
    //                     type: "Solid",
    //                     color: Color.fromRGB(255, 255, 0),

    //                 },
    //                 {
    //                     type: "Dashed",
    //                     color: Color.fromRGB(255, 255, 0),
    //                     _meta: {
    //                         scale: 0.8,
    //                         amount: 5,
    //                     }
    //                 },
    //                 {
    //                     type: "Solid",
    //                     color: Color.fromRGB(255, 255, 0),
    //                 },
    //                 // {
    //                 //     type: "Solid",
    //                 //     color: Color.fromRGB(255, 255, 0),
    //                 // },
    //             ],

    //             totalScale: 0.17,
    //             direction: "x",
    //         }
    //     ],

    // },



    // {
    //     Name: "Car1",
    //     Class: Car,
    //     Tags: "StartScene",
    
    
    //     Args: [{
    //        Id: "Car1",
    //     //    Class: "",
    
    //        AnchorPoint: [.5, .5],
    //        Position: Udim2.fromScale(.58, .25),
    //        Size: Udim2.fromScale(.5, .1),
    
    //     //    Text: "Play", 
    //     //    TextScaled: true,
    //         // CarType: "Car1",
    //         Color: Color.fromRGB(255, 0, 0),
    //     }],  
    // },

    // {
    //     Name: "Ped1",
    //     Class: Pedestrian,
    //     Tags: "StartScene",
    
    
    //     Args: [{
    //         Id: "Ped1",
    //     //    Class: "",
    
    //         AnchorPoint: [.5, .5],
    //         Position: Udim2.fromScale(.75, .5), //() => {return Udim2.toScale(100, 100)},
    //         Size: Udim2.fromScale(.15,.5), //() => {return Udim2.toScale(100, 100)},
    
    //         data: {
    //             root: {
    //                 scale: [.35, .2],
    //             },

    //             head: {
    //                 scale: [0.5, .15],
    //                 offset: 0.01,
    //             },

    //             arms: {
    //                 scale: [0.22, 0.4],
    //                 offset: 0.02,

    //             },

    //             legs: {
    //                 scale: [.22, .4],
    //                 offset: 0.015,
    //             },

    //         },
    //         Color: Color.fromRGB(255, 0, 0),
    //     }],   
    // },

];

async function StartSceneSetup(env, _G){
    const myB = app.GetElementObject("Button2");
    const myB_elt = myB.GetObject();
    

   
    env.CanClickPlay = true;
    // console.log(myB);
    myB_elt.mousePressed((async () => {
        if(!env.CanClickPlay){console.log("Cannot click play!"); return}
        env.CanClickPlay = false;

        const buttonPos = myB_elt.position();
        // const customArr = {x: {x: {x: buttonPos.x}}, y:0};
        const posTween = myB.CreateTween(myB.Position, Udim2.fromScale(myB.Position.x.Scale, -myB.Size.y.Scale*2), .25, "easeInQuart");
        const sizeTween = myB.CreateTween(myB.Size, Udim2.zero, .25, "easeInQuart");
        
        await myB.WaitForTweens(posTween, sizeTween);
        app.RemoveElement(myB.Name);
        app.SetScene("GameScene");
    }));
}

async function StartSceneUpdate(){

}

async function StartSceneCleanup(){

}

app.RegisterScene("StartScene", {
    Setup: StartSceneSetup,
    Update: StartSceneUpdate,
    Cleanup: StartSceneCleanup,


    ElementDatas: StartSceneElements,

});