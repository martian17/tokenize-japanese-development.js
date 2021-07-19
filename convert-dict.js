let fs = require("fs").promises;
let path = require("path");

let main = async function(){
    let dictdir = "./src/dict";
    let files = (await fs.readdir(dictdir)).map(a=>path.join(dictdir,a));
    let dictStrs = [];
    for(let i = 0; i < files.length; i++){
        let fname = files[i];
        let str = (await fs.readFile(fname)).toString();
        let lines = str.split("\n");
        for(let j = 0; j < lines.length; j++){
            //filtering out bad lines
            let line = lines[j];
            let entry = line.split(",");
            if(entry.length > 7){
                dictStrs.push(entry.join(","));
            }
        }
    }
    let fileContent = dictStrs.join("\n");
    let filename = "./obj/dict.csv";
    await fs.writeFile(filename,fileContent);//adding to the promise list
};

main();