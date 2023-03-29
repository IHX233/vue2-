import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vdom/index";
export default function Vue(options){
    this._init(options)
}
//对原型进行拓展
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)