let fs = require("fs");

//let str = fs.readFileSync("/dev/stdin").toString();
let str = fs.readFileSync(process.argv[2]).toString();
console.log(process.argv[2]);
let ids = str.split("\n").map(a=>{
    //console.log(a);
    return a.split(",").slice(4,7).join(",");
});
let uniq = {};
for(let i = 0; i < ids.length; i++){
    uniq[ids[i]] = 1;
}
for(let id in uniq){
    if(id !== "")console.log(id);
}

