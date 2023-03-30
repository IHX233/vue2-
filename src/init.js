import {initState} from './state'
import { compileToFunctions } from './compiler/index.js'
import {mountComponent} from './lifecycle'
export function initMixin(Vue){
    Vue.prototype._init = function(options){
        const vm = this
        vm.$options = options
        //初始化状态（将数据做一个初始化劫持，当改变数据时更新视图）
        initState(vm)
        if(vm.$options.el){
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function(el){
        //挂载操作
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        vm.$el = el
        if(!options.render){
            //没有render，把template转换成render方法
            let template = options.template
            if(!template && el){
                template = el.outerHTML
            }
            //将模编译成render函数
            const render = compileToFunctions(template)
            options.render = render
        }
        mountComponent(vm,el)
    }
}