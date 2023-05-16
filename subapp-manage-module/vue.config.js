let timeStamp = new Date().getTime()
const path = require('path')
const webpack = require('webpack')
const dayjs = require('dayjs')

const updateVersion = `后台管理 - 发布时间: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`

function resolve(dir) {
  // 路径可能与你的项目不同
  return path.join(__dirname, dir)
}

module.exports = {
  outputDir: 'manageModule',
  publicPath: '/manageModule/',
  productionSourceMap: false,
  devServer: {
    hot: false,
    disableHostCheck: true,
    port: 7054,
    open: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      // DefinePlugin 允许创建一个在编译时可以配置的全局常量
      new webpack.DefinePlugin({
        'process.env.UPDATE_VERSION': JSON.stringify(updateVersion),
      }),
    ],
  },
  // css: {
  //   extract: {
  //     // 添加时间戳到打包后css文件名称
  //     filename: `css/[name].${timeStamp}.css`,
  //     chunkFilename: `css/[id].${timeStamp}.css`,
  //   },
  // },
  // // 自定义webpack配置
  // configureWebpack: {
  //   output: {
  //     filename: `js/js[name].${timeStamp}.js`,
  //     chunkFilename: `js/[id].${timeStamp}.js`,
  //   },
  // },
  chainWebpack: (config) => {
    // const svgRule = config.module.rule('svg')
    // svgRule.uses.clear()
    // svgRule.use('svg-sprite-loader').loader('svg-sprite-loader').options({
    //   symbolId: 'icon-[name]',
    // })
    // config.module.rule('svg').uses.clear()
    // config.module
    //   .rule('svg1')
    //   .test(/\.svg$/)
    //   .use('svg-sprite')
    //   .loader('svg-sprite-loader')
    //   .options({
    //     symbolId: 'icon-[name]',
    //   })
    //   .end()
    //   .include.add(resolve('src/icon'))
    //   .end()
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icon')) // index.js 的路径
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icon')) // index.js 的路径
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
    config.module
      .rule('images')
      .use('url-loader')
      .tap((options) => {
        return {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
            },
          },
        }
      })
  },
}
