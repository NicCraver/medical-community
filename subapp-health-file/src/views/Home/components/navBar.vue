<template>
  <div class="navBar">
    <div class="title">
      <!-- <img
        src="@/assets/anx-logo.png"
        alt=""
        style="width: 26px; height: 26px; margin-right: 10px"
        v-if="proEnv !== 'heilongjiang'"
      /> -->
      <div>
        <!-- {{ proEnv === "heilongjiang" ? "黑龙江电子病历" : "健康档案共享调阅" }} -->
        患者档案
      </div>
    </div>
    <div class="user">
      <div class="fasFaPowerOff" @click="closeFuc">
        <!-- <IconSvg
          iconClass="fasFaPowerOff"
          style="color: #fff"
          width="16"
          height="16"
        ></IconSvg> -->
        <div class="closeBtn">返回</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'navBar',
  components: {},
  data() {
    return {}
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT
    },
  },
  methods: {
    closeFuc() {
      if (this.proEnv === 'heilongjiang') {
        this.$router.push('/residentCenterInfo')
        return
      }
      this.$router.push('/residentCenter')
    },
  },
}
</script>
<style lang="scss" scoped>
.navBar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .title {
    // color: rgba(242, 242, 247, 100);
    font-size: 16px;
    text-align: left;
    font-family: SourceHanSansSC-bold;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: 10px;
    font-weight: 600;
    color: #303133;
  }
  .user {
    color: rgba(253, 253, 253, 100);
    font-size: 14px;
    text-align: left;
    font-family: SourceHanSansSC-regular;
    display: flex;
    flex-direction: row;
    align-items: center;
    .userHeadPortrait {
      margin-right: 10px;
      width: 32px;
      height: 32px;
      border-radius: 100px;
      background-color: rgba(255, 255, 255, 100);
    }
    .userName {
      margin-right: 20px;
    }
    .fasFaPowerOff {
      display: flex;
      align-items: center;
      cursor: pointer;
      .closeBtn {
        display: inline-block;
        margin-right: 10px;
        color: #606266;
        border: 1px solid #606266;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;
        background: #fff;
      }
    }

    .userSetting {
      height: 16px;
      width: 16px;
      cursor: pointer;
      font-size: 16px;
    }
    .platform {
      cursor: pointer;
      float: right;
      font-weight: 400;
      margin-left: 10px;
    }
  }
}
</style>
