import {pushTarget,popTarget} from './dep'
let id = 0
class Watcher{
    constructor(vm,exprOrFn,cb,option){
        this.vm = vm
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.option = option
        this.id = id++ //watch的唯一标识
        if(typeof exprOrFn == "function"){
            this.getter = exprOrFn
        }
        this.get()
    }
    get(){
        pushTarget(this)//当前watcher实例
        this.getter()
        popTarget()
    }
    update(){
        this.get()//重新渲染
    }
}
export default Watcher