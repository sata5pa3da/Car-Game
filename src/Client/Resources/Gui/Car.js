class Car extends Vehicle{
    //Static variables
    static Type = "Car";
    static VehicleClass = "Cars";
    static CarsList = null;
    

    //Static methods
    static InitCarsList(){
        this.CarsList = {};


        const Cars = this.GetVehicle(this.VehicleClass);

        for(const CarType in Cars){
            const car = Cars[CarType];
            
            car.loadPixels();
    
            let numPixels = 4 * car.width * car.height;
            const threshold = 150;
            const pixels = car.pixels;
            for (let i = 0; i < numPixels; i += 4) {
                const [red, green, blue, alpha] = [pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]];

                
                if(red >= threshold || green >= threshold || blue >= threshold){
                    // Red.
                    pixels[i] = 255;
                    // Green.
                    pixels[i + 1] = 255;
                    // Blue.
                    pixels[i + 2] = 255;
                    // Alpha.
                    pixels[i + 3] = 255;
                }
                
            }
        
            car.updatePixels();
            this.CarsList[CarType] = car;
        }
    }


    static GetCar(CarType, col){
        if(!this.CarsList){this.InitCarsList()}
        
        let carPath = this.CarsList[CarType];
        if(!carPath){
            for(const Type in this.CarsList){
                if(Type.includes(CarType)){
                    carPath = this.CarsList[Type];
                    break;
                }
            }
        }
        
        const CarClone = carPath.get();

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


    //Constructor
    constructor({
        CarType = "Car1.png",
        Color,

    } = {}){
        const src = Car.GetCar(CarType, Color);
        const MetaData = {};
        

        super({...arguments[0], VehicleSource: src, _MetaData_Car: MetaData, _Data_Car: {
            CarType: CarType,
        }});
    }



    //----------------------Methods-------------------------//



    //-------------------Getters/Setters-------------------------
    
}