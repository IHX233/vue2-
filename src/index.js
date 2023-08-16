import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vdom/index";
import {initGlobalApi} from "./global-api/index"
import {stateMixin} from "./state"
export default function Vue(options){
    this._init(options)
}
//对原型进行拓展 原型方法
initMixin(Vue) //init方法
lifecycleMixin(Vue) //_update
renderMixin(Vue) //_render
stateMixin(Vue)

//静态方法
initGlobalApi(Vue)

// import { compileToFunctions } from "./compiler/index";
// import {createElm, patch} from "./vdom/patch"
// let vm1 = new Vue({data:{name:'ihx'}})
// let render1 = compileToFunctions(`<div>
//     <li style="background:red">A</li>
//     <li style="background:pink">B</li>
//     <li style="background:yellow">C</li>
//     <li style="background:green">D</li>
// </div>`)
// let vnode1 = render1.call(vm1)
// document.body.appendChild(createElm(vnode1))
// let vm2 = new Vue({data:{name:'gf'}})
// let render2 = compileToFunctions(`<div>
// <li style="background:purple">A</li>
// <li style="background:pink">B</li>
// <li style="background:yellow">C</li>
// <li style="background:green">D</li>
// <li style="background:blue">E</li>
// </div>`)
// let vnode2 = render2.call(vm2)
// setTimeout(()=>{
//     patch(vnode1,vnode2)
// },1000)
