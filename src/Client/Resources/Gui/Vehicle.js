class Vehicle extends Img{
    //Static variables
    static Type = "Vehicle";
    static VehiclesList = null;
    

    //Static methods
    static InitVehiclesList(){
        this.VehiclesList = {};


        const VehiclesPath = GetKeysWithPrefix(ASSETS, "Vehicles");
        for(const VehiclePath of VehiclesPath){
            const Paths = VehiclePath.split("/").filter((_, index, arr) => index != 0);


            let curDirectory = this.VehiclesList;
            //Looping through the individual path in the list of paths for this specific vehicle
            for(const Path of Paths){
                const isDirectory = !Path.includes(".");

                if(isDirectory){
                    let directory = curDirectory[Path];
                    if(!directory){
                        curDirectory[Path] = {};
                        directory = curDirectory[Path];
                    }
                    
                    curDirectory = directory;
                }else{
                    const Vehicle = ASSETS[VehiclePath];
                    curDirectory[Path] = Vehicle;
                }

            }
        }


       
    }




    static GetVehicle(VehicleClass, VehicleName){
        if(!this.VehiclesList){this.InitVehiclesList()}
        
        const VehicleType = this.VehiclesList[VehicleClass];
        return (VehicleName ? VehicleType[VehicleName] : VehicleType);
    }


    //Constructor
    constructor({
        VehicleType,
        VehicleName,
        VehicleSource,

        Acceleration,
        Velocity,
    } = {}){
        const src = VehicleSource || Vehicle.GetVehicle(VehicleType, VehicleName);
        const MetaData = {};

        super({...arguments[0], src: src, _MetaData_Vehicle: MetaData, _Data_Vehicle: {
            VehicleType: VehicleType,
            VehicleName: VehicleName,
            VehicleId: GetAssetName(VehicleName),
        }});



        //
        this.Acceleration = Acceleration || createVector(0,0);
        this.Velocity = Velocity || createVector(0,0);
    }



    //----------------------Methods-------------------------//
    ApplyForce(force){
        this.Acceleration.add(force);
    }

    UpdatePhysics(){
        this.Velocity.add(this.Acceleration);
        this.Position = this.Position.Add(Udim2.fromOffset(this.Velocity.x, this.Velocity.y));


    }



    //-------------------Getters/Setters-------------------------
    get VehicleSize(){
        const Vehicle = this.GetObject();
        return [Vehicle.width, Vehicle.height];
    }
    
}



// Vehicle.InitVehiclesList();
// let abc = new Vehicle({VehicleType: "Cars", VehicleName: "Car1.png"});