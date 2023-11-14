class Pedestrian extends GuiObject{
    //Static Variables
    static Type = "Pedestrian";
   



    //Constructor method
    constructor({
        data = {
            head: {
                scale: [1, 1],
                offset: 0,
                face,
            },

            root: {
                scale: [1, 1],
            },

            //
            legs: {
                scale: [1, 1],
                offset: 0,
            },

            arms: {
                scale: [1,1],
                offset: 0,
            },





        },

        Color,
        StrokeColor,
        StrokeWeight,
        BorderRadius,
    } = {}){
        super(arguments[0]);

        //Initializing the properties specific to the pedestrian itself
        this.data = data;
        this.Color = Color;
        this.BorderRadius = BorderRadius;



        //Creating the road wrapper object
        const _Pedestrian = {}
        this.Pedestrian = _Pedestrian;


        //Initializing the metadata for the object
        const MetaData = {
            __object: this.Pedestrian,
            __isCustomElement: true,
            __requiresRefresh: true,
        };
        this.MetaData = MetaData;



        //Setting up the button
        this.Setup();
    }


    Display(){
        if(!this.Visible || !this.CanDisplay){return}


        push();
        rectMode(CENTER);
        ellipseMode(CENTER)

        if(this.Color){fill(this.Color.Value)}else{noFill()}
        if(this.StrokeColor){stroke(this.StrokeColor.Value)}else{noStroke()}

        if(this.StrokeWeight){strokeWeight(this.strokeWeight)}


        //
        const data = this.data;
        const [size, position] = [this.AbsoluteSize, this.AbsolutePosition];


        //
        const root = data.root;
        const [rootScaleX, rootScaleY] = [root.scale[0], root.scale[1]];

        const [rootX, rootY] = [position.x + (size.x/2), position.y + (size.y/2)];
        const [rootSizeX, rootSizeY] = [size.x * rootScaleX, size.y * rootScaleY];
        rect(rootX, rootY, rootSizeX, rootSizeY); //root



        //
        const head = data.head;
        const [headScaleX, headScaleY] = [head.scale[0], head.scale[1]];
        const headOffset = head.offset || 0;

        const [headSizeX, headSizeY] = [size.x * headScaleX, size.y * headScaleY];
        const [headX, headY] = [rootX, rootY - (rootSizeY/2) - (headSizeY/2) - (size.y * headOffset)];

        ellipse(headX, headY, min(headSizeX, headSizeY)); //head




        //
        const arms = data.arms;
        const [armsScaleX, armsScaleY] = [arms.scale[0], arms.scale[1]];
        const armsOffset = arms.offset || 0;

        const [armSizeX, armSizeY] = [size.x * armsScaleX/2, size.y * armsScaleY/2];
        const [leftArmX, armY] = [rootX - (rootSizeX/2) - (armSizeX/2) - (size.x * armsOffset), rootY - (rootSizeY/2) + (armSizeY/2)];

        const rightArmX = rootX + (rootSizeX/2) + (armSizeX/2) + (size.x * armsOffset);

        
        rect(leftArmX, armY, armSizeX, armSizeY);
        rect(rightArmX, armY, armSizeX, armSizeY);




        //
        const legs = data.legs;
        const [legsScaleX, legsScaleY] = [legs.scale[0], legs.scale[1]];
        const legsOffset = legs.offset || 0;

        const [legSizeX, legSizeY] = [size.x * legsScaleX/2, size.y * legsScaleY/2];
        const [leftX, legY] = [rootX - (legsScaleX/2 * size.x), rootY + (rootSizeY/2) + (legSizeY/2) + (size.y * legsOffset)];

        const rightX = rootX + (legsScaleX/2 * size.x);

        
        rect(leftX, legY, legSizeX, legSizeY);
        rect(rightX, legY, legSizeX, legSizeY);







        pop();















        push();

        noFill();
        strokeWeight(3);
        stroke(255);
        rect(position.x, position.y, size.x, size.y);

        stroke(color(255,0,0));
        ellipse(position.x, position.y, 5);
        
        pop();
    }
}