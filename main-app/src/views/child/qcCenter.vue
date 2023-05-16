<!--
 * @Author: Nic
 * @Date: 2023-01-16 10:17:32
 * @LastEditTime: 2023-01-16 10:18:28
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/main-app/src/views/child/qcCenter.vue
-->
<template>
  <micro-app
    name="app-qcCenter"
    :url="url"
    :baseroute="baseroute"
    :data="microAppData"
    @created="handleCreate"
    @beforemount="handleBeforeMount"
    @mounted="handleMount"
    @unmount="handleUnmount"
    @error="handleError"
    @datachange="handleDataChange"
  ></micro-app>
</template>

<script setup>
import config from '../../config'
import { useStore } from 'vuex'

const store = useStore()

const url = `${config.qcCenter}/qcCenter/`
const baseroute = process.env.BASE_URL + 'app-qcCenter'

let microAppData = { basePath: '/app-qcCenter', msg: '来自基座的数据' }
function handleCreate() {
  console.log('app-qcCenter 创建了')
  store.dispatch('app/setAppLoading', true)
}

function handleBeforeMount() {
  console.log('app-qcCenter 即将被渲染')
}

function handleMount() {
  console.log('app-qcCenter 已经渲染完成')
  store.dispatch('app/setAppLoading', false)
}

function handleUnmount() {
  console.log('app-qcCenter 卸载了')
  store.dispatch('app/setAppLoading', false)
}

function handleError() {
  console.log('app-qcCenter 加载出错了')
  store.dispatch('app/setAppLoading', false)
}

function handleDataChange(e) {
  // 接收子应用传递的数据 e.detail.data
  console.log('来自子应用 app-qcCenter 的数据:', e.detail.data)
  // path 通过监听path设置左侧菜单栏选中效果
  if (e.detail.data.path) {
    store.dispatch('app/setPath', e.detail.data.path)
  }
  // 判断是否跨应用跳转
  if (e.detail.data.isAcrossApplication) {
    store.dispatch('app/setIsAcrossApplication', e.detail.data.isAcrossApplication)
    store.dispatch('app/setAppName', e.detail.data.appName)
  }
}
</script>

<style lang="less" scoped></style>
