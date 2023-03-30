export function patch(oldVnode,vnode){
    console.log(oldVnode,vnode)
    //虚拟dom转换为真实dom
    let el = createElm(vnode)//产生真实dom
    let parentElm = oldVnode.parentNode
    parentElm.insertBefore(el,oldVnode.nextSibling)//将新的节点插在老的节点前面
    parentElm.removeChild(oldVnode)//删除老的节点
}
function createElm(vnode){
    let {tag,children,key,data,text} = vnode
    if(typeof tag == "string"){
        vnode.el = document.createElement(tag)
        children.forEach(child=>{
            vnode.el.appendChild(createElm(child))
        })
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}