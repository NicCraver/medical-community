<template>
  <div class="home">
    <div class="navBar">
      <navBar></navBar>
    </div>
    <div class="main">
      <component :is="mainCom"></component>
    </div>
  </div>
</template>

<script>
import navBar from "./components/navBar.vue";
import healthRecord from "@/views/healthRecord/index.vue";

import {
  getModuleList,
  getPrivacyConfig,
} from "api/infomationPlatform/healthRecord.js";
import { mapActions } from "vuex";

export default {
  name: "home",
  components: {
    navBar,
    healthRecord,
  },
  data() {
    return {
      mainCom: null,
    };
  },
  created() {
    this.getInfoData();
    this.getPrivacyConfig(); // 隐私配置
  },
  methods: {
    ...mapActions({
      setInfomationPlatforms: "base/setInfomationPlatforms",
    }),
    async getInfoData() {
      try {
        let res = await getModuleList();
        if (res.code === 0) {
          console.log("模块配置：", res);
          this.setInfomationPlatforms(res.result);
          this.mainCom = healthRecord;
        }
      } catch (error) {}
    },
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
};
</script>

<style lang="scss" scoped>
.home {
  // height: calc(100vh - 50px);
  height: 100vh;
  .navBar {
    height: 50px;
    background-color: #134796;
  }
  .main {
    height: calc(100% - 60px);
    margin-top: 10px;
  }
}
</style>
