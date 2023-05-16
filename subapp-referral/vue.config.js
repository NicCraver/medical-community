let timeStamp = new Date().getTime()

module.exports = {
  outputDir: 'referral',
  publicPath: '/referral/',
  productionSourceMap: false,
  devServer: {
    hot: false,
    disableHostCheck: true,
    port: 7055,
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
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.use('svg-sprite-loader').loader('svg-sprite-loader').options({
      symbolId: 'icon-[name]',
    })
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
