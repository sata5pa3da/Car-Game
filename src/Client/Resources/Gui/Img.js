class Img extends GuiObject{
    //Static Variables
    static Type = "Img";

    

    //Static Methods
    static GetImage(src){
        
        const newImage = ASSETS[src].get();
        return newImage;
    }


    //Constructor Method
    constructor({
            src = "",
            alt = "",
            
            scaleType = "Fit",

        } = {}){
        super(arguments[0]);

        

        //Initializing the status variables
        // this.Displaying = false;
            

        //Initializing the properties specific to the image itself
        this.src = src;
        this.alt = alt;
        
        this.scaleType = scaleType;



        //Creating the image itself
        const _Img =  Img.GetImage(this.src); //createImg(this.src, this.alt);
        this.Img = _Img;

       


        //Initializing the metadata for the object
        const MetaData = {
            __object: _Img,
            __isCustomElement: true,
            __requiresRefresh: true,
        };
        this.MetaData = MetaData;



        //Setting up the image
        this.Setup();
        

        //Settings the size of this image object to the width and height of the actual image if no size argument was passed in 
        if(this.Size.Magnitude <= 0){
            this.Size = Udim2.toScale(this.Img.width, this.Img.height);
        }
        
    }



    //------------------------Methods-------------------------//
    Display(){
        if(!this.Visible || !this.CanDisplay){return}
        
        
        const [position, size] = [this._AbsolutePosition, this._AbsoluteSize];
         
        switch(this.scaleType){
            case "Fit":
                const [imgWidth, imgHeight] = this.ImageSize;
                const imgRatio = imgWidth / imgHeight;

                let absImgWidth, absImgHeight;
                if(imgWidth > imgHeight){
                    absImgWidth = min(size.x, size.y * imgRatio);
                    absImgHeight = absImgWidth / imgRatio;
                }else{
                    absImgHeight = min(size.y, size.x / imgRatio);
                    absImgWidth = absImgHeight * imgRatio;
                }
                
                
                const absX = position.x + (size.x - absImgWidth) / 2;
                const absY = position.y + (size.y - absImgHeight) / 2;
                
                

                image(this.Img, absX, absY, absImgWidth, absImgHeight);      
                break;


            case "Stretch":
                image(this.Img, position.x, position.y, size.x, size.y);
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


    //-------------------Getters/Setters-------------------------
    get Type(){
        return Img.Type;
    }


    get ImageSize(){
        const img = this.GetObject();
        return [img.width, img.height];
    }
    
    
}