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


    static GetCar(CarType, col){
        if(!Car.CarsList){Car.InitCarsList()}
        const CarClone = Car.CarsList[CarType].get();

        if(col){
            CarClone.loadPixels();

            let numPixels = 4 * CarClone.width * CarClone.height;
            const pixels = CarClone.pixels;
            
            for (let i = 0; i < numPixels; i += 4) {
                const [red, green, blue] = [pixels[i], pixels[i+1], pixels[i+2]];
  
                if(red == 255 || green == 255 || blue == 255){
                    // Red.
                    pixels[i] = col.R * 255;
                    // Green.
                    pixels[i + 1] = col.G * 255;
                    // Blue.
                    pixels[i + 2] = col.B * 255;
                    // Alpha.
                    pixels[i + 3] = 255;
                }
            }

            CarClone.updatePixels();
        }

        return CarClone;
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
    } = {}){
        const src = VehicleSource || Vehicle.GetVehicle(VehicleType, VehicleName);
        const MetaData = {};

        super({...arguments[0], src: src, _MetaData_Vehicle: MetaData, _Data_Vehicle: {
            VehicleType: VehicleType,
            VehicleName: VehicleName,
        }});
    }



    //----------------------Methods-------------------------//



    //-------------------Getters/Setters-------------------------
    get VehicleSize(){
        const Vehicle = this.GetObject();
        return [Vehicle.width, Vehicle.height];
    }
    
}



// Vehicle.InitVehiclesList();
// let abc = new Vehicle({VehicleType: "Cars", VehicleName: "Car1.png"});