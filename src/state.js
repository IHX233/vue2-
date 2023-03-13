import { observe } from "./observe/index.js"

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
    observe(data)
}
function initMethods(){

}
function initComputed(){

}
function initWatch(){

}