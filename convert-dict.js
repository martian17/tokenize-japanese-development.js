let fs = require("fs").promises;
let path = require("path");

//promise util
let waitAllToBeResolved = async function(list){
    for(let i = 0; i < list.length; i++){
        list[i] = await list[i];
    }
};


let main = async function(){
    let dictdir = "./src/dict";
    let files = (await fs.readdir(dictdir)).map(a=>path.join(dictdir,a));
    
    let categories = {};
    for(let i = 0; i < files.length; i++){
        let fname = files[i];
        let str = (await fs.readFile(fname)).toString();
        let lines = str.split("\n");
        for(let i = 0; i < lines.length; i++){
            let line = lines[i];
            let linesp = line.split(",");
            if(linesp.length < 7){
                continue;
            }
            let catname = linesp.slice(4,7).join(",");
            if(!(catname in categories)){
                categories[catname] = [];
            }
            categories[catname].push(line);
        }
    }
    
    //come up with some kind of mapping
    //and save them to files
    let mapping = {};
    let id = 0;
    fs.mkdir("./obj/dict/");
    
    let awaiting = [];
    for(catname in categories){
        let fileContent = categories[catname].join("\n");
        let filename = `./obj/dict/${id}.csv`;
        awaiting.push(fs.writeFile(filename,fileContent));//adding to the promise list
        mapping[catname] = id;
        id++;
    }
    await waitAllToBeResolved(awaiting);
    
    //writing the maping json file
    await fs.writeFile("./obj/mapping.json",JSON.stringify(mapping));
};

module.exports = main;