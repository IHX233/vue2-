import {initState} from './state'
export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this
        vm.$options = options
        //初始化状态（将数据做一个初始化劫持，当改变数据时更新视图）
        initState(vm)
    }
}