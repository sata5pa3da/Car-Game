function FilterObject(object, filter){
    const FilteredObject = Array.isArray(object) ? [] : {};

    for(const key in object){
        const value = object[key];

        if(!filter || filter(key, value)){
            FilteredObject[key] = value;
        }
    }

    return FilteredObject;
}



function ArrayToObject(array, value, object, key){
    object = typeof(object) == "object" ? object : {};


    for(const index in array){
        const val = array[index];


        const [keyType,  valueType] = [typeof(key), typeof(value)];

        key = (keyType == "function") ? (key(index, val)) :  key;
        value = (valueType == "function") ? value(index, val) : value;

        object[key || val] = value || val;
    }

    return object;
}

function GetObjectsAverage(...objects){
    const averages = {};

    for(const obj of objects){ //Loops through all the objects provided
        for(const key in obj){ //Loops through all the keys in the object to add all its keys' value to the average list
            const val = obj[key];

            let keyData = averages[key];
            if(!keyData){
                keyData = {total: 0, amount: 0};
                averages[key] = keyData;
            }

            keyData.total += val;
            keyData.amount += 1;
        }
    }


    const average = {};
    for(const key in averages){
        const keyData = averages[key];
        const {total, amount} = keyData;
        
        average[key] = total / amount;
    }

    return average;
}



function GetAllPropertyNames(obj, {includeSelf = true, includePrototypeChain = true, includeTop = false, includeEnumerables = true, includeNonenumerables = true, includeStrings = true, includeSymbols = true} = {}) {
    
    // Boolean (mini-)functions to determine any given key's eligibility:
    const isEnumerable = (obj, key) => Object.propertyIsEnumerable.call(obj, key);
    const isString = (key) => typeof key === 'string';
    const isSymbol = (key) => typeof key === 'symbol';
    const includeBasedOnEnumerability = (obj, key) => (includeEnumerables && isEnumerable(obj, key)) || (includeNonenumerables && !isEnumerable(obj, key));
    const includeBasedOnKeyType = (key) => (includeStrings && isString(key)) || (includeSymbols && isSymbol(key));
    const include = (obj, key) => includeBasedOnEnumerability(obj, key) && includeBasedOnKeyType(key);
    const notYetRetrieved = (keys, key) => !keys.includes(key);
    
    // filter function putting all the above together:
    const filterFn = key => notYetRetrieved(keys, key) && include(obj, key);
    
    // conditional chooses one of two functions to determine whether to exclude the top level or not:
    const stopFn = includeTop ? (obj => obj === null) : (obj => Object.getPrototypeOf(obj) === null);
    
    // and now the loop to collect and filter everything:
    let keys = [];
    while (!stopFn(obj, includeTop)) {
        if (includeSelf) {
            const ownKeys = Reflect.ownKeys(obj).filter(filterFn);
            keys = keys.concat(ownKeys);
        }
        if (!includePrototypeChain) { break; }
        else {
            includeSelf = true;
            obj = Object.getPrototypeOf(obj);
        }
    }
    return keys;
}


function GetAllPropertyDescriptors(obj) {
    if (!obj) {
        return Object.create(null);
    } else {
        const proto = Object.getPrototypeOf(obj);
        return {
            ...GetAllPropertyDescriptors(proto),
            ...Object.getOwnPropertyDescriptors(obj)
        };
    }
}
