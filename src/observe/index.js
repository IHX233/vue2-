class Observe{
    constructor(value){
        this.walk(value)
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
    Object.defineProperty(data,key,{
        get(){
            console.log('get',data,key)
            return value
        },
        set(newValue){
            console.log("set",data,key,newValue)
            if(value === newValue) return
            observe(newValue) //如果新值设置为对象，继续监控
            value = newValue
        }
    })
}
export function observe(data){
    if(typeof data !== "object" || data == null){
        return
    }
    return new Observe(data)
}