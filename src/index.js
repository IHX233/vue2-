import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vdom/index";
import {initGlobalApi} from "./global-api/index"
export default function Vue(options){
    this._init(options)
}
//对原型进行拓展 原型方法
initMixin(Vue) //init方法
lifecycleMixin(Vue) //_update
renderMixin(Vue) //_render

//静态方法
initGlobalApi(Vue)