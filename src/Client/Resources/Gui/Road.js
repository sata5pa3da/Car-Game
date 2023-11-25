class Road extends GuiObject{
    //Static Constants
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
            // amount = 1,
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
        this.opposite_direction = this.direction == "x" ? "y" : "x";

        this.displayData = undefined;


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



        //Setting up the road
        this.Setup();


        //Setting up specific components of the road
        this.CalculateDisplayData();
        
    }


    //Core Methods
    CalculateDisplayData(){ //Calculates all the data that will be used to determine to dimentions of individual lane data
        const data = this.data;
        const totalScale = this.totalScale; 
        const direction = this.direction;

        const size = this.AbsoluteSize;


        const totalDisplaySize = size[direction] * totalScale;
        const totalPaddingSize = size[direction] - totalDisplaySize;

        const displaySize = totalDisplaySize / data.length;
        const paddingSize = totalPaddingSize / (data.length-1);



        this.displayData = {totalDisplaySize, totalPaddingSize, displaySize, paddingSize};
        return this.displayData;
    }

    CalculateLinePosition(index){ //Calculates the position of a lane's border based on the index
        // if(!this.displayData){this.CalculateDisplayData()}


        const direction = this.direction;
        const opposite_direction = this.opposite_direction; 

        const {paddingSize, displaySize} = this.displayData;


        const position = this.AbsolutePosition;
        const paddingAmount = (paddingSize * index) + (displaySize * index) +  (displaySize/2);


        const linePos = {[direction]: position[direction] + paddingAmount, [opposite_direction]: position[opposite_direction]};
        return linePos;
    }

    Display(){
        if(!this.Visible || !this.CanDisplay){return}

        const data = this.data; 
        const direction = this.direction;
        const opposite_direction = this.opposite_direction;

        const size = this.AbsoluteSize;


        const {displaySize} = this.CalculateDisplayData();

        
        for(let index = 0; index < data.length; index++){
            const line = data[index];

            const linePos = this.CalculateLinePosition(index);
            const lineSize = {[direction]: displaySize, [opposite_direction]: size[opposite_direction]}
            this.DrawLine(line, linePos, lineSize);
        }
    }


    DrawLine(line, position, size){
        const {direction} = this;
        const opposite_direction = direction == "x" ? "y" : "x";
        const {type, color, _meta} = line;

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



    

    GetLanes(){
        return this.data.length - 1;
    }

    GetLaneSize(){
        return this.displayData.paddingSize;
    }

    GetLanePosition(lane){
        const [startPos, endPos] = [this.CalculateLinePosition(lane-1), this.CalculateLinePosition(lane)];
        
        const lanePosition = GetObjectsAverage(startPos, endPos);
        return lanePosition;
    }


}