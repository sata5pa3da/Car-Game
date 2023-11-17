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
            scale = 1,


            AdditionalMetaData = {},
            AdditionalData = {},
        } = {}){
        const args = arguments[0];
        super(arguments[0]);


        //Initializing the properties specific to the image itself
        this.src = src;
        this.alt = alt;
        
        this.scaleType = scaleType;



        //Creating the image itself
        const _Img = typeof(this.src) == "string" ? Img.GetImage(this.src) : this.src;
        this.Img = _Img;

       


        //Initializing the metadata for the object
        const MetaData = {
            __object: _Img,
            __isCustomElement: true,
            __requiresRefresh: true,
        };
        this.MetaData = {...MetaData, ...AdditionalMetaData};


        //Initializing any additional data
        for(const key in AdditionalData){
            this[key] = AdditionalData[key];
        }


        //Setting up the image
        this.Setup();
        

        //Settings the size of this image object to the width and height of the actual image if no size argument was passed in 
        if(this.Size.Magnitude <= 0){
            this.Size = Udim2.toScale(this.Img.width, this.Img.height);
        }

        //Scaling the image to the desired scale
        scale = typeof(scale) == "number" ? [scale] : scale;
        this.Scale(...scale);

        if(args["Visible"] != false){this.Visible = true}
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