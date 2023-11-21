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
        Name: "Car",
        Class: Car,
        Tags: "GameScene",
    
    
        Args: [{
            Debug: {
                BorderColor: Color.fromRGB(255, 0, 0),
                BorderWidth: 2,
            },


            Id: "Car1",
            // Class: "",
    
            AnchorPoint: [.5, 1],
            Position: Udim2.fromScale(1/4, 1),
            // Size: Udim2.fromScale(.5, .1),
            scale: .2,
    
            // CarType: "Car1",
            Color: Color.fromRGB(255, 0, 0),
        }],  
    },

   

];






async function GameSceneSetup(env, _G){
    const Road = app.GetElementObject("Road");
    const Car = app.GetElementObject("Car");


    env.TotalLanes = Road.GetLanes();
    env.CurrentLane = 2;

    env.CanUpdate = true;


    //Local methods
    async function Update(direction){
        if(!env.CanUpdate){return}
        env.CanUpdate = false;

        const newLane = direction ? constrain(env.CurrentLane + direction, 1, env.TotalLanes) : env.CurrentLane;
        if(!direction || newLane != env.CurrentLane){
            env.CurrentLane = newLane;

            const lanePosition = Road.GetLanePosition(env.CurrentLane);
            
            const newPosition = Udim2.toScale(lanePosition.x, Car.AbsoluteAnchorPosition.y);

            if(direction){
                const posTween = Car.CreateTween(Car.Position, newPosition, .1, "easeInQuart");
                await Car.WaitForTweens(posTween);
            }else{
                Car.Position = newPosition;
            }
            
        }

        env.CanUpdate = true;
    }


    //Events declaration
    const OnLeftEvent = EventHandler.keyPressed(["a", LEFT_ARROW], (event) => {Update(-1);});
    const OnRightEvent = EventHandler.keyPressed(["d", RIGHT_ARROW], (event) => {Update(1)});


    //Setup
    const LaneSize = Road.GetLaneSize();
    console.log(LaneSize);
    Car.Resize(LaneSize);
    Update();
}   

async function GameSceneUpdate(env, _G){

}

async function GameSceneCleanup(env, _G){

}

app.RegisterScene("GameScene", {
    Setup: GameSceneSetup,
    Update: GameSceneUpdate,
    Cleanup: GameSceneCleanup,


    ElementDatas: GameSceneElements,

});