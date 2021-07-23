let japaneseParser = new JapaneseParser();

japaneseParser.waitLoad().then(()=>{
    let result = japaneseParser.tokenize("今日は暑いなあ。早く帰って酒でも飲もう！");
    console.log(result);
});
