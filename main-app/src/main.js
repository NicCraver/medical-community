import 'ant-design-vue/dist/antd.less' // antd css
import '@ant-design-vue/pro-layout/dist/style.css'
import './styles/theme-file.less'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import store from './store'
import microApp from '@micro-zoe/micro-app'

import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout'

import Antd from 'ant-design-vue'

import VueNativeSock from 'vue-native-websocket-vue3'
microApp.start({
  // disableScopecss: <true></true>,
})

import sharedData from './shared'
microApp.setGlobalData(sharedData)

const app = createApp(App)

app.use(Antd)
app.use(ProLayout)
app.use(PageContainer)
app.use(store)
app.use(router).mount('#app')
app.use(VueNativeSock, `${process.env.VUE_APP_WS_BASE_URL}/ygt-message-server/message`, {
  // 启用Vuex集成
  store: store,
  // 开启手动调用 connect() 连接服务器
  connectManually: true,
  // 开启自动重连
  reconnection: true,
  // 尝试重连的次数
  reconnectionAttempts: 5,
  // 重连间隔时间
  reconnectionDelay: 3000,
})
export default app