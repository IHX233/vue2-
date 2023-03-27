import {parseHtml} from './parse.js'
import { generate } from './generate.js'
export function compileToFunctions(template){
    //1.将html转化为ast语法树
    let ast = parseHtml(template)

    //2.优化静态节点

    //3.通过这棵树重新生成代码
    let code = generate(ast)

    //4.将字符串变成函数 限制取值范围 通过with进行取值 之后通过render函数就可以改变this 让这个函数内部取到结果
    let render = new Function(`with(this){return ${code}}`)
    console.log(render)
    return render
}