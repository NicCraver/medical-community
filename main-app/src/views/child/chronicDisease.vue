<!--
 * @Author: Nic
 * @Date: 2023-02-07 15:19:22
 * @LastEditTime: 2023-02-17 18:08:46
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/main-app/src/views/child/chronicDisease.vue
-->
<template>
  <micro-app
    name="app-chronicDisease"
    style="height: 100%"
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

const { state } = inject('state')

const url = `${config.chronicDisease}/chronicDisease/`
const baseroute = process.env.BASE_URL + 'app-chronicDisease'

let microAppData = { basePath: '/app-chronicDisease', msg: '来自基座的数据' }
function handleCreate() {
  console.log('app-chronicDisease 创建了')
  store.dispatch('app/setAppLoading', true)
}

function handleBeforeMount() {
  console.log('app-chronicDisease 即将被渲染')
}

function handleMount() {
  console.log('app-chronicDisease 已经渲染完成')
  store.dispatch('app/setAppLoading', false)
}

function handleUnmount() {
  console.log('app-chronicDisease 卸载了')
  store.dispatch('app/setAppLoading', false)
}

function handleError() {
  console.log('app-chronicDisease 加载出错了')
  store.dispatch('app/setAppLoading', false)
}

function handleDataChange(e) {
  // 接收子应用传递的数据 e.detail.data
  console.log('来自子应用 app-chronicDisease 的数据:', e.detail.data)
  // path 通过监听path设置左侧菜单栏选中效果
  store.dispatch('app/setPath', e.detail.data.path)
  // isAcrossApplication 判断是否为跨应用跳转
  if (e.detail.data.isAcrossApplication) {
    store.dispatch('app/setIsAcrossApplication', e.detail.data.isAcrossApplication)
    store.dispatch('app/setAppName', e.detail.data.appName)
  }
  if (e.detail.data.breadcrumbData) {
    console.log(`e.detail.data.breadcrumbData`, e.detail.data.breadcrumbData)
    if (!e.detail.data.update) {
      state.breadcrumbData = state.breadcrumbData.slice(0, -1).concat(e.detail.data.breadcrumbData.concat(state.breadcrumbData.slice(-1)))
    } else {
      console.log(`e.detail.data.breadcrumbData`, e.detail.data.breadcrumbData)
      state.breadcrumbData.forEach((el) => {
        if (el.path === 'title') {
          el.meta.title = e.detail.data.breadcrumbData
          console.log(`el`, el)
        }
      })
    }
    console.log(`state`, state)
  }
}
</script>

<style lang="less" scoped></style>
