<template>
  <div class="admissions-list">
    <ProLayout model="tab" mainBgColor="#F5F5F5" padding="0" overflow>
      <template #title>审批流列表</template>
      <template #tab>
        <el-tabs v-model="activeComponent">
          <el-tab-pane v-for="item in tabDatas" :key="item.label" :name="item.component" :label="item.label"></el-tab-pane>
        </el-tabs>
      </template>
      <template #main>
        <component :is="activeComponent" :activeComponent="activeComponent" />
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from "anx-vue";
import LoadStart from "./LoadStart";
import HasStarted from "./HasStarted";
import HasClosed from "./HasClosed";

export default {
  components: { ProLayout, LoadStart, HasStarted, HasClosed },
  data() {
    return {
      activeComponent: "LoadStart",
      tabDatas: [
        {
          label: "待开启",
          component: "LoadStart",
        },
        {
          label: "已开启",
          component: "HasStarted",
        },
        {
          label: "已关闭",
          component: "HasClosed",
        },
      ],
    };
  },
  mounted() {},
  beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.admissions-list {
  .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 !important;
  }
  .el-tabs__nav,
  .el-tabs__nav-scroll {
    background-color: #fff !important;
  }
  .el-tabs__item.is-top.is-active {
    border-bottom: none !important;
  }
  .el-tabs__item.is-active {
    color: #134796 !important;
  }
  .el-tabs__item {
    font-size: 16px;
    color: #949da3 !important;
  }
  .el-tabs__active-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: #134796 !important;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    list-style: none;
    border-radius: 4px !important;
  }
  .el-tabs__nav-wrap::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    background-color: #e4e7ed;
    z-index: 1;
  }
}
</style>
