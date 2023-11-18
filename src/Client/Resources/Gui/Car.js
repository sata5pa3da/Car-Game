class Car extends Img{
    //Static variables
    static Type = "Car";
    static CarsList = null;
    

    //Static methods
    static InitCarsList(){
        Car.CarsList = {};

        const Cars = GetKeysWithPrefix(ASSETS, "Cars");
        for(const CarType of Cars){
            const car_obj = ASSETS[CarType];


            car_obj.loadPixels();
    
            let numPixels = 4 * car_obj.width * car_obj.height;
            const threshold = 150;
            const pixels = car_obj.pixels;
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
        
            car_obj.updatePixels();
            Car.CarsList[GetAssetName(CarType)] = car_obj;
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


    //Constructor
    constructor({
        CarType = "Car1",
        Color,

    } = {}){
        const src = Car.GetCar(CarType, Color);
        const MetaData = {};

        super({...arguments[0], src: src, AdditionalMetaData: MetaData, AdditionalData: {
            CarType: CarType,
        }});
    }



    //----------------------Methods-------------------------//



    //-------------------Getters/Setters-------------------------
    get Type(){
        return Car.Type;
    }


    get CarSize(){
        const car = this.GetObject();
        return [car.width, car.height];
    }
    
}