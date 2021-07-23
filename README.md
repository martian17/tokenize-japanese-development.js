# tokenize-japanese.js
## About
This program tokenizes Japanese text and classifies them into parts of speech. Made to be a browser equivalent of MeCab  
日本語を単語ごとに区切り品詞に分類するプログラムです。ブラウザの上でMeCabのようなものを走らせたいと思い作りました。内部辞書はMeCabと同じものを使っています。  
ロードが遅いので(trieの構築時間)キャッシングやら何やらで最適化したいです。  
これからいろいろいじってちゃんとしたライブラリーになればいいなと思っています。プルリク大歓迎です。  

## Examples
tokenize-japanese.js/test/ is the example use case.  
tokenize-japanese.js/test/←使用例です。適当に改造して使ってください。  
```
let japaneseParser = new JapaneseParser();

japaneseParser.waitLoad().then(()=>{
    let result = japaneseParser.tokenize("今日は暑いなあ。早く帰って酒でも飲もう！");
    console.log(result);
});
```
![example](https://github.com/martian17/tokenize-japanese.js/blob/main/img/example.png?raw=true)
