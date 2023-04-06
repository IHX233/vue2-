import { observe } from "./observe/index.js"
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
function initWatch(){

}
export function stateMixin(Vue){
    Vue.prototype.$nextTick = function(cb){
        nextTick(cb)
    }
}