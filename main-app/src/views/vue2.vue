<template>
  <micro-app
    name="app-vue2"
    :url="url"
    :baseroute="process.env.BASE_URL + 'app-vue2'"
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
import config from '../config'
import { useStore } from 'vuex'

const store = useStore()

const url = `${config.vue2}/child/vue2/`
let microAppData = { basePath: '/app-vue2', msg: '来自基座的数据' }
function handleCreate() {
  console.log('child-vue2 创建了')
  store.dispatch('app/setAppLoading', true)
}

function handleBeforeMount() {
  console.log('child-vue2 即将被渲染')
}

function handleMount() {
  console.log('child-vue2 已经渲染完成')
  store.dispatch('app/setAppLoading', false)
}

function handleUnmount() {
  // console.log('child-vue2 卸载了');
}

function handleError() {
  // console.log('child-vue2 加载出错了');
  store.dispatch('app/setAppLoading', false)
}

function handleDataChange(e) {
  // console.log('state================', store.state.app.path)
  console.log('来自子应用 child-vue2 的数据:', e.detail.data)
  store.dispatch('app/setPath', e.detail.data.path) //存储
  // console.log('state================', store.state.app.path)
}
</script>

<style lang="less" scoped></style>
