import {pushTarget,popTarget} from './dep'
import {nextTick} from "../util"
let id = 0
class Watcher{
    constructor(vm,exprOrFn,cb,option){
        this.vm = vm
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.option = option
        this.id = id++ //watcher的唯一标识
        this.deps = [] //watcher记录有多少dep依赖它
        this.depsid = new Set()
        if(typeof exprOrFn == "function"){
            this.getter = exprOrFn
        }
        this.get()
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
        pushTarget(this)//当前watcher实例
        this.getter()
        popTarget()
    }
    run(){
        this.get()
    }
    update(){
        // this.get()//重新渲染
        queueWatcher(this)
    }
}
let queue = []//将需要批处理更新的watcher存到一个队列中，稍后让watcher执行
let has = {}
let pending = false
function flushSchedulerQueue(){
    queue.forEach(watcher => {watcher.run();watcher.cb()})
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