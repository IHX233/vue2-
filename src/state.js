import { observe } from "./observe/index.js"
import Watcher from "./observe/watcher.js"
import {proxy,nextTick} from "./util.js"

export function initState(vm){
    const opt = vm.$options
    if(opt.props){
        initProps(vm)
    }
    if(opt.data){
        initData(vm)
    }
    if(opt.methods){
        initMethods(vm)
    }
    if(opt.computed){
        initComputed(vm)
    }
    if(opt.watch){
        initWatch(vm)
    }
}
function initProps(){
    
}

function initData(vm){
    let data = vm.$options.data
    vm._data = data = typeof data == 'function'?data.call(vm):data
    for(let key in data){
        proxy(vm,'_data',key)
    }
    observe(data)//让对象重新定义set、get方法
}
function initMethods(){

}
function initComputed(){

}
function initWatch(vm){
    let watch = vm.$options.watch
    for(let key in watch){
        const handler = watch[key]
        if(Array.isArray(handler)){//数组
            handler.forEach(handle=>{
                createWatcher(vm,key,handle)
            })
        }else{//字符串、对象、函数
            createWatcher(vm,key,handler)
        }
    }
    
}
function createWatcher(vm,exprOrFn,handler,options={}){//options可以用来标识是用户watcher
    if(typeof handler == "object"){
        options = handler
        handler = handler.handler
    }
    if(typeof handler == "string"){
        handler = vm[handler]
    }
    return vm.$watch(exprOrFn,handler,options)
}
export function stateMixin(Vue){
    Vue.prototype.$nextTick = function(cb){
        nextTick(cb)
    }
    Vue.prototype.$watch = function(exprOrFn,cb,options){
        let watcher =  new Watcher(this,exprOrFn,cb,{...options,user:true})
        if(options.immediate){
            cb()
        }
    }
}