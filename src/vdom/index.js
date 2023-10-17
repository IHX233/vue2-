import { isReservedTag } from "../util"

export function renderMixin(Vue){
    Vue.prototype._c = function(){//创建虚拟dom元素
        return createElement(this,...arguments)
    }
    Vue.prototype._s = function(val){//stringify
        return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val
    }
    Vue.prototype._v = function(text){//创建虚拟dom文本元素
        return createTextVnode(text)
    }
    
    Vue.prototype._render = function(){//_render = render
        const vm = this
        const render = vm.$options.render
        let vnode = render.call(vm)
        return vnode 
    }
}
function createElement(vm,tag,data={},...children){
    //如果是组件 产生虚拟节点时需要把组件的构造函数传入
    if(isReservedTag(tag)){
        return vnode(tag,data,data.key,children)
    }else{
        let Ctor = vm.$option.components[tag]
        //创建组件的虚拟节点 children是插槽
        return createComponent(vm,tag,data,data.key,children,Ctor)
    }
    
}
function createComponent(){
    const baseCtor = vm.$options._base
    if(typeof Ctor == "object"){
        Ctor = baseCtor.extend(Ctor)
    }
    //给组件增加生命周期
    data.hook = {
        init(){

        }
    }
    return vnode(`vue-component-${Ctor.cid}-${tag}`,data,data.key,undefined,undefined,{Ctor,children})
}
function createTextVnode(text){
    return vnode(undefined,undefined,undefined,undefined,text)
}
function vnode(tag,data,key,children,text,componentOptions){
    return {
        tag,
        data,
        key,
        children,
        text,
        componentOptions
    }
}