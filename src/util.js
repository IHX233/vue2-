export function proxy(vm,data,key){
    Object.defineProperty(vm,key,{
        get(){
            return vm[data][key]
        },
        set(newValue){
            vm[data][key] = newValue
        }
    }) 
}
export function defineProperty(target,key,value){
    Object.defineProperty(target,key,{
        enumerable:false, //不能被枚举
        configurable:false,
        value
    })
}