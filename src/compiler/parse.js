const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) //标签开头的正则，捕获的是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //匹配标签结尾
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/ //匹配属性
const startTagClose = /^\s*(\/?)>/  //匹配标签结束
const defaultTagRe = /\{\{((?:.|\r?\n)+?)\}\}/g
export function parseHtml(html){
    function creatASTElement(tagName,attrs){
        return {
            tag:tagName,
            type:1,
            children:[],
            attrs,
            parent:null
        }
    }
    //被解析的根元素
    let root
    //当前在被解析的元素
    let currentParent
    //用于对比标签是否符合规范，即有开始标签也有结束标签
    let stack = []
    function start(tagName,attrs){
        let element = creatASTElement(tagName,attrs)
        if(!root){
            root = element
        }
        currentParent = element
        stack.push(element)//将生成的ast元素放到栈中
    }
    function end(){
        let element = stack.pop();//取出栈里最后一个，即该标签解析结束
        currentParent = stack[stack.length-1] //更新当前解析的标签
        if(currentParent){//当一个标签解析完成，就可以知道其父标签  
            element.parent = currentParent
            currentParent.children.push(element)
        }
    
    }
    function chars(text){
        
        text = text.replace(/\s/g,'')//去掉空格
        if(text){
            currentParent.children.push({
                 type:3,
                 text
            })
        }
        
    }
    while(html){
        let textEnd = html.indexOf('<')
        if(textEnd == 0){//是标签的开始标记
            const startTagMatch = parseStartTag()
            if(startTagMatch){ 
                start(startTagMatch.tagName,startTagMatch.attrs )
                continue
            }
            const endTagMatch = html.match(endTag)
            if(endTagMatch){
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }
        let text
        if(textEnd>0){//是文本
            text = html.substring(0,textEnd)
        }
        if(text){
            advance(text.length)
            chars(text)
        }
    }
    return root 
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