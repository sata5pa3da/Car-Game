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