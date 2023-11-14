class Road extends GuiObject{
    //Static Variables
    static Type = "Road";



    //Constructor Method
    
    //Types: "None" | "Solid" | "Dashed"
    //Amount: number
    //t


    //Solid:
    //Dashed:
        //scale
    

    constructor({
        data = [{
            type = "None", 
            amount = 1,
            color,
            _meta = {
                //Dashed
                scale: undefined,
                amount: 2,
            }
        } = {}],

        totalScale,
        direction = "x",
        
    } = {}){
        super(arguments[0]);
        

        //Initializing the properties specific to the road itself
        this.data = data;
        this.totalScale = totalScale;
        this.direction = direction;


        //Creating the road wrapper object
        const _Road = {}
        this.Road = _Road;


        //Initializing the metadata for the object
        const MetaData = {
            __object: this.Road,
            __isCustomElement: true,
            __requiresRefresh: true,
        };
        this.MetaData = MetaData;



        //Setting up the button
        this.Setup();
        
    }



    Display(){
        if(!this.Visible || !this.CanDisplay){return}

        const data = this.data;
        const totalScale = this.totalScale; 
        const direction = this.direction;
        const opposite_direction = direction == "x" ? "y" : "x";

        const size = this.AbsoluteSize;
        const position = this.AbsolutePosition;


        const totalDisplaySize = size[direction] * totalScale;
        const totalPaddingSize = size[direction] - totalDisplaySize;

        const displaySize = totalDisplaySize / data.length;
        const paddingSize = totalPaddingSize / (data.length-1);


        // for(let index = 0; index < data.length; index++){
        //     const line = data[index];

        //     if(data.length % 2 != 0){ //odd
        //         this.DrawLine(line)
        //     }else{ //even

        //     }
        // }

        // for(const line of data){
        //     const {type, amount, _meta} = this;
        //     const linePos = position[direction];

        //     if(data.length % 2 != 0){ //odd
                
        //     }else{ //even

        //     }
        // }

        // if(data.length % 2 != 0){ //odd
            for(let index = 0; index < data.length; index++){
                const line = data[index];

                // if(index == 0){
                    // const linePos = {[direction]: position[direction] + (size[direction] / 2), [opposite_direction]: position[opposite_direction]};
                    // const lineSize = {[direction]: displaySize, [opposite_direction]: size[opposite_direction]}
                    const paddingAmount = (paddingSize * index) + (displaySize * index) +  (displaySize/2);

                    const linePos = {[direction]: position[direction] + paddingAmount, [opposite_direction]: position[opposite_direction]};
                    const lineSize = {[direction]: displaySize, [opposite_direction]: size[opposite_direction]}
                    this.DrawLine(line, linePos, lineSize);
                // }else{

                // }
            }
        // }else{ //even

        // }

        // fill(255);
        push();

        // noFill();
        // strokeWeight(3);
        // stroke(255);
        // rect(position.x, position.y, size.x, size.y);

        // stroke(color(255,0,0));
        // ellipse(position.x, position.y, 5);
        
        pop();
    }

    CalculateLinePosition(){

    }


    DrawLine(line, position, size){
        const {direction} = this;
        const opposite_direction = direction == "x" ? "y" : "x";
        const {type, color, _meta} = line;
        // const [objSize, objPos] = [this.AbsoluteSize, this.AbsolutePosition];

        push();
        fill(color.Value);

        if(type == "Solid"){
            
            if(direction == "x"){
                rect(position.x - (size.x/2), position.y, size.x, size.y);
            }else{
                rect(position.x, position.y - (size.y/2), size.x, size.y);
            }
            
        }else if(type == "Dashed"){
            const totalDashDisplaySize = size[opposite_direction] * _meta.scale;
            const totalDashPaddingSize = size[opposite_direction] - totalDashDisplaySize;

            const dashDisplaySize = totalDashDisplaySize / _meta.amount;
            const dashPaddingSize = totalDashPaddingSize / (_meta.amount - 1);

            
            for(let index = 0; index < _meta.amount; index++){
                const dashPaddingAmount = (dashPaddingSize * index) + (dashDisplaySize * index)

                if(direction == "x"){
                    rect(position.x - (size.x/2), position.y + dashPaddingAmount , size.x, dashDisplaySize);
                }else{
                    rect(position.x + dashPaddingAmount, position.y - (size.y/2) , dashDisplaySize, size.y);
                }
            }
    
        }

        pop();
        
    }

}