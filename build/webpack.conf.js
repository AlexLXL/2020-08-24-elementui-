const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); // 编译进度条(webpack-dashboard的一种,让打包的过程可视)
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // 解析和转换 .vue 文件（提取出其中的逻辑代码 script、样式代码 style、以及 HTML 模版 template，再分别把它们交给对应的 Loader 去处理，核心的作用，就是提取）
const TerserPlugin = require('terser-webpack-plugin'); // webpack新版本中default built-in的工具已经由旧有的uglifyJS变成了terserJS
// 旧的uglify已经被depreacted处理，相信不久之后的状态就会变成legacy，新的terser更好的性能，对ES6+的语法支持的更多，也同时兼容了babel 7的生态

const config = require('./config');

module.exports = {
  mode: 'production',
  entry: {
    app: ['./src/index.js']
  },
  output: {
    // __dirname：获得当前执行文件所在目录的完整目录名
    // __filename：获得当前执行文件的带有完整绝对路径的文件名
    // process.cwd()：获得当前执行node命令时候的文件夹目录名
    path: path.resolve(process.cwd(), './lib'),
    // publicPath主要是对你的页面里面引入的资源的路径做对应的补全，常见的就是css文件里面引入的图片
    publicPath: '/dist/',
    filename: 'index.js',
    // https://www.html.cn/doc/webpack/guides/code-splitting.html
    // 非入口 chunk 的名称
    chunkFilename: '[id].js',
    // 开发库library、libraryTarget使用较多
    // 不同的模块化？
    // https://www.jianshu.com/p/d22f678af5b7
    // http://www.caotama.com/58208.html
    // https://blog.csdn.net/frank_yll/article/details/78992778
    // libraryTarget 设置成什么，底下的externals就会取对应的选项来进行require
    //
    // var, assign, this, window, global,
    // commonjs, comonjs2, amd, umd, jsonp
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'ELEMENT',
    umdNamedDefine: true,
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: config.alias
  },
  externals: {
    vue: config.vue
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  performance: {
    hints: false
  },
  stats: {
    children: false
  },
  module: {
    rules: [
      // 处理jsx等文件
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: config.jsexclude,
        loader: 'babel-loader'
      },
      // 处理packages下面的vue组件
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin()
  ]
};
