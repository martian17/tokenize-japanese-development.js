let child_process = require("child_process");
let rl = require("readline");
let fs = require("fs").promises;
let path = require("path");




//using buffer to avoid the concatenation bug
let tokenizeJapanese = function(str){
    return new Promise((res,rej)=>{
        let cabocha = child_process.spawn("mecab", []);//child_process.spawn("cabocha", ["-I0", "-O1"]);
        let resultBuffer;
        let buffers = [];
        cabocha.stdout.on("data",function(data){
            buffers.push(data);
        });
        
        cabocha.on("close", (code) => {
            let lines = Buffer.concat(buffers).toString().split("\n");
            let result = [];
            
            for(let i = 0; i < lines.length; i++){
                let a = lines[i].split(/\s+/);
                if(!a[1])continue;
                let b = a[1].split(",");
                if(b.length < 2)continue;
                let token =  [a[0], ...b].map(c=>c.trim());
                result.push(token);
            }
            res(result);
        });
        
        cabocha.stdin.write(str);
        cabocha.stdin.end();
    });
};

let tokenizeFile = async function(name){
    let str = (await fs.readFile(name)).toString();
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
    for(let i = 0; i < tokens.length-1; i++){
        let token1 = tokens[i].slice(1,4).join(",");//tokens[i][1]+","+tokens[i][2];
        let token2 = tokens[i+1].slice(1,4).join(",");//tokens[i+1][1]+","+tokens[i+1][2];
        if(!(token1 in connections))connections[token1] = {};
        if(!(token2 in connections[token1]))connections[token1][token2] = 0;
        connections[token1][token2]++;
    }
};




let main = async function(){
    let traindir = "etc/train-data";
    let files = (await fs.readdir(traindir)).map(a=>path.join(traindir,a));
    let connections = {};
    //console.log(files);
    
    for(let i = 0; i < files.length; i++){
        //let tokens = await tokenizeFile(files[i]);
        addConnections(await tokenizeFile(files[i]),connections);
    }
    //console.log(connections);
    try{
        await fs.writeFile("./obj/grammar.json",JSON.stringify(connections));
    }catch(err){
        console.log("./obj/grammar.json write failed");
        return false;
    }
    
    
    
    
    
    //debug code
    /*
    let aa = [];
    for(let key in connections){
        aa.push(key);
    }
    console.log("");
    console.log(aa.sort().join("\n"));
    */
};

module.exports = main;


