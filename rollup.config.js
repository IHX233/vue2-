import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
export default {
    input:'./src/index.js',//入口文件
    output:{
        format:'umd',//模块化的类型，
        name:'vue',//全局变量的名字
        file:'dist/umd/vue.js',//打包后文件位置
        sourcemap:true//将转化前代码与转化后代码形成映射，方便调试
    },
    plugins:[
        babel({
            exclude:'node_modules/**'//不转义的文件夹
        }),
        serve({//打开浏览器端口3000
            port:3000,
            contentBase:'',//打开文件得相对路径，空为相对当前文件
            openPage:'/index.html'//打开的文件
        })
    ]
}