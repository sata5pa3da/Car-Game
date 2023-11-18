const GameSceneElements = [
    // {
    //     //
    //     Name: "Button2",
    //     Class: Button,
    //     Tags: "GameScene",
    
    
    //     Args: [{
    //        Id: "Label",
    //        Class: "GameSceneButtons",
    
    //        AnchorPoint: [.5, .5],
    //        Position: Udim2.fromScale(.5, .5),
    //        Size: Udim2.fromScale(.5, .1),
    
    //        Text: "Play", 
    //        TextScaled: true,
    //     }],
    
    // },

    // {
    //       //
    //       Name: "TextLabel",
    //       Class: TextLabel,
    //       Tags: "GameScene",
      
      
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

    {
        Name: "Road1",
        Class: Road,
        Tags: "Roads",

        Args: [
            {
                Size: Udim2.fromScale(.95,1),
                Position: Udim2.fromScale(.5, .5),
                AnchorPoint: [.5, .5],

                data: [
                    {
                        type: "Solid",
                        color: Color.fromRGB(255, 255, 0),

                    },
                    {
                        type: "Dashed",
                        color: Color.fromRGB(255, 255, 0),
                        _meta: {
                            scale: 0.8,
                            amount: 5,
                        }
                    },

                    {
                        type: "Dashed",
                        color: Color.fromRGB(255, 255, 0),
                        _meta: {
                            scale: 0.8,
                            amount: 5,
                        }
                    },


                    {
                        type: "Solid",
                        color: Color.fromRGB(255, 255, 0),
                    },
                    // {
                    //     type: "Solid",
                    //     color: Color.fromRGB(255, 255, 0),
                    // },
                ],

                totalScale: 0.085,
                direction: "x",
            }
        ],

    },



    // {
    //     Name: "Car1",
    //     Class: Car,
    //     Tags: "GameScene",
    
    
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
    //     Tags: "GameScene",
    
    
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


async function GameSceneSetup(env, _G){
    // console.log("Setup!");
    const Event = EventHandler.keyPressed(["a", "w"], (event) => {
        console.log("Yess!", event);
    });

    // Do(Event);
}

async function GameSceneUpdate(env, _G){

}

async function GameSceneCleanup(){

}

app.RegisterScene("GameScene", {
    Setup: GameSceneSetup,
    Update: GameSceneUpdate,
    Cleanup: GameSceneCleanup,


    ElementDatas: GameSceneElements,

});