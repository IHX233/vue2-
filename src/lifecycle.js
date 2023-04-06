import {patch} from './vdom/patch'
import Watcher from './observe/watcher'
export function lifecycleMixin(Vue){
    Vue.prototype._update = function(vnode){
        const vm = this
        //用新创建的元素，替换老的vm.$el
        vm.$el = patch(vm.$el,vnode)
    }
}
export function mountComponent(vm,el){
    callHook(vm,'beforeMount')
    let updateComponent = () => {
        vm._update(vm._render())
    }
    //初始化创建watcher
    let watcher = new Watcher(vm,updateComponent,()=>{
        callHook(vm,'updated')
    },true)
    watcher.get()
    callHook(vm,'mounted')
}
export function callHook(vm,hook){
    const handlers = vm.$options[hook]
    if(handlers){
        for(let i = 0;i<handlers.length;i++){
            handlers[i].call(vm)
        }
    }
}