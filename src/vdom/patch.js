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
                // oldVnode.el.data = vnode.text
                // oldVnode.el.nodeValue = vnode.text
                // oldVnode.el.textContent = vnode.text
                return oldVnode.el.textContent = vnode.text
            }
        }
        //3.标签一样，并且需要开始比对标签的属性和儿子
        //标签一样直接复用即可
        let el = vnode.el = oldVnode.el
        //更新属性，用新的虚拟节点的属性和老的比较，去更新节点
        //新老属性对比
        updateProperties(vnode,oldVnode.data)
        let oldChildren = oldVnode.children || []
        let newChildren = vnode.children || []
        if(oldChildren.length>0&&newChildren.length>0){//新老都有孩子
            updateChildren(oldChildren,newChildren,el)
        }else if(oldChildren.length>0){//新的没有
            el.innerHTML = ''
        }else if(newChildren.length>0){//老的没有
            for(let i=0;i<newChildren.length;i++){
                let child = newChildren[i]
                el.appendChild(createElm(child))
            }
            
        }
    }
    
}
function isSameVnode(oldVnode,newVnode){
    return (oldVnode.tag == newVnode.tag)&&(oldVnode.key == newVnode.key)
}
function makeInedexByKey(children){
    let map = {}
    children.forEach((item,index)=>{
        if(item.key){ 
            map[item.key] = index
        }
    })
    return map
}
function updateChildren(oldChildren,newChildren,parent){
    let oldStartIndex = 0
    let oldStartVnode = oldChildren[0]
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIndex]

    let newStartIndex = 0
    let newStartVnode = newChildren[0]
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newEndIndex]
    let map = makeInedexByKey(oldChildren)
    //做一个循环，同时循环老的和新的，哪个先结束，循环就停止，将多余的删除或添加进去
    while(oldStartIndex<=oldEndIndex&&newStartIndex<=newEndIndex){
        if(!oldStartVnode){//null
            oldStartVnode = oldChildren[++oldStartIndex]
        }
        //头头比
        else if(isSameVnode(oldStartVnode,newStartVnode)){//如果是同一个元素，比对儿子
            patch(oldStartVnode,newStartVnode)//更新属性，递归更新儿子
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
            //尾尾比
        }else if(isSameVnode(oldEndVnode,newEndVnode)){
            patch(oldEndVnode,newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
            //头尾比
        }else if(isSameVnode(oldStartVnode,newEndVnode)){
            patch(oldStartVnode,newEndVnode)
            //将当前元素插到尾部的下一个元素前面
            parent.insertBefore(oldStartVnode.el,oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        }else if(isSameVnode(oldEndVnode,newStartVnode)){
            patch(oldEndVnode,newStartVnode)
            parent.insertBefore(oldEndVnode.el,oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        }else{
            //暴力对比
            let moveIndex = map[newStartVnode.key]
            if(moveIndex == undefined){
                parent.insertBefore(createElm(newStartVnode),oldStartVnode.el)
            }else{
                let moveVNode = oldChildren[moveIndex]
                oldChildren[moveIndex] = null
                parent.insertBefore(moveVNode.el,oldStartVnode.el)
                patch(moveVNode,newStartVnode)
            }
            newStartVnode = newChildren[++newStartIndex]
            
        }
    }
    if(newStartIndex<=newEndIndex){
        for(let i = newStartIndex;i<=newEndIndex;i++){
            //将新的多的插入
            parent.appendChild(createElm(newChildren[i]))
        }
    }
    if(oldStartIndex <= oldEndIndex){
        for(let i =oldStartIndex;i<=oldEndIndex;i++){
            let child = oldChildren[i]
            if(child!=undefined){
                parent.removeChild(child.el)
            }
        }
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