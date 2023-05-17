<!--
  @description 采集监控-基础配置-质控方案
  @date 2022/03/14
-->
<template>
  <div class="quality-control">
    <div class="protitle">质控方案</div>
    <div class="promain">
      <el-tabs v-model="activeTabName" @tab-click="tabClick">
        <el-tab-pane label="待发布" name="unrelease">
          <Unrelease ref="unrelease"></Unrelease>
        </el-tab-pane>
        <el-tab-pane label="已发布" name="released">
          <Released ref="released"></Released>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Unrelease from "./qualityControl/Unrelease.vue";
import Released from "./qualityControl/Released.vue";

export default {
  components: { Unrelease, Released },
  data() {
    return {
      activeTabName: "unrelease", //当前标签页名
    };
  },
  methods: {
    tabClick(tab) {
      this.$refs[tab.name].search();
    },
  },
};
</script>

<style lang="less" scoped>
.promain {
  padding: 0;
}
.quality-control {
  height: 100%;
}
.el-tabs {
  height: 100%;
  width: 100%;
  background-color: #fff;
  ::v-deep .el-tabs__header {
    padding: 0 16px;
    margin: 0;
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
    padding: 10px;
    background-color: #f5f5f5;
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>