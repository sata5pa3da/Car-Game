//Requiring basic stuff
const fs = require("fs/promises")
const path = require("path");

//Express init
const express = require("express");
// const { type } = require("os");
const app = express();


//Constants
const ClientDirectory = "src/Client";
const ClientScriptsOrder = [
    {src: "Resources/Utils", async: false, priority: {
        "wait.js": 0,
        "Tween.js": 1,
    }},

    {src: "Resources/DataTypes", async: false, priority: {
        "Udim.js": 0,
        "Udim2.js": 1,
    }},

    {src: "Resources/Gui", async: false, priority: {
        "GuiObject.js": 0,
        "TextUi.js": 1,
        "Img.js": 2
    }},
    


    {src: "", recursive: false, priority: {
        "app.js": 0,
    }, async: false},

    {src: "Handlers"},
]



//------------------------Utils--------------------//
function GetPath(path){
    const new_path = __dirname + path; //path.resolve(process.cwd(), path);
    return new_path;
}

function GetExt(path){
    return path.substring(path.indexOf("."));
}


function FilterPath(path){
    return path.replaceAll("\\", "/");
}

function GetNameFromFile(filePath){
    let start = 0;

    let slashIndex = filePath.indexOf("\\");
    if(slashIndex){
        start = slashIndex + 1;
    }

    return filePath.substring(start);
}


//---------------------Core Functions----------------------//
async function GetClientAssets(ClientAssets = []){
    const directory = `/${ClientDirectory}/Assets`;
    const files = await fs.readdir(GetPath(directory), {recursive: true});

    for(const file of files){
        const stat = await fs.stat(GetPath(directory + "/" + file));

        if(stat.isFile()){
            ClientAssets.push(FilterPath(file));
        }
    }

    return ClientAssets;
}

async function GetClientScripts(ClientScripts = []){
    try{

        for(let DirSettings of ClientScriptsOrder){
            const src = DirSettings.src;
            const priority = DirSettings.priority;
            
            const recursive = typeof(DirSettings.recursive) == "boolean" ? DirSettings.recursive : true;
            const asynchronous = typeof(DirSettings.async) == "boolean" ? DirSettings.async : true;


            const directory = `/${ClientDirectory}/` + src;
            const files = await fs.readdir(GetPath(directory), {recursive: recursive});

            
            const DirectoryScripts = [];
            for(const file of files){
                const stat = await fs.stat(GetPath(directory + "/" + file));
                
                const file_src = (src == "" ? src: src + "/") + file;
                if(stat.isFile()){
                    const DataObject = {
                        name: GetNameFromFile(file),
                        src: FilterPath(file_src),
                        extention: GetExt(file),
                        async: asynchronous,
                    }

                    if(DataObject.extention == ".js"){
                        let objPriority = priority && priority[DataObject.name];

                        //Checking if this script object has a specified priority number. If not, it is simply added to the end of the list
                        if(objPriority != undefined){
                            for(let i = objPriority-1; i >= 0; i--){
                                const curObject = DirectoryScripts[i];
                                
                                if(typeof(priority[curObject.name]) != "number" || priority[curObject.name] > priority[DataObject.name]){
                                    objPriority --;
                                }else{
                                    break;
                                }
                            }

                            DirectoryScripts.splice(objPriority, 0, DataObject);
                        }else{
                            DirectoryScripts.push(DataObject);
                        }
                        
                    }
                }
            }
            
            //Adding all the script elements from the current directory to the global list
            ClientScripts.push(...DirectoryScripts);
        }

        
    }catch(err){
        console.error("Error occurred while retrieving client scripts.", err);
    }

    
    return ClientScripts;
}


async function UpdateFile(data){
    try{
        const path = `/${ClientDirectory}/ClientScripts.txt`;

        // let content = await fs.readFile(GetPath(path), { encoding: 'utf8' });

        let fileData = "[";
        for(let obj of data){
            fileData += "\n\t{\n\t\t";
            
            for(let key in obj){
                fileData += key + ": " + obj[key] + ",\n\t\t";
            }
            
            fileData += "\n\t},\n";
        }

        fileData += "]";

        await fs.writeFile(GetPath(path), fileData);
        
        content = await fs.readFile(GetPath(path), { encoding: 'utf8' });
    }catch(err){
        console.log("Error occurred while reading file.", err);
    }
}

//-------------------------------------------


//Web socket init
app.listen(3000, () => {
    console.log("Listening at port 3000!");
})

//Hosting static webpage
app.use(express.static("src/Client"));




//Listening for get requests 
(async () => {
    app.get("/Data", async (req, res) => {
        const ClientAssets = [];
        await GetClientAssets(ClientAssets);


        const ClientScripts = [];
        await GetClientScripts(ClientScripts);


        UpdateFile(ClientScripts);
        
        res.send({Data: {Assets: ClientAssets, Scripts: ClientScripts}});
    })
})();

