let Trie = function(){
    let tree = [{},null];
    //subtree leaf
    this.add = function(id,val){
        let subtree = tree;
        for(let i = 0; i < id.length; i++){
            let char = id[i];
            let siblings = subtree[0];
            if(!(char in siblings)){
                siblings[char] = [{},null];
            }
            subtree = subtree[char];
        }
        subtree[1] = val;
    }
    this.find = function(word){
        
    }
}

let MultiTrie = function(){
    let tree = [{},[]];
    //subtree leaf
    this.add = function(id,val){
        let subtree = tree;
        for(let i = 0; i < id.length; i++){
            let char = id[i];
            let siblings = subtree[0];
            if(!(char in siblings)){
                siblings[char] = [{},[]];
            }
            subtree = siblings[char];
        }
        subtree[1].push(val);
        //success
    }
    this.findAllPossibleMatches = function(str,start){
        //find the longest match and back track
        let subtree = tree;
        let matches = [];
        for(let i = start; i < word.length; i++){
            let char = word[i];
            let siblings = subtree[0];
            matches.push(subtree[1]);
            if(!(char in siblings)){
                continue;//finally hit the longest word
            }
            subtree = siblings[char];
        }
        return matches;
    }
};

let JapaneseParser = function(rootPath){
    //let url = window.location.origin;
    let loadJson = async function(path){
        let response = await fetch(rootPath+path);
        return await response.json();
    };
    let getText = async function(path){
        let response = await fetch(rootPath+path);
        return await response.text();
    };
    
    let Word = function(attr){
        this.word = attr[0];
        this.category = attr.slice(4,6).join(",");
        this.origin = attr;
    };
    
    let buildDict = async function(dict, catname, id){
        let csv = await getText("/dict/"+id+".csv").split("\n");
        let trie = new Trie();
        for(let i = 0; i < csv.length; i++){
            let word = new Word(csv[i].split(","));
            trie.add(word.word,word);
        }
        return trie;
    };
    
    let init = async function(){
        let mapping = await loadJson("/mapping.json");
        
        let dict = {};
        let awaiting = [];
        for(let catname in mapping){
            awaiting.push((dict,catname,mapping[catname]));
        }
    }
    
    
    //okay, finally! this is where fun begins
    let findNextWord = function(str,pointer,previousCategory){
        let matches = multiTrie.findAllPossibleMatches(str,pointer);
        if(matches.length === 0){
            for(let i = matches.length-1; i >= 0; i--){
                let possibilities = matches[i];
                for(let j = 0; j < possibilities.length; j++){
                    let word = possibilities[j];
                    if(word.category in grammar[previousCategory]){
                        return word;
                    }
                }
            }
            //no matches found within the known grammar, returning the longest match
            return matches[matches.length-1][0];
        }else{
            //no matches found, treating it as a noun
            let ww = str[pointer];
            for(let i = pointer+1; i < str.length; i++){
                let matches = multiTrie.findAllPossibleMatches(str,i);
                if(matches.length !== 0){
                    //found a word ending
                    //仕舞い,1285,1285,5543,名詞,一般,*,*,*,*,仕舞い,シマイ,シマイ
                    return new Word(ww,[ww,0,0,0,"名詞","一般","*","*","*","*",ww,ww,ww]);
                }
                ww += str[i];
            }
            return new Word(ww,[ww,0,0,0,"名詞","一般","*","*","*","*",ww,ww,ww]);
        }
    };
    
    this.tokenize = function(str){
        let result = [];
        let pointer = 0;
        let previousCategory = "記号,句点,*";
        while(pointer < str.length){
            let word = findNextWord(str,pointer,previousCategory);
            result.push(word);
            previousCategory = word.category;
            pointer += word.word.length;
        }
        return result;
    };
    
    
    
    
    
    //lastly, do some loading action since this library ain't gonna be ready unril every json and csv files load up
    this.waitLoad = function(){
        return new Promise((res,rej)=>{
            
        });
    };
};