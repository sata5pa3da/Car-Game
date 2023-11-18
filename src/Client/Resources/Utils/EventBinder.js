class EventHandler{
    //Static Constants
    static Events = [];


    //Static Methods (Event Binding) 
    static keyPressed(keys, callback, caseSensitive = false){
        return new EventHandler({
            Type: "keyPressed",
            Id: GenerateUniqueId(),
            Binded: true,

            Keys: typeof(keys) != "object" ? [keys] : keys,
            Callback: callback,
            CaseSensitive: caseSensitive,
        });
    }


    //Static Methods (Global Event Methods)
    static GetEventType(EventType){
        const Events = EventHandler.Events;
        const FilteredEvents = [];

        for(const Event of Events){
            if(Event.Binded && Event.Type == EventType){
                FilteredEvents.push(Event);
            }
        }
        
        return FilteredEvents;
    }

    static RemoveEvent(Event){
        const Events = EventHandler.Events;
        for(const index in Events){
            const otherEvent = Events[index];
            if(Event.Id == otherEvent.Id){
                return Events.splice(index);   
            }
        }
    }


    //Constructor
    constructor(EventData){
        for(const key in EventData){
            this[key] = EventData[key];
        }

        EventHandler.Events.push(this);
    }


    //Core Methods
    Unbind(){
        this.Binded = false;
    }

    Rebind(){
        this.Binded = true;
    }

    Disconnect(){
        EventHandler.RemoveEvent(this);
    }

}



//---------------------
function keyPressed(event){
    const BindedEvents = EventHandler.GetEventType("keyPressed");

    for(const Event of BindedEvents){
        const keys = Event.Keys;

        let isValid;


        for(const key of keys){
            switch(typeof(key)){
                case "number":
                    if(key == event.keyCode){isValid = true}
                    break;
                case "string":
                    if(Event.CaseSensitive && key == event.key){isValid = true}
                        else if(key.toLowerCase() == event.key.toLowerCase()){isValid = true}
                    break;
            }

            if(isValid){
                (async () => {
                    Event.Callback(event);
                })();

                break;
            }
        }

        
    }
}