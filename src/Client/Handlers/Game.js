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
        Name: "Road",
        Class: Road,
        Tags: "Roads",

        Args: [
            {
                Visible: false,
                Size: Udim2.fromScale(.7,1),
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



    {
        Name: "Spaceship",
        Class: Spaceship,
        Tags: "GameScene",
    
    
        Args: [{
            Debug: {
                BorderColor: Color.fromRGB(255, 0, 0),
                BorderWidth: 2,
            },


            Id: "Ship1",
            // Class: "",
    
            AnchorPoint: [.5, 1],
            Position: Udim2.fromScale(1/4, 1),
            // Size: Udim2.fromScale(.5, .1),
            scale: .045,
    
            // CarType: "Car1",
            // Color: Color.fromRGB(255, 0, 0),
        }],  
    },

   

];









async function GameSceneSetup(env, _G){
    const Spaceship = app.GetElementObject("Spaceship");


    env.Speed = 35;
    


    //Events declaration
    // const OnLeftEvent = EventHandler.keyPressed(["a", LEFT_ARROW], (event) => {Update(-1);});
    // const OnRightEvent = EventHandler.keyPressed(["d", RIGHT_ARROW], (event) => {Update(1)});


    //Setup
    EventHandler.keyPressed([" "], () => {
        Spaceship.SpawnProjectile();
    });

} 

async function GameSceneUpdate(env, _G){
    let dir = 0;
    if(EventHandler.keyIsDown(["a", LEFT_ARROW])){dir--}
    if(EventHandler.keyIsDown(["d", RIGHT_ARROW])){dir++}

    const Spaceship = app.GetElementObject("Spaceship");


    if(dir){
        const {AbsolutePosition, AbsoluteSize} = Spaceship;
        const speed = (dir == -1 && Math.min(AbsolutePosition.x, env.Speed)) || Math.min(width - (AbsolutePosition.x + AbsoluteSize.x), env.Speed);

        Spaceship.Position.Add(Udim2.fromOffset(dir * speed));
    }
}

async function GameSceneCleanup(env, _G){

}

app.RegisterScene("GameScene", {
    Setup: GameSceneSetup,
    Update: GameSceneUpdate,
    Cleanup: GameSceneCleanup,


    ElementDatas: GameSceneElements,
});