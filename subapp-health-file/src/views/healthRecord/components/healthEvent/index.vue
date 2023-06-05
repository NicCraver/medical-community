<template>
  <div class="healthEvent">
    <!-- 左侧内容区域 -->
    <el-card class="left-cont">
      <outpRecords :navBarObj="navBarObj"></outpRecords>
    </el-card>
    <!-- 右侧导航 -->
    <el-card class="right-cont">
      <navigationBar :personalInfos="personalInfos" @loadEventFuc="loadEventFuc"></navigationBar>
    </el-card>
  </div>
</template>

<script>
import navigationBar from "./components/navigationBar.vue";
import outpRecords from "./components/outpRecords.vue"; //门诊记录内容

export default {
  name: "healthEvent",
  components: {
    navigationBar,
    outpRecords,
  },
  props: {
    // 健康档案
    personalInfos: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // 导航传过来的内容
      navBarObj: {},
    };
  },
  watch: {
    personalInfos: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {},
      deep: true,
    },
  },
  created() {},
  methods: {
    loadEventFuc(obj) {
      this.navBarObj = obj.item;
    },
  },
};
</script>

<style lang="scss">
.healthEvent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  .left-cont {
    width: calc(100% - 350px);
    margin-right: 10px;
    ::v-deep.el-card__body {
      padding: 0 !important;
      height: calc(100% - 2px);
    }
  }
  .right-cont {
    width: 340px;
    .el-card__body {
      padding: 0;
      height: 100%;
    }
  }

  .left-cont .el-card__body {
    padding: 0 !important;
    height: 100%;
  }
}
</style>
