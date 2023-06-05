const webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// const uglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

/* const envPlugins = {
  "黑龙江": {
    "htmlTitle": "黑龙江电子病历门户",
    "htmlLogoIcon": "",
    "publicPath": "/ehr"
  },
  "阿克苏": {
    "htmlTitle": "健康档案共享调阅",
    "htmlLogoIcon": "/akesu-logo.png",
    "publicPath": "/"
  },
  "product": {
    "htmlTitle": "健康档案共享调阅",
    "htmlLogoIcon": "/mdTimerB.png",
    "publicPath": "/"
  }
}
let htmlTitle = envPlugins[window.g.VUE_APP_ENVIRONMENT].htmlTitle || "健康档案共享调阅";
let htmlLogoIcon = envPlugins[window.g.VUE_APP_ENVIRONMENT].htmlLogoIcon || "/mdTimerB.png";
let publicPath = envPlugins[window.g.VUE_APP_ENVIRONMENT].publicPath || "/"; */

module.exports = {
  outputDir: 'healthFile',
  // publicPath: '/healthFile/',
  publicPath: '/ygt/ehr/healthFile/',
  productionSourceMap: false,
  devServer: {
    hot: false,
    disableHostCheck: true,
    port: 7057,
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
    plugins: [
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        // test: /\.js$|\.html$|\.json$|\.css/,
        test: /\.js$|\.json$|\.css/,
        threshold: 10240, // 只有大小大于该值的资源会被处理
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        // deleteOriginalAssets: isProduction ? true : false, // 删除原文件
      }),
      new webpack.ProvidePlugin({
        "$": "jquery"
      }),
      // 打包后输出日志配置
      /* new uglifyjsWebpackPlugin({
        uglifyOptions: {
          compress: {
            drop_console: false,
            drop_debugger: false,
            pure_funcs: []
          }
        }
      }) */
    ],
    resolve: {
      alias: {
        "@": resolve("src"),
        "api": "@/api/modules",
        "img": "@/assets/img",
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/style/variable.scss";
        `
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
