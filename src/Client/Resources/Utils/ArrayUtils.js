function ArrayToObject(array, value, object, key){
    object = typeof(object) == "object" ? object : {};

    // return array.reduce((current, val, index) => {
    //     // console.log(current, val, index);
    //     const [keyType,  valueType] = [typeof(key), typeof(value)];


    //     key = (keyType == "function") ? (key(index, val)) :  key;
    //     value = (valueType == "function") ? value(index, val) : value;

    //     return {...current, [(key || val)]: value || val};
    // }, object);


    for(const index in array){
        const val = array[index];


        const [keyType,  valueType] = [typeof(key), typeof(value)];

        key = (keyType == "function") ? (key(index, val)) :  key;
        value = (valueType == "function") ? value(index, val) : value;

        object[key || val] = value || val;
    }

    return object;
}
// function doStuff(callback){
//     console.log(callback(1));
// }
// doStuff((arg) => {raerg+1});