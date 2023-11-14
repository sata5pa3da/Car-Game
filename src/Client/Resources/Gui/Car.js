class Car extends GuiObject{
    //Static variables
    static Type = "Car";
    static CarsList = undefined;
    

    //Static methods
    static InitCarsList(){
        Car.CarsList = {};

        const Cars = GetKeysWithPrefix(ASSETS, "Cars");
        for(const CarName of Cars){
            const car_obj = ASSETS[CarName];


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
            Car.CarsList[GetAssetName(CarName)] = car_obj;
        }
    

    
    }


    static GetCar(carName, col){
        if(!Car.CarsList){Car.InitCarsList()}

        const carClone = Car.CarsList[carName].get();

        if(col){
            carClone.loadPixels();

            let numPixels = 4 * carClone.width * carClone.height;
            const pixels = carClone.pixels;
            
            for (let i = 0; i < numPixels; i += 4) {
                const [red, green, blue] = [pixels[i], pixels[i+1], pixels[i+2]];  //pixels[i+3]];

                
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

            carClone.updatePixels();
        }

        return carClone;
    }


    //Constructor
    constructor({
        CarType = "Car1",
        Color,

        scaleType = "Fit",
    } = {}){
        super(arguments[0]);


        //Initializing the properties specific to the car itself
        this.CarType = CarType;
        this.src = "Cars/" + this.CarType + ".png";

        this.scaleType = scaleType;
        
        

        //Creating the car itself
        const _Car = Car.GetCar(this.CarType, Color); //new Car({...arguments[0], src: this.src}) //createCar(this.src, this.alt);
        this.Car = _Car;

       


        //Initializing the metadata for the object
        const MetaData = {
            __object: this.Car,
            __isCustomElement: true,
            __requiresRefresh: true,
        };
        this.MetaData = MetaData;



        //Setting up the car
        this.Setup();
        

        //Settings the size of this car object to the width and height of the actual car image if no size argument was passed in 
        if(this.Size.Magnitude <= 0){
            this.Size = Udim2.toScale(this.Car.width, this.Car.height);
        }

    }



    //----------------------Methods-------------------------//
    Display(){
        if(!this.Visible || !this.CanDisplay){return}
        
        
        const [position, size] = [this._AbsolutePosition, this._AbsoluteSize];
         
        switch(this.scaleType){
            case "Fit":
                const [carWidth, carHeight] = this.CarSize;
                const carRatio = carWidth / carHeight;

                let absCarWidth, absCarHeight;
                if(carWidth > carHeight){
                    absCarWidth = min(size.x, size.y * carRatio);
                    absCarHeight = absCarWidth / carRatio;
                }else{
                    absCarHeight = min(size.y, size.x / carRatio);
                    absCarWidth = absCarHeight * carRatio;
                }
                
                
                const absX = position.x + (size.x - absCarWidth) / 2;
                const absY = position.y + (size.y - absCarHeight) / 2;
                
                

                image(this.Car, absX, absY, absCarWidth, absCarHeight);      
                break;


            case "Stretch":
                image(this.Car, position.x, position.y, size.x, size.y);
                break;
        }

        // push();
        // noFill();
        // // fill(color(255,0,0));
        // strokeWeight(3);
        // stroke(color(255, 0, 0));

        // rect(position.x, position.y, size.x, size.y);
        // pop();
    }

    Resize(w, h){
        const obj = this.GetObject();
        obj.resize(w, h);

        this.Size = Udim2.toScale(obj.width, obj.height);
    }

    Scale(widthScale, heightScale){
        heightScale = heightScale ? heightScale : widthScale;

        const obj = this.GetObject();

        const size = this.Size;
        this.Size = Udim2.new(size.x.Scale * widthScale, size.x.Offset * widthScale, size.y.Scale * heightScale, size.y.Offset * heightScale);
    }

    MoveTo(){

    }


    //-------------------Getters/Setters-------------------------
    get Type(){
        return Img.Type;
    }


    get CarSize(){
        const car = this.GetObject();
        return [car.width, car.height];
    }
    
}