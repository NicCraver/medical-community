const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

const webpack = require('webpack');

var currentTime = new Date(new Date().setHours(new Date().getHours() + 8))
  .toISOString()
  .replace('Z', ' ')
  .replace('T', ' ');
const updateVersion = `表单设计器 - 发布时间: ${currentTime}`;

module.exports = {
  productionSourceMap: false,
  pages: {
    index: {
      // 修改项目的入口文件
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|.\css/, //匹配文件名
        threshold: 10240, //对超过10k的数据压缩
        deleteOriginalAssets: false //不删除源文件
      }),
      new webpack.DefinePlugin({
        'process.env.UPDATE_VERSION': JSON.stringify(updateVersion)
      })
    ],
    resolve: {
      alias: {
        packages: path.join(__dirname, './packages'),
        style: path.join(__dirname, './packages/style'),
        utils: path.join(__dirname, './packages/utils')
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [
            path.join(__dirname, 'packages'),
            path.join(__dirname, 'examples')
          ],
          options: {
            fix: true
          }
        }
      ]
    }
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include.add(path.resolve(__dirname, 'packages'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options;
      });
  },
  devServer: {
    host: '0.0.0.0',
    port: 8000, // 端口号
    open: true, //配置自动启动浏览器
    hotOnly: true // 热更新
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'field-placeholder-text-color': '#333333',
          blue: '#5381E3',
          'button-default-height': '40px',
          'field-input-disabled-text-color': '#333333',
          'radio-disabled-icon-color': '#333333',
          'radio-disabled-label-color': '#333333',
          'checkbox-disabled-icon-color': '#333333',
          'checkbox-disabled-label-color': '#333333'
        }
      }
    }
  }
};
