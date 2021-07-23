let fs = require("fs");
let stdinstr = fs.readFileSync("/dev/stdin").toString();
let s = stdinstr.replace("\x1B[1A","").split("\n\n");

console.log(stdinstr);
console.log(s);

let s1 = s[0].split("\n");
let s2 = s[1].split("\n");

console.log(s1);
console.log(s2);

let s11 = {};
for(let i = 0; i < s1.length; i++){
    s11[s1[i]] = 2;
}

for(let i = 0; i < s2.length; i++){
    if(!(s2[i] in s11))s11[s2[i]] = 0;
    s11[s2[i]] += 1;
}

for(let key in s11){
    if(s11[key] <= 2){
        console.log(key,s11[key]);
    }
}

