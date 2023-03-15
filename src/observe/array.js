let oldArrayProtoMethods = Array.prototype
export let arrayMethods = Object.create(oldArrayProtoMethods)
let methods = ['push','pop','shift','shift','reverse','sort','splice']
methods.forEach(method => {
    arrayMethods[method] = function(...arg){
        const result = oldArrayProtoMethods[method].apply(this,arg)
        let inserted;
        let ob = this._ob_
        switch(method){
            case 'push':
            case 'unshift'://两个都是增加，内容 可能是对象，需要劫持
                inserted = arg
                break;
            case 'splice'://$set原理
                inserted = arg.slice(2)
            default:
                break;
        }
        if(inserted){
            ob.observeArray(inserted)
        }
        return result
    }
})