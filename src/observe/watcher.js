import {pushTarget,popTarget} from './dep'
import {nextTick} from "../util"
import { watch } from 'rollup'
let id = 0
class Watcher{
    constructor(vm,exprOrFn,cb,options={}){
        this.vm = vm
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.options = options
        this.user = options.user//用户watcher标识
        this.isWatcher = typeof options === "boolean"//是渲染watch
        this.lazy = options.lazy //如果watcher上有lazy属性，就是一个计算属性
        this.dirty = this.lazy //ditty代表取值时是否执行用户的方法
        this.id = id++ //watcher的唯一标识
        this.deps = [] //watcher记录有多少dep依赖它
        this.depsid = new Set()
        if(typeof exprOrFn == "function"){
            this.getter = exprOrFn
        }else{
            this.getter = function(){
                let path = exprOrFn.split('.')
                let obj = vm
                for(let i=0;i<path.length;i++){
                    obj = obj[path[i]]
                }
                return obj 
            }
        }
        this.value = this.lazy? 0 :this.get()
    }
    addDep(dep){
        let id = dep.id
        if(!this.depsid.has(id)){
            this.deps.push(dep)
            this.depsid.add(id)
            dep.addSub(this)
        }
    }
    get(){
        //组件挂载的时候会调用一次get，此时getter是渲染页面，会触发definedProperty的get方法收集watcher依赖，所以要在这之前pushTarget然后再popTarget
        pushTarget(this)//当前watcher实例
        let result = this.getter.call(this.vm)
        popTarget()
        return result
    }
    run(){
        //用户watcher时取新老值
        let newValue = this.get()
        let oldValue = this.value
        this.value = newValue
        if(this.user){
            this.cb.call(this.vm,newValue,oldValue)
        }
    }
    update(){
        // this.get()//重新渲染
        if(this.lazy){//计算属性watcher不用更新页面
            this.dirty = true //页面重新渲染就能获取最新的值 
        }else{
            queueWatcher(this)
        }
        
    }
    evaluate(){
        this.value = this.get()
        this.dirty = false 
    }
    depend(){
        let i = this.deps.length
        while(i--){
            this.deps[i].depend()
        }
    }
}
let queue = []//将需要批处理更新的watcher存到一个队列中，稍后让watcher执行
let has = {}
let pending = false
function flushSchedulerQueue(){
    queue.forEach(watcher => {watcher.run();
        if(watcher.isWatcher){
            watcher.cb()
        }
        
    })
    queue = []
    has = {}
    pending = false
}
function queueWatcher(watcher){
    const id = watcher.id
    if(has[id] == null){
        queue.push(watcher)
        has[id] = true
        if(!pending){
            nextTick(flushSchedulerQueue)
            pending = true
        }
    }
}
export default Watcher