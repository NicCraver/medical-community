import './public-path'
import Vue from 'vue'
import App from './App.vue'
import routes from './router'
import VueRouter from 'vue-router'
import { Message } from 'element-ui';

import './plugins/install'
import './style/install'
import './icon/index'

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  // __MICRO_APP_BASE_ROUTE__ 为micro-app传入的基础路由
  base: window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL,
  routes,
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
    console.log('referral getData:', window.microApp.getData())
    function setMenuPage(path) {
      window.microApp.dispatch({ path: window.microApp.getData().basePath + path })
    }
    function setMessageState() {
      window.microApp.dispatch({ flag: true })
    }
    Vue.prototype.$setMenuPage = setMenuPage
    Vue.prototype.$setMessageState = setMessageState

    let path = null
    // 监听基座下发的数据变化
    window.microApp.addDataListener((data) => {
      console.log('referral addDataListener:', data)
      console.log(' data.path', data.path)
      console.log('router.currentRoute.path', router.currentRoute.path)
      // 当基座下发path时进行跳转
      if (data.path && data.path !== router.currentRoute.path) {
        path = data.path
        let route
        if (data.name) {
          if (data.routeType === 'params') {
            route = {
              name: data.name,
              params: {
                referralInfo: data.referralInfo,
              },
            }
          } else {
            route = {
              name: data.name,
              query: data.queryField,
            }
          }
        } else {
          route = {
            path: data.path,
          }
        }
        if (data.routeChangeType === 'replace') {
          router.replace(route)
        } else {
          router.push(route)
        }
      } else {
        if (data.queryField) {
          let route = {
            name: data.name,
            query: data.queryField,
          }
          if (data.routeChangeType === 'replace') {
            router.replace(route)
          } else {
            router.push(route)
          }
        } else {
          Vue.prototype.$EVENT_BUS.$emit('noticationEmit', data.referralInfo)
        }
      }
    })

    // 处理系统信息
    console.log('localStorage.getItem("APP_INFO")', JSON.parse(localStorage.getItem('APP_INFO')))
    // 向基座发送数据
    setTimeout(() => {
      window.microApp.dispatch({ type: '管理后台应用' })
    }, 10)
  }
}

let app = null
// 将渲染操作放入 mount 函数
function mount() {
  Vue.prototype.$IS_ROOT_ADMIN = !!window.sessionStorage.getItem('isRootAdmin')
  // console.log('$IS_ROOT_ADMIN==', !!window.sessionStorage.getItem('isRootAdmin'))
  Vue.prototype.$IS_ORG_ADMIN = !!window.sessionStorage.getItem('isOrgAdmin')
  Vue.prototype.$IS_ORI_ADMIN = !!window.sessionStorage.getItem('isOriAdmin')
  Vue.prototype.$EVENT_BUS = new Vue()
  app = new Vue({
    router,
    render: (h) => h(App),
  }).$mount('#subapp-referral')
  console.log('子应用 - 微应用referral渲染了')
  handleMicroData()
}

// 将卸载操作放入 unmount 函数
function unmount() {
  app.$destroy()
  app.$el.innerHTML = ''
  app = null
  Message.closeAll()
  console.log('子应用 - 微应用referral卸载了')
}

// 微前端环境下，注册mount和unmount方法
if (window.__MICRO_APP_ENVIRONMENT__) {
  window[`micro-app-${window.__MICRO_APP_NAME__}`] = { mount, unmount }
} else {
  // 非微前端环境直接渲染
  mount()
}
