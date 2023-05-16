<template>
  <micro-app
    name="app-mdt"
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

const url = `${config.mdt}/mdt/`
const baseroute = process.env.BASE_URL + 'app-mdt'

let microAppData = { basePath: '/app-mdt', msg: '来自基座的数据' }
function handleCreate() {
  console.log('app-mdt 创建了')
  store.dispatch('app/setAppLoading', true)
}

function handleBeforeMount() {
  console.log('app-mdt 即将被渲染')
}

function handleMount() {
  console.log('app-mdt 已经渲染完成')
  store.dispatch('app/setAppLoading', false)
}

function handleUnmount() {
  console.log('app-mdt 卸载了')
  store.dispatch('app/setAppLoading', false)
}

function handleError() {
  console.log('app-mdt 加载出错了')
  store.dispatch('app/setAppLoading', false)
}

function handleDataChange(e) {
  // 接收子应用传递的数据 e.detail.data
  console.log('来自子应用 app-mdt 的数据:', e.detail.data)
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
