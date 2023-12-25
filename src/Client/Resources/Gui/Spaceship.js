class Spaceship extends Vehicle{
    //Static variables
    static Type = "Spaceship";
    static VehicleClass = "Spaceships";
    static SpaceshipsList = null;
    

    static Configs = {
        Ship1: {
            Spawns:[
                {
                    Position: [.5, 0],
                },

                // {
                //     Position: [1, 0],
                // },
            ],

            /**The amount of specified projectile to be fired*/
            Ammo: 1,
            /**The rate (in seconds) at which a projectile is fired after the previous one*/
            Rate: 1,
            /**The damage that each bullet deals*/
            Damage: 10,
            /**The speed at which the projectile(s) travels (in pixels)*/
            Speed: 2,

            /**The type of projectile that will be spawn */
            ProjectileType: "Fireball",
            /**The scale of the projectile */
            ProjectileScale: .1,
        },
    }



    //Static methods
    static InitSpaceshipsList(){
        this.SpaceshipsList = {};


        const Spaceships = this.GetVehicle(this.VehicleClass);

        for(const SpaceshipType in Spaceships){
            const spaceship = Spaceships[SpaceshipType];
            this.SpaceshipsList[SpaceshipType] = spaceship;
        }
    }


    static GetSpaceship(SpaceshipType){
        if(!this.SpaceshipsList){this.InitSpaceshipsList()}
        
        let spaceshipPath = this.SpaceshipsList[SpaceshipType];
        if(!spaceshipPath){
            for(const Type in this.SpaceshipsList){
                if(Type.includes(SpaceshipType)){
                    spaceshipPath = this.SpaceshipsList[Type];
                    break;
                }
            }
        }
        
        const SpaceshipClone = spaceshipPath.get();
        return SpaceshipClone;
    }


    static GetSpaceshipConfig(SpaceshipType){
        const SpaceshipName = GetAssetName(SpaceshipType);
        return this.Configs[SpaceshipName];
    }


    //Constructor
    constructor({
        SpaceshipType = "Ship1",

    } = {}){
        const src = Spaceship.GetSpaceship(SpaceshipType);
        const MetaData = {};
        

        super({...arguments[0], VehicleName: SpaceshipType, VehicleSource: src, _MetaData_Spaceship: MetaData});


        this.Projectiles = [];
    }



    //----------------------Methods-------------------------//
    _Update_Spaceship(){
        // this.UpdatePhysics();

        for(const projectile of this.Projectiles){
            // noLoop();
            // if(true){return}

            projectile.DefaultDisplay();
            projectile.CustomDisplays();

            
        }
    }

    async SpawnProjectile(){
        const Config = Spaceship.GetSpaceshipConfig(this.VehicleName);


        for(let index = 0; index < Config.Ammo; index++){
            
            for(const Spawn of Config.Spawns){
                const SpawnPosition = Spawn.Position;
                const DisplayPosition = this.GetPositionRelative(...SpawnPosition);

                const Velocity = createVector(0, -Config.Speed);
                const ProjectileType = Config.ProjectileType;
                const ProjectileScale = Config.ProjectileScale;
                const NewProjectile = new Projectile({
                    Debug: {
                        BorderWidth: 2,
                        BorderColor: Color.fromRGB(255, 255, 255),
                    },


                    Position: DisplayPosition,

                    ProjectileType: ProjectileType,
                    Velocity: Velocity,
                    Acceleration: createVector(0, -1),

                    scale: ProjectileScale,
                    AnchorPoint: [.5, 1],


                });

                this.Projectiles.push(NewProjectile);
                console.log("Spawned");

            }

            await wait(Config.Rate);
        }
    }


    //-------------------Getters/Setters-------------------------
    
}

function FindStuff(stuff, tracker = ""){
    for(const key in stuff){
        const val = stuff[key];
        const val_type = typeof(val);

        tracker += (tracker == "" && "" || ".") + key;
        if(key == "Udim2" || val == Udim2){
            console.log(`Found Udim2 at ${tracker}`);
        }else if(val_type == "object" && val != null){
            try {
                FindStuff(val, tracker);
            } catch (error) {
                console.log(`Error occured for key ${error}.\n ${tracker}.${key}`);
            }
        }
        
    }
}
