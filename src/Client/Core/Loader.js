//Constant variables that can be accessed anywhere
const HREF = window.location.href;
const PROTOCOL = window.location.protocol;

const ASSETS = {};


//Constants
const scriptsIgnoreList = {
  "p5.js": true,
  "Loader.js": true,
}


  // const LocalScripts = [
  //   {
  //     src: "Resources/",

  //     data: ["wait.js", "GuiObject.js", "Udim.js", "Udim2.js", "Button.js"],
  //   },

    
  //   {

  //     data: ["sketch.js"],
  //   },
    

  // ];




//-----------------Core functions
function loadJS(FILE_URL, async = true) {
    let scriptEle = document.createElement("script");
  
    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");


    //Creating the promise
    let resolve;
    const promise = new Promise((res) => {
      resolve = res;
    })

  
    document.body.appendChild(scriptEle);
  
    
    
     // error event
    scriptEle.addEventListener("error", (ev) => {
      console.log("Error on loading file", ev);
    });


    //Determining whether the promise should be resolved after the script has finished loading or immediately
    if(!async){
      scriptEle.addEventListener("load", () => {
        resolve();
      });
    }else{
      resolve();
    }

    return promise;
}


//-----------------Site loading methods
async function LoadSite(data){
    if(!data){
      const res = await fetch(HREF + "Data");
      const response = await res.json();

      data = response.Data;
    }
    
    // console.log(data);
    

    
    //Initializing all the client's assets
    for(const asset of data.Assets){
      ASSETS[asset] = undefined;
    }


    //Loading all the client's scripts
    for(const script of data.Scripts){
      if(!scriptsIgnoreList[script.name]){
        await loadJS(script.src, script.async);
      }
    }
}






//----------------
async function Load(){
  if(PROTOCOL == "file:"){
    console.log(HREF, PROTOCOL);
    // console.log(loadStrings("ClientScripts.txt"));
    // LoadLocalScripts(LocalScripts);
    // const reader = new FileReader();
    await loadJS("ClientScripts.txt", false);
    // console.log(LocalClientScripts);
    LoadSite(LocalClientData);
    
  }else{
    LoadSite();
  }
}

Load();