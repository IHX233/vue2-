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
export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed '
]
const strats = []
strats.data = function(parentVal,childValue){
    return childValue
}
strats.computed = function(){
    
}
strats.watch = function(){
    
}
function mergeHook(parentVal,childValue){
    if(childValue){
        if(parentVal){
            return parentVal.concat(childValue)//父亲和儿子拼接
        }else{
            return [childValue] //儿子转换为数组
        }
    }else{
        return parentVal //不合并，用父亲的
    }
}
LIFECYCLE_HOOKS.forEach(hook=>{
    strats[hook] = mergeHook
})   
 
export function mergeOptions(parent,child){
    const options = {}
    //遍历父亲
    for(let key in parent){//父亲和儿子都有的在这处理
        mergeField(key)
    }
    //儿子有父亲没有的在这处理
    for(let key in child){//将儿子多的赋予到父亲上
        if(!parent.hasOwnProperty(key)){
            mergeField(key)
        }

    }
    function mergeField(key){//合并字段
        if(strats[key]){
            options[key] = strats[key](parent[key],child[key])
        }else{
            options[key] = child[key]
        }
        
    }
    return options
}