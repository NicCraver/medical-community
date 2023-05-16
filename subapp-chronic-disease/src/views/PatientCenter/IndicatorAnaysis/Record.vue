<!--
  @description 患者指标分析-患者全局指标分析-患阅
  @date 
-->
<template>
  <el-drawer class="record" size="400px" :visible.sync="isVisible" :before-close="close">
    <template #title>
      <div class="head">患者端记录</div>
    </template>
    <header>
      <div class="btn-cont">
        <div class="btn" :class="{ active: currentIndex === 1 }" @click="btnClick(1)">
          血糖
        </div>
        <div class="btn" :class="{ active: currentIndex === 2 }" @click="btnClick(2)">
          血压
        </div>
      </div>
    </header>
    <div class="main">
      <Sugar v-if="currentIndex == 1" v-bind="$attrs"></Sugar>
      <Pressure v-else v-bind="$attrs"></Pressure>
    </div>
  </el-drawer>
</template>

<script>
import Sugar from "./RecordSugar.vue";
import Pressure from "./RecordPressure.vue";

export default {
  components: { Sugar, Pressure },
  data() {
    return {
      isVisible: false,
      currentIndex: 1,
    };
  },
  methods: {
    btnClick(index) {
      this.currentIndex = index;
    },
    open(data) {
      this.isVisible = true;
    },
    close() {
      this.currentIndex = 1;
      this.isVisible = false;
    },
  },
};
</script>

<style lang='scss' scoped>
.record {
  ::v-deep .el-drawer__header {
    height: 50px;
    padding: 5px 5px 5px 10px;
    margin-bottom: 0;
    color: #303133;
    font-size: 16px;
    font-weight: 700;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      background-color: #4469bd;
      width: 3px;
      height: 16px;
      left: 1px;
      top: 17px;
    }
  }
  ::v-deep .el-drawer__body {
    height: calc(100% - 50px);
  }
  header {
    display: flex;
    justify-content: center;
    height: 32px;
    .btn-cont {
      width: 200px;
      height: 32px;
      background-color: #f6f8ff;
      border-radius: 42px;
      display: flex;
      justify-content: center;
      .btn {
        width: 100px;
        height: 100%;
        line-height: 32px;
        border-radius: 42px;
        background-color: transparent;
        color: #7495e6;
        text-align: center;
        cursor: pointer;
      }
      .btn.active {
        background-color: #5381e3;
        color: #fff;
      }
    }
  }
  .main {
    margin-top: 10px;
    height: calc(100% - 42px);
  }
}
</style>
