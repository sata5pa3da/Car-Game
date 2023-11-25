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