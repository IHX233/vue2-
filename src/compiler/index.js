import {parseHtml} from './parse.js'
import { generate } from './generate.js'
export function compileToFunctions(template){
    let ast = parseHtml(template)
    let code = generate(ast)
    console.log(code)
}