<template>
  <micro-app
    name="app-referral"
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
import { useMessage } from '../../components/TheHeader/useMessage'

const store = useStore()

const url = `${config.referral}/referral/`
const baseroute = process.env.BASE_URL + 'app-referral'

let microAppData = { basePath: '/app-referral', msg: '来自基座的数据' }
function handleCreate() {
  console.log('app-referral 创建了')
  store.dispatch('app/setAppLoading', true)
}

function handleBeforeMount() {
  console.log('app-referral 即将被渲染')
}

function handleMount() {
  console.log('app-referral 已经渲染完成')
  store.dispatch('app/setAppLoading', false)
}

function handleUnmount() {
  console.log('app-referral 卸载了')
  store.dispatch('app/setAppLoading', false)
}

function handleError() {
  console.log('app-referral 加载出错了')
  store.dispatch('app/setAppLoading', false)
}

function handleDataChange(e) {
  // 接收子应用传递的数据 e.detail.data
  console.log('来自子应用 app-referral 的数据:', e.detail.data)
  // path 通过监听path设置左侧菜单栏选中效果
  if (e.detail.data.path) {
    store.dispatch('app/setPath', e.detail.data.path)
  }
  // isAcrossApplication 判断是否为跨应用跳转
  if (e.detail.data.flag) {
    useMessage()
  }
  if (e.detail.data.isAcrossApplication) {
    store.dispatch('app/setIsAcrossApplication', e.detail.data.isAcrossApplication)
    store.dispatch('app/setAppName', e.detail.data.appName)
  }
}
</script>

<style lang="less" scoped></style>
