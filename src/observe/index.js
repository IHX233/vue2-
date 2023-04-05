import { defineProperty } from "../util"
import { arrayMethods } from "./array"
import Dep from "./dep"
class Observe{
    constructor(value){
        //判断一个属性是否是被观测过，看它有没有_ob_属性
        defineProperty(value,'_ob_',this)
        if(Array.isArray(value)){
            value.__proto__ = arrayMethods
            this.observeArray(value)//数组中普通类型是不做观测的
        }else{
            this.walk(value)
        }
        
    }
    observeArray(value){
        value.forEach(item=>{
            observe(item)
        })
    }
    walk(data){
        let keys = Object.keys(data)
        keys.forEach(key=>{
            defineReactive(data,key,data[key])
        })
    }
}
function defineReactive(data,key,value){
    observe(value);//如果值为对象，继续监控
    let dep = new Dep()
    Object.defineProperty(data,key,{
        get(){//依赖收集
            if(Dep.target){//让这个属性记住这个watcher
                dep.depend()
            }
            return value
        },
        set(newValue){//依赖更新
            if(value === newValue) return
            observe(newValue) //如果新值设置为对象，继续监控
            value = newValue
            dep.notify()
        }
    })
}
export function observe(data){
    if(typeof data !== "object" || data == null){
        return data
    }
    if(data._ob_){
        return data
    }
    return new Observe(data)
}