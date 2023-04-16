export function patch(oldVnode,vnode){
    if(oldVnode.nodeType == 1){//真实节点
        //虚拟dom转换为真实dom
        let el = createElm(vnode)//产生真实dom
        let parentElm = oldVnode.parentNode
        parentElm.insertBefore(el,oldVnode.nextSibling)//将新的节点插在老的节点前面
        parentElm.removeChild(oldVnode)//删除老的节点
        return el
    }else{
        //在更新的时候拿老的虚拟节点和新的虚拟节点做对比，将不同的地方更新
        //1.比较两个元素的标签，标签不一样直接替换掉
        if(oldVnode.tag !== vnode.tag){
            return oldVnode.el.parentNode.replaceChild(createElm(vnode),oldVnode.el)
        }
        //2.标签一样，比对文本，文本节点的tag都是undefined
        if(!oldVnode.tag){
            if(oldVnode.text!==vnode.text){
                return oldVnode.el.text = vnode.text
            }
        }
        //3.标签一样，并且需要开始比对标签的属性和儿子
        //标签一样直接复用即可
        let el = vnode.el = oldVnode.el
        //更新属性，用新的虚拟节点的属性和老的比较，去更新节点
        //新老属性对比
        updateProperties(vnode,oldVnode.data)
    }
    
}
export function createElm(vnode){
    let {tag,children,key,data,text} = vnode
    if(typeof tag == "string"){
        vnode.el = document.createElement(tag)
        updateProperties(vnode)
        children.forEach(child=>{
            vnode.el.appendChild(createElm(child))
        })
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
function updateProperties(vnode,oldProps={}){
    let newProps = vnode.data || {}
    let el = vnode.el
    //老的有新的没有需要删除属性
    for(let key in oldProps){
        if(!newProps[key]){
            el.removeAttribute(key)
        }
    }

    //样式处理  老的：style={color:red}   新的：style={background:red}
    let newStyle = newProps.style || {}
    let oldStyle = oldProps.style || {}
    for(let key in oldStyle){
        if(!newStyle[key]){
            el.style[key] = ""
        }
    }

    //新的有，直接用新的更新就行
    for(let key in newProps){
        if(key == "style"){
            for(let styleName in newProps.style){
                el.style[styleName] = newProps.style[styleName]
            }
        }else if(key == "class"){
            el.className = newProps.class
        }else{
            el.setAttribute(key,newProps[key]) 
        }
        
    }
    
}