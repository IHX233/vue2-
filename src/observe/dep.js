let id = 0
class Dep{
    constructor(){
        this.subs = []
        this.id = id++
    }
    depend(){
        //dep存放watch，watch也存放dep
        Dep.target.addDep(this)
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
}
Dep.target = null
let stack = []
export function pushTarget(watcher){
    Dep.target = watcher
    stack.push(watcher)
}
export function popTarget(){
    stack.pop()
    Dep.target = stack[stack.length - 1]
}
export default Dep
//多对多的关系，一个属性有一个dep来收集watcher
//dep可以存多个watch
//一个watch可以对应多个dep