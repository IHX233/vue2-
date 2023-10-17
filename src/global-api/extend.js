export default function initExtend(Vue){
    let cid = 0;
    Vue.extend = function(extendOptions){
        const Super = this;
        const Sub = function VueComponent(options){
            this._init(options)
        }
        Sub.cid = cid++
        //子类继承父类原型上的方法
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.options = mergeOptions(
            Super.options,
            extendOptions
        )
        Sub.components = Super.components
        return Sub
    }
}