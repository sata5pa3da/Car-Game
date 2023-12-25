class Projectile extends Vehicle{
    //Static variables
    static Type = "Projectile";
    static VehicleClass = "Projectiles";
    static ProjectilesList = null;
    



    //Static methods
    static InitProjectilesList(){
        this.ProjectilesList = {};


        const Projectiles = this.GetVehicle(this.VehicleClass);

        for(const ProjectileType in Projectiles){
            const projectile = Projectiles[ProjectileType];
            this.ProjectilesList[ProjectileType] = projectile;
        }
    }


    static GetProjectile(ProjectileType){
        if(!this.ProjectilesList){this.InitProjectilesList()}
        
        let projectilePath = this.ProjectilesList[ProjectileType];
        if(!projectilePath){
            for(const Type in this.ProjectilesList){
                if(Type.includes(ProjectileType)){
                    projectilePath = this.ProjectilesList[Type];
                    break;
                }
            }
        }
        
        const ProjectileClone = projectilePath.get();
        return ProjectileClone;
    }


    //Constructor
    constructor({
        ProjectileType = "Fireball",

    } = {}){
        const Args = arguments[0];



        const src = Projectile.GetProjectile(ProjectileType, Color);
        const MetaData = {};


        const AdditionArgs = {};
        
        // const Position = Args.Position || Udim2.new();
        // AdditionArgs.Goal = ()
        

        super({...Args, ...AdditionArgs, VehicleName: ProjectileType, VehicleSource: src, _MetaData_Projectile: MetaData});


        this.ProjectileType = ProjectileType;
    }



    //----------------------Methods-------------------------//
    _Update_Projectile(){
        this.UpdatePhysics();
        this.Display();
    }



    //-------------------Getters/Setters-------------------------
    
}