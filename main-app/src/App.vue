<template>
  <div id="app-container">
    <a-config-provider v-if="hasToken">
      <!-- 需要渲染菜单的界面 -->
      <template v-if="!isHealthHome">
        <BasicLayout></BasicLayout>
      </template>
      <!-- 不需要菜单的界面 -->
      <template v-else>
        <router-view v-slot="{ Component }">
          <transition name="zoom" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </template>
    </a-config-provider>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import microApp, { getActiveApps } from '@micro-zoe/micro-app'
import SettingDrawer from './components/SettingDrawer'
import BasicLayout from './layouts/BasicLayout.vue'
import { message } from 'ant-design-vue'
import { createVNode } from 'vue'
import { useStore } from 'vuex'
const hasToken = ref()
const store = useStore()
const route = useRoute()
const router = useRouter()
message.config({
  maxCount: 9,
})
watch(
  () => route.path,
  (newValue, oldValue) => {
    if (
      newValue &&
      (newValue.indexOf('/app-healthFile/Home') > -1 ||
        newValue.indexOf('/app-healthFile/residentCenterInfo') > -1 ||
        newValue.indexOf('/singleSign') > -1)
    ) {
      isHealthHome.value = true
    } else {
      isHealthHome.value = false
    }

    if (newValue === '/login') {
      hasToken.value = null
    } else {
      hasToken.value = sessionStorage.getItem('token')
      const urlsName = ['/singleSign', '/singleSignOn', '/singleSignIn']
      if (!hasToken.value && urlsName.indexOf(route.path) < 0) {
        router.push('/login')
      }
    }
  },
)
let isHealthHome = ref(false)

onMounted(() => {
  // let VUE_APP_PORT = ':7001'
  // // console.log(`globalApi=========`,globalApi)
  // let global = JSON.parse(JSON.stringify(process.env));
  // // test
  // let tempPort = ":7001";
  // // 如果有端口配置

  // if (window.g.VUE_APP_BASE_PORT) {
  //   // test
  //   // let host = "124.196.7.86:7052";
  //   // let port = "7052";
  //   let host = window.location.host;
  //   let port = window.location.port;
  //   let http = "http://";
  //   let ws = "ws://";
  //   if (port !== "" && host.indexOf(":" + port) != -1) {
  //     host = host.replace(":" + port, "");
  //   }
  //   console.log(`host`, host);
  //   global.VUE_APP_BASE_API = http + host + ":7001";
  //   global.VUE_APP_WS_BASE_URL = ws + host + ":7001";
  //   global.VUE_APP_VIDEO_BASE_URL = host + ":7002";
  //   global.VUE_APP_WS_MDT_BASE_URL = ws + host + ":7003";
  //   global.VUE_APP_DICOM_MDT_URL = http + host + ":7004";
  // }
  window.console.info(`%c${process.env.UPDATE_VERSION}`, 'font-size:20px;color:#f5222d;')
  console.log(`%c请求接口地址：${window.g.VUE_APP_BASE_API}`, 'font-size:16px;color:#f5222d;')
  console.log(`%c系统名称：${window.g.VUE_APP_BROWSER_TITLE}`, 'font-size:16px;color:#f5222d;')
  console.log(`%c构建类型：${window.g.VUE_APP_BUILD_ENV}`, 'font-size:16px;color:#f5222d;')
// 修改浏览器 title
  document.title = window.g.VUE_APP_BROWSER_TITLE
  // 获取token
  hasToken.value = sessionStorage.getItem('token')
})
</script>

<style>
#app {
  height: 100%;
}

.zoom-enter-active,
.zoom-leave-active {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: zoomIn;
}

.zoom-leave-active {
  animation-direction: reverse;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.95, 0.95, 0.95);
  }

  100% {
    opacity: 1;
  }
}
@keyframes zoomOut {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: scale3d(0.95, 0.95, 0.95);
  }
}
.ant-message-custom-content {
  display: flex;
  align-items: center;
}
</style>
