const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js', //入口文件
  context: process.cwd(), //上下文目录
  mode: 'development', //开发模式
  output: {
    path: path.resolve(__dirname, 'dist'), //输出目录
    filename: 'monitor.js' //输出文件名
  },
  devServer: {
    // contentBase: path.resolve(__dirname, 'dist')
    static: {
      directory: path.join(__dirname, 'public')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({  //自动打包出html
      template: '.src/index.html',
      inject: 'head'
    })
  ]
}