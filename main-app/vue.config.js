/*
 * @Author: Nic
 * @Date: 2022-11-29 10:19:48
 * @LastEditTime: 2023-03-13 17:11:35
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/main-app/vue.config.js
 */
// const path = require('path')
// const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const webpack = require('webpack')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const dayjs = require('dayjs')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const updateVersion = `主应用发布时间: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`
let timeStamp = new Date().getTime()

const ENV_CONFIG = process.env.ENV_CONFIG ? JSON.parse(process.env.ENV_CONFIG) : '{}';

// 如果是黑龙江环境
let browserTitle = process.env.VUE_APP_BROWSER_TITLE
let publicPath = '/'
if (process.env.VUE_APP_BROWSER_TITLE === '黑龙江电子病历') {
  browserTitle = ENV_CONFIG.browserTitle
  publicPath = ENV_CONFIG.publicPath
}

const plugins = [
  // DefinePlugin 允许创建一个在编译时可以配置的全局常量
  new webpack.DefinePlugin({
    'process.env.UPDATE_VERSION': JSON.stringify(updateVersion),
    // 'process.env.VUE_APP_SHOW_LOG': JSON.stringify(ENV_CONFIG.VUE_APP_SHOW_LOG),
  }),
  AutoImport({
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],
    imports: [
      // presets
      'vue',
      'vue-router',
      // custom
      // {
      //   '@vueuse/core': [
      //     // named imports
      //     'useMouse', // import { useMouse } from '@vueuse/core',
      //     // alias
      //     ['useFetch', 'useMyFetch'], // import { useFetch as useMyFetch } from '@vueuse/core',
      //   ],
      // },
    ],
    // resolvers: [ElementPlusResolver()],
  }),
  Components({
    // resolvers: [ElementPlusResolver()],
  }),
]

if (ENV_CONFIG.VUE_APP_SHOW_LOG == "false") {
  plugins.push(
    new UglifyJsPlugin({
      sourceMap: false,
      uglifyOptions: {
        output: {
          comments: false, // 去掉注释
        },
        warnings: false,
        compress: {
          drop_console: true,
          drop_debugger: false,
          pure_funcs: ['console.log'], //移除console
        },
      },
    })
  )
}

module.exports = {
  outputDir: 'main',
  publicPath: publicPath,
  productionSourceMap: false,
  devServer: {
    hot: false,
    disableHostCheck: true,
    port: 3000,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
  },
  css: {
    extract: {
      // 添加时间戳到打包后css文件名称
      filename: `css/[name].${timeStamp}.css`,
      chunkFilename: `css/[id].${timeStamp}.css`,
    },
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#446ABD',
        },
        javascriptEnabled: true,
      },
    },
  },
  configureWebpack: {
    name: browserTitle,
    output: {
      filename: `js/js[name].${timeStamp}.js`,
      chunkFilename: `js/[id].${timeStamp}.js`,
      jsonpFunction: `webpackJsonp-ygt`,
    },
    plugins: plugins,
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        options.compilerOptions = {
          ...(options.compilerOptions || {}),
          isCustomElement: (tag) => /^micro-app/.test(tag),
        }
        return options
      })
  },
}
