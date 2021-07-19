let writeConnections = require("./json-connection.js");
let convertDict = require("./convert-dict.js");

let fs = require("fs").promises;


let main = async function(){
    //removing the obj directory
    await fs.rm("./obj", {force:true,recursive:true});
    await fs.mkdir("./obj");
    writeConnections();
    convertDict();
};

main();