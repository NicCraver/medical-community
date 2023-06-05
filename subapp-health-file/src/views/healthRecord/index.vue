<template>
  <div class="healthRecord">
    <el-tabs type="card" tab-position="left" v-model="tabActiveName">
      <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name" :lazy="item.name != 'one'">
        <div class="headerCom">
          <headerCom ref="headerCom" :personalInfos="personalInfos" :membersList="membersList"></headerCom>
        </div>
        <div class="mainCom" :style="{ 'overflow-y': item.name === 'one' ? 'hidden' : 'auto' }">
          <component v-if="item.name == tabActiveName" :is="item.component" :personalInfos="personalInfos"></component>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import headerCom from "./components/header";
import indexView from "./components/indexView/index";
import healthEvent from "./components/healthEvent/index";
import {
  getPersonalArchiveInfoById,
  getAllFamilyMemberRelationship,
} from "@/api/modules/healthRecord/index.js";
import { mapGetters, mapActions } from "vuex";
import { deepClone } from "@/utils/utils.js";

let tabList = [
  {
    label: "首页",
    name: "one",
    component: "indexView",
  },
  {
    label: "健康事件",
    name: "two",
    component: "healthEvent",
  },
  {
    label: "生命周期",
    name: "three",
    component: "",
  },
  {
    label: "健康问题",
    name: "four",
    component: "",
  },
  {
    label: "干预措施",
    name: "five",
    component: "",
  },
];
export default {
  name: "healthRecord",
  components: {
    headerCom,
    indexView,
    healthEvent,
  },
  data() {
    return {
      tabActiveName: "",
      tabList: [],
      personalInfos: {
        personalArchiveInfo: {},
        personalArchiveMainInfo: {},
      },
      membersList: [],
    };
  },
  computed: {
    ...mapGetters({
      infomationPlatforms: "base/infomationPlatforms",
      jumpToData: "base/jumpToData",
    }),
  },
  watch: {
    $route: {
      handler(to, from) {
        console.log(to, from);
        if (
          to.params.pAId &&
          to.params.pAId !==
            (from && from.hasOwnProperty("params") && from.params.pAId)
        ) {
          this.getPatientArchInfo();
          this.getAllFamilyMemberRelationship();
        }
      },
      immediate: true,
      deep: true,
    },
    // 配置信息
    infomationPlatforms: {
      handler(val) {
        if (val.length) {
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
          this.tabActiveName = val.firstLevelName;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions({
      setPerArchInfo: "base/setPerArchInfo",
    }),
    // 获取个人档案数据
    async getPatientArchInfo() {
      try {
        let { code, result, desc } = await getPersonalArchiveInfoById({
          pAId: this.$route.params.pAId || "",
        });
        if (code === 0) {
          console.log("档案数据", result);
          this.personalInfos = {
            ...result,
            personalArchiveInfo: result.personalArchiveInfo || {},
            personalArchiveMainInfo: result.personalArchiveMainInfo || {},
          };
          this.setPerArchInfo(this.personalInfos);
        }
      } catch (error) {}
    },
    // 获取家庭成员数据
    async getAllFamilyMemberRelationship() {
      try {
        let res = await getAllFamilyMemberRelationship({
          pAId: this.$route.params.pAId,
        });

        if (res.code === 0) {
          console.log("家庭成员数据", res);
          this.membersList = res.result;
        }
      } catch (error) {}
    },
    // 获取tab配置
    getTabList() {
      let infoPlats = this.infomationPlatforms;
      let arr = [];
      for (let i in tabList) {
        for (let j in infoPlats) {
          if (
            tabList[i].label === infoPlats[j].deptName &&
            infoPlats[j].status == "1"
          ) {
            arr.push(deepClone(tabList[i]));
          }
        }
      }
      this.tabList = arr;
      this.tabActiveName = arr.length ? arr[0].name || "" : "";
    },
  },
};
</script>
<style lang="scss">
.healthRecord {
  background-color: rgb(245, 245, 245);
  height: 100%;
  .headerCom {
    height: 100px;
  }
  .mainCom {
    height: calc(100% - 120px);
    margin: 10px 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-tabs {
    height: 100%;
    .el-tabs__content {
      height: 100%;
      padding-right: 20px;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
  .el-tabs--left {
    .el-tabs__item.is-left {
      width: 34px;
      height: 137px;
      padding: 16px 0;
      border: none !important;
      border-radius: 0 10px 10px 0;
      background-color: rgba(242, 242, 247, 100);
      color: rgba(19, 71, 150, 100);
      font-size: 14px;
      text-align: center;
      writing-mode: tb-rl;
      letter-spacing: 10px;
      line-height: 34px;
    }
    .el-tabs__item.is-left.is-active {
      color: rgba(242, 242, 247, 100);
      background-color: rgba(68, 106, 189, 100);
      border: none;
    }
  }
  .el-tabs--left.el-tabs--card .el-tabs__nav {
    border: none;
  }
}
</style>