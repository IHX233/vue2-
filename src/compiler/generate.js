const defaultTagRe = /\{\{((?:.|\r?\n)+?)\}\}/g //匹配双大括号和里面的内容
function genProps(attrs){
    let str = ''
    for(let i = 0;i<attrs.length;i++){
        let attr = attrs[i]
        if(attr.name === 'style'){//对样式的特殊处理
            let obj = {};
            attr.value.split(';').foreach(item => {
                let [key,value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0,-1)}}`
}
function gen(node){
    if(node.type == 1){
        return generate(node)//生成元素节点的字符串
    }else{
        let text = node.text;//获取文本
        //_v('hello{{world}}') => _v('hello'+_s(world))
        if(!defaultTagRe.test(text)){
            //如果是普通文本，不带{{}}
            return `_v(${JSON.stringify(text)})`
        }
        let tokens = []
        let lastIndex = defaultTagRe.lastIndex = 0 //如果正则是全局模式，需要每次使用前设置为0
        let match,index
        while(match = defaultTagRe.exec(text)){
            index = match.index//保存匹配到的索引
            if(index > lastIndex){
                tokens.push(JSON.stringify(text.slice(lastIndex,index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }
        if(lastIndex<text.length){
            tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return `_v(${tokens.join('+')})`
    }
}
function genChildren(el){
    const children = el.children
    if(children){ //将转换后的儿子用逗号拼接起来
        return children.map(child => gen(child)).join(',')
    }
}
export function generate(el){
    let children = genChildren(el)//儿子的生成 
    let code = `_c('${el.tag}',${
        el.attrs?`${genProps(el.attrs)}`:'undefined'
    }${
        children?`,${children}`:''
    })`
    return code
}