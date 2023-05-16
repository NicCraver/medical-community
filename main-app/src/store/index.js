import { createStore } from 'vuex'
import { loadStoreModules } from '../utils'
import getters from './getters'
import main from '../main'
import { useMessage } from '@/components/TheHeader/useMessage'
import { NotificationOptions } from '@/components/NotificationOptions'
import createPersistedState from 'vuex-persistedstate'

export const store = createStore({
  state: {
    socket: {
      // 连接状态
      isConnected: false,
      // 消息内容
      message: '',
      // 重新连接错误
      reconnectError: false,
      // 心跳消息发送时间
      // heartBeatInterval: 50000,
      heartBeatInterval: 10000,
      // 心跳定时器
      heartBeatTimer: 0,
    },
  },
  mutations: {
    // 连接打开
    SOCKET_ONOPEN(state, event) {
      console.log('event', event)
      main.config.globalProperties.$socket = event.currentTarget
      state.socket.isConnected = true
      // 连接成功时启动定时发送心跳消息，避免被服务器断开连接
      state.socket.heartBeatTimer = setInterval(() => {
        const message = '心跳消息'
        state.socket.isConnected &&
          main.config.globalProperties.$socket.send({
            code: 200,
            msg: message,
          })
        console.log('心跳消息')
      }, state.socket.heartBeatInterval)
    },
    // 连接关闭
    SOCKET_ONCLOSE(state, event) {
      state.socket.isConnected = false
      // 连接关闭时停掉心跳消息
      clearInterval(state.socket.heartBeatTimer)
      state.socket.heartBeatTimer = 0
      console.log('连接已断开', event)
      console.log('连接已断开: ' + new Date())
    },
    // 发生错误
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    // 收到服务端发送的消息
    SOCKET_ONMESSAGE(state, message) {
      console.log('收到服务端发送的消息', message)
      // console.log('message.data', typeof message.data)
      // let messageData = JSON.parse(message.data)
      // console.log('message.data.messageType', messageData.messageType)
      if (message.data !== '连接成功') {
        let messageData = JSON.parse(message.data)
        NotificationOptions(messageData)
        useMessage()
      }
      state.socket.message = message
    },
    // 自动重连
    SOCKET_RECONNECT(state, count) {
      console.info('消息系统重连中...', state, count)
    },
    // 重连错误
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true
    },
  },
  actions: {
    setSOCKET_ONCLOSE({ commit }) {
      commit('SOCKET_ONCLOSE')
    },
  },
  modules: loadStoreModules(require.context('./modules', true, /\.js$/)),
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  getters,
})
// const store = new Vuex.Store({
//   modules: loadStoreModules(require.context('./modules', true, /\.js$/)),
//   getters
// })
export default store
