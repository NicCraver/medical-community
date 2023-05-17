import './public-path'
import Vue from 'vue'
import App from './App.vue'
import routes from './router'
import VueRouter from 'vue-router'
import store from './store/index'

import './plugins/install'
import './style/install'
import './icon/index'

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  // __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
  base: window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const arr = document.getElementsByClassName('el-popper')
  if (arr.length !== 0) {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] != null) {
        arr[i].parentNode.removeChild(arr[i])
      }
    }
  }
  next()
})

// 与基座进行数据交互
function handleMicroData() {
  // 是否是微前端环境
  if (window.__MICRO_APP_ENVIRONMENT__) {
    // 主动获取基座下发的数据
    console.log('server-resource-manage getData:', window.microApp.getData())
    // 页面跳转 通知 主应用 菜单切换
    function setMenuPage(path) {
      window.microApp.dispatch({ path: window.microApp.getData().basePath + path })
    }
    Vue.prototype.$setMenuPage = setMenuPage

    let path = null

    // 监听基座下发的数据变化
    window.microApp.addDataListener((data) => {
      console.log('server-resource-manage addDataListener:', data)
      // console.log(' data.path', data.path)
      // console.log('router.currentRoute.path', router.currentRoute.path)
      // 当基座下发path时进行跳转
      if (data.path && data.path !== router.currentRoute.path) {
        if (data.params || data.query) {
          router.push(data)
        } else {
          path = data.path
          router.push(data.path)
        }
      } else {
        // 相同路径下
        if (data.replace) {
          router.push(data)
        }
      }
    })

    // 向基座发送数据
    setTimeout(() => {
      window.microApp.dispatch({ type: '管理后台应用' })
    }, 10)
  }
}

let app = null
// 将渲染操作放入 mount 函数
function mount() {
  app = new Vue({
    router, store,
    render: (h) => h(App),
  }).$mount('#subapp-server-resource-manage')
  console.log('子应用 - 微应用server-resource-manage渲染了')
  handleMicroData()
}

// 将卸载操作放入 unmount 函数
function unmount() {
  app.$destroy()
  app.$el.innerHTML = ''
  app = null
  console.log('子应用 - 微应用server-resource-manage卸载了')
}

// 微前端环境下，注册mount和unmount方法
if (window.__MICRO_APP_ENVIRONMENT__) {
  window[`micro-app-${window.__MICRO_APP_NAME__}`] = { mount, unmount }
} else {
  // 非微前端环境直接渲染
  mount()
}
