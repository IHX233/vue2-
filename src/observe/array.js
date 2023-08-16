let oldArrayProtoMethods = Array.prototype
export let arrayMethods = Object.create(oldArrayProtoMethods)
let methods = ['push','pop','shift','unshift','reverse','sort','splice']
methods.forEach(method => {
    arrayMethods[method] = function(...args){
        //当调用数组劫持的七个方法时触发更新
        const result = oldArrayProtoMethods[method].apply(this,args)
        let inserted;
        let ob = this._ob_
        switch(method){
            case 'push':
            case 'unshift'://两个都是增加，内容 可能是对象，需要劫持
                inserted = args
                break;
            case 'splice'://$set原理
                inserted = args.slice(2)
            default:
                break;
        }
        if(inserted){
            ob.observeArray(inserted)
        }
        ob.dep.notify()//通知数组更新
        return result
    }
})