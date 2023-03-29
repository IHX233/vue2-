export function lifecycleMixin(Vue){
    Vue.prototype._update = function(vnode){
        console.log(vnode)
    }
}
export function mountComponent(vm,el){
    vm._update(vm._render())
}