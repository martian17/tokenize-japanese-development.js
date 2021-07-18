let child_process = require("child_process");
let rl = require("readline");
let fs = require("fs");
let path = require("path");

let tokenizeJapanese = function(str){
    return new Promise((res,rej)=>{
        let cabocha = child_process.spawn("mecab", []);//child_process.spawn("cabocha", ["-I0", "-O1"]);
        let result = "";
        cabocha.on("close", (code) => {
            //console.log(result);
            res(result);
            //res(result.split("\n").map(a=>a.split(/\s+/)).filter(a=>a.length>1).map(a=>a[0]));
        });
        
        cabocha.stdout.on("data",function(data){
            result += data;
            //console.log(result);
        });
        
        
        /*
        console.log(result);
        //debug code
        let lines = result.split("\n");
        for(let i = 0; i < lines.length; i++){
            let line = lines[i];
            console.log(line);
            let l = line.split(/\s+/)[1];
            if(!l)continue;
            console.log(line);
            let ls = l.split(",");
            if(ls[0][0] === "名" || ls[1] === "一般"){
                console.log(line);
            }
        }
        */
        
        cabocha.stdin.write(str);
        cabocha.stdin.end();
    });
};

let tokenizeFile = async function(name){
    let str = (await fs.promises.readFile(name)).toString();
    return await tokenizeJapanese(str);
};

function ConvertStringToHex(str) {
    var arr = [];
    for (var i = 0; i < str.length; i++) {
        arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return "\\u" + arr.join("\\u");
}

let addConnections = function(tokens,connections){
    tokens = tokens.split("\n").map(a=>a.split(/\s+/)).filter(a=>a.length>1).map(a=>a[1].split(",")[0].trim()+","+a[1].split(",")[1].trim());
    for(let i = 0; i < tokens.length-1; i++){
        let token1 = tokens[i];
        let token2 = tokens[i+1];
        let tt = token1.split(",");
        //debug
        if(tt[1] === "一般" && tt[0][0] === "名"){
            console.log(token1, ConvertStringToHex(token1));
        }
        //debug
        if(!(token1 in connections))connections[token1] = {};
        if(!(token2 in connections[token1]))connections[token1][token2] = 0;
        connections[token1][token2]++;
    }
};

let main = async function(){
    let traindir = "etc/train-data";
    let files = (await fs.promises.readdir(traindir)).map(a=>path.join(traindir,a));
    let connections = {};
    for(let i = 0; i < files.length; i++){
        addConnections(await tokenizeFile(files[i]),connections);
    }
    console.table(connections);
    //export the table content to a json file
    let aa = [];
    for(let key in connections){
        aa.push(key);
    }
    console.log("");
    console.log(aa.sort().join("\n"));
};

main();

