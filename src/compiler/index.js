
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) //标签开头的正则，捕获的是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //匹配标签结尾
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/ //匹配属性
const startTagClose = /^\s*(\/?)>/  //匹配标签结束
const defaultTagRe = /\{\{((?:.|\r?\n)+?)\}\}/g

function start(tagName,attrs){
    console.log(tagName,attrs)
}
function end(tagName){

}
function chars(text){

}
function parseHtml(html){
    while(html){
        let textEnd = html.indexOf('<')
        if(textEnd == 0){
            const startTagMatch = parseStartTag()
            if(startTagMatch){ 
                start(startTagMatch.tagName,startTagMatch.attrs )
            }
            break;
        }
    }
    function advance(n){//截取更新html
        html = html.substring(n)
    }
    function parseStartTag(){
        const start = html.match(startTagOpen)
        if(start){
            const match = {
                tagName:start[1],
                attrs:[]
            }
            advance(start[0].length)//删除开始标签
            //不是标签结束标记且有属性
            let end;
            let attr;
            while(!(end=html.match(startTagClose))&&(attr=html.match(attribute))){
                match.attrs.push({name:attr[1],value:attr[3]||attr[4]||attr[5]})
                advance(attr[0].length) 
            }
            if(end){//匹配到标签结束标记，删除标签并结束一轮的开始标签信息解析
                advance(end[0].length)
                return match;
                
            }
        }
    }
}
export function compileToFunctions(template){
    let ast = parseHtml(template)
}