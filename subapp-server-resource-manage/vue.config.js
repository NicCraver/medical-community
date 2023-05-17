/*
 * @Author: Nic
 * @Date: 2023-03-23 22:45:37
 * @LastEditTime: 2023-03-27 13:51:08
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-server-resource-manage/vue.config.js
 */
module.exports = {
  outputDir: 'serverResourceManage',
  // publicPath: '/ygt/serverResourceManage/', //heilongjang
  publicPath: '/serverResourceManage/',
  productionSourceMap: false,
  devServer: {
    hot: false,
    disableHostCheck: true,
    port: 7059,
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
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "views": "@/views",
        "components": "@/components",
        "api": "@/api/modules",
        'img': '@/assets/img',
        'utils': '@/utils'
      }
    }
  },
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
