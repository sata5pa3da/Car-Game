class EngineInstance{
    constructor(){
        this.RegisteredObjects = [];
        

    }

    //--------------------Utility Methods--------------------//
    
    /**Loops through every registered object within the engine and invokes the specified callback on it*/
    ForEachObject(callback, recursive = true, container){
        container = container || this.RegisteredObjects;

        for(const index in container){
            const object = container[index];

            callback(object, index, container);

            if(recursive && object.Children.length > 0){
                this.ForEachObject(callback, recursive, object.Children);
            }
        }
    }

    /**Creates an "hash" for the given objects using their "UniqueId" property as its key*/
    GenerateObjectsHash(...Objects){
        return ArrayToObject(Objects, "UniqueId");
    }

    /**Registers the given object(s) with the engine instance so it can be processed and rendered properly*/
    RegisterObjects(...Objects){
        for(const object of Objects){
            if(object.Parent instanceof EngineInstance){
                this.RegisteredObjects.push(object);
            }
        }
    }

    /**Deregisters the given object(s) with the engine instance*/
    DeregisterObjects(...Objects){
        const Hash = this.GenerateObjectsHash(Objects);

        this.ForEachObject((object, index, container) => {
            if(Hash[object.UniqueId]){
                container.splice(index, 1);
                object.Parent = null;
            }
        });
    }

    /**Deregisters all objects that are actively registered with this engine instance*/
    DeregisterAllObjects(){
        this.DeregisterObjects(...this.RegisteredObjects);
    }



    //----------------------Core Methods------------------------//
    /**Loops through every registered objects and calls their respective update/display method(s)*/
    Update(){
        this.ForEachObject((object) => {
            const requiresRefresh = object.GetMetaData("__requiresRefresh");

            object.DefaultDisplay();
            object.CustomDisplays();
            if(requiresRefresh){
                const elementPath = object.GetMetaData("__elementPath");
                if(elementPath){
                    const elementObj = StringToPath(object, elementPath);
                    elementObj.Display();
                }else{
                    object.Display();
                }
                
            }
        });
    }

    /**Disables the engine*/
    Disable(){

    }
    
}

