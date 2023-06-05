<template>
  <div id="subapp-healthFile">
    <transition name="zoom" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { getDictCodesList, getDiaCodesList } from "@/utils/dictCodes.js";
import { getPrivacyConfig } from "api/infomationPlatform/healthRecord.js";

export default {
  name: 'App',
  watch: {
    $route(to, from) {
      console.log('to=========', to)
      this.$setMenuPage(to.path)
    },
  },
  created() {
    getDictCodesList();
    getDiaCodesList();
    // 隐私配置
    this.getPrivacyConfig();
  },
  mounted() {
    const arr = document.getElementsByClassName('v-modal')
    console.log('arr==============', arr)
    const l = arr.length
    if (l !== 0) {
      for (let i = l - 1; i >= 0; i--) {
        if (arr[i] != null) {
          arr[i].parentNode.removeChild(arr[i])
        }
      }
    }
  },
  methods: {
    async getPrivacyConfig() {
      try {
        let res = await getPrivacyConfig();
        let result = res.result;
        result.illPrivacies = JSON.parse(result.illPrivacies);
        result.unSendMessageUsers = JSON.parse(result.unSendMessageUsers);
        this.$store.commit("base/SET_PRIVACY_CONFIG", result);
      } catch (error) {}
    },
  },
}
</script>

<style>
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
</style>
