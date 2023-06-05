<template>
  <div class="navigationBar">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name">
        <component v-if="item.name == activeName" :is="item.component" :personalInfos="personalInfos" @loadEventFuc="loadEventFuc"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import firstTab from "./navComponents/firstTab";
import secondTab from "./navComponents/secondTab";
import { mapGetters } from "vuex";
import { deepClone } from "@/utils/utils.js";

let tabList = [
  {
    label: "就诊活动",
    name: "first",
    component: firstTab,
    modules: ["门诊就诊活动", "住院就诊活动"],
  },
  {
    label: "卫生服务活动",
    name: "second",
    component: secondTab,
    modules: ["卫生服务活动"],
  },
];
export default {
  name: "navigationBar",
  components: { firstTab, secondTab },
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
      activeName: "",
      tabList: [],
    };
  },
  computed: {
    ...mapGetters({
      healthEventData: "base/healthEventData",
      jumpToData: "base/jumpToData",
    }),
  },
  watch: {
    // 配置信息
    healthEventData: {
      handler(val) {
        if (
          val.hasOwnProperty("childTreeDto") &&
          val.childTreeDto.length &&
          val.status == "1"
        ) {
          this.getTabList();
        }
      },
      immediate: true,
      deep: true,
    },
    // 首页的跳转数据
    jumpToData: {
      handler(val) {
        if (val.firstLevelName) {
          this.activeName = val.healthEventName;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    loadEventFuc(data) {
      this.$emit("loadEventFuc", data);
    },
    // 获取tab配置
    getTabList() {
      let infoPlats = this.healthEventData.childTreeDto;
      let arr = [];
      let flagArr = [];
      for (let i in tabList) {
        for (let j in infoPlats) {
          if (
            tabList[i].modules.indexOf(infoPlats[j].deptName) > -1 &&
            infoPlats[j].status == "1" &&
            flagArr.indexOf(tabList[i].name) == -1
          ) {
            arr.push(deepClone(tabList[i]));
            flagArr.push(tabList[i].name);
          }
        }
      }
      this.tabList = arr;
      this.activeName = arr.length ? arr[0].name || "" : "";
    },
  },
};
</script>

<style lang="scss">
.navigationBar {
  width: calc(100% - 10px);
  height: calc(100% - 20px);
  margin: 10px;
  margin-right: 0;
  .el-tabs__header {
    margin: 0;
    .el-tabs__nav.is-top {
      width: 100%;
    }
    .el-tabs__item {
      width: 50%;
      color: #5a5a5a;
      font-size: 16px;
      font-weight: bold;
      font-family: SourceHanSansSC-regular;
      text-align: center;
    }
    .el-tabs__item.is-active {
      color: #5e84d7;
      font-family: SourceHanSansSC-medium;
    }
  }
  .el-tabs__content {
    height: calc(100% - 40px) !important;
    padding-right: 0 !important;
  }
}
</style>
