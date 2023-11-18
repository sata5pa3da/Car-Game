function GenerateUniqueId(){
    return window.crypto.randomUUID();
}

function StringToPath(object, string,  separator = "."){
    if(!string){return object}
    const splitted = string.split(separator);

    let cur = object;
    for(const substring of splitted){
        if(substring == ""){break}
        cur = cur[substring];
    }

    return cur;
}

function DivideString(string, divideIndex, separator = "."){
    divideIndex = typeof(divideIndex) == "function" ? divideIndex(string, separator) : divideIndex;
    return [string.substring(0, divideIndex), string.substring(divideIndex + separator.length)];
}

function StringToObjectAndKey(object, string, separator = "."){
    const splitted = string.split(separator);

    let cur = object;
    let substring = splitted[0];

    for(let index = 1; index < splitted.length; index++){
        cur = cur[substring];
        substring = splitted[index];
    }
    // for(const substring of splitted){
    //     cur = cur[substring];
    // }

    return [cur, substring];
}


function GetKeysWithPrefix(items, prefix){
    const keys = [];

    for(const key in items){
        if(key.indexOf(prefix) == 0){
            keys.push(key);
        }
    }

    return keys
}

function GetAssetName(path){
    const startIndex = max(path.lastIndexOf("/") + 1, 0);
    const endIndex = path.indexOf(".");

    return path.substring(startIndex, endIndex);
}

function GetObjectLength(obj){
    let length = 0;
    for(let _index in obj){length++}

    return length;
}

// function GetItemsWithPrefix(items, prefix){
//     for(const item of items){

//     }
// }