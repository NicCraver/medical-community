<template>
  <div class="inpDepartRecord" id="inpDepartRecord">
    <div class="title">{{ navBarObj.hospitalName }}</div>

    <el-row class="title-info">
      <el-col :span="4" :title="navBarObj.itemType || ''"
        >类型：{{ navBarObj.itemType || "--" }}
      </el-col>
      <el-col :span="5" :title="navBarObj.departmentName || ''"
        >科室：{{ navBarObj.departmentName || "-" }}
      </el-col>
      <el-col
        :span="10"
        :title="navBarObj.itemDate ? navBarObj.itemDate.split(' ')[0] : ''"
        >住院日期：{{
          navBarObj.itemDate ? navBarObj.itemDate.split(" ")[0] : "-"
        }}</el-col
      >
      <el-col :span="5" :title="navBarObj.itemLabel || ''"
        >住院诊断：{{ navBarObj.itemLabel || "-" }}</el-col
      >
    </el-row>

    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="index"
        :label="item.label"
        :name="item.name"
      >
        <div class="content height100" v-if="activeName == item.name">
          <component
            :ref="item.name"
            dType="hos"
            :is="item.component"
            :navBarObj="navBarObj"
            :inDepartGoLinkData="inDepartGoLinkData"
          ></component>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import medRecordIndex from "./components/medRecordIndex.vue";
import prescriptionInfo from "@/views/healthRecord/components/healthEvent/components/medicalTreatmentRecord/components/hosYiZhu.vue";
import assaysRecord from "@/views/healthRecord/components/healthEvent/components/medicalTreatmentRecord/components/assaysRecord.vue";
import checkRecord from "./components/checkRecord.vue";
import operateRecord from "./components/operateRecord.vue";
import narcosisRecord from "./components/narcosisRecord.vue";
import bloodTransRecord from "./components/bloodTransRecord.vue";
import emrRecords from "./components/emrRecords.vue";
import emrRecordsH from "./components/emrRecordsH.vue";
import { mapGetters } from "vuex";
import { deepClone } from "@/utils/utils.js";

let tabs = [
  {
    label: "病案首页",
    labels: "病案首页",
    name: "medRecordIndex",
    component: medRecordIndex,
  },
  {
    label: "医嘱信息",
    labels: "医嘱信息",
    name: "prescriptionInfo",
    component: prescriptionInfo,
  },
  {
    label: "检验记录",
    labels: "检验记录",
    name: "assaysRecord",
    component: assaysRecord,
  },
  {
    label: "检查记录",
    labels: "检查记录",
    name: "checkRecord",
    component: checkRecord,
  },
  {
    label: "手术记录",
    labels: "手术记录",
    name: "operateRecord",
    component: operateRecord,
  },
  {
    label: "麻醉记录",
    labels: "麻醉记录",
    name: "narcosisRecord",
    component: narcosisRecord,
  },
  {
    label: "输血记录",
    labels: "输血记录",
    name: "bloodTransRecord",
    component: bloodTransRecord,
  },
  {
    label: "病历文书",
    labels: "病历文书",
    name: "emrRecords",
    component: emrRecords,
  },
  {
    label: "病历文书",
    labels: "病历文书(结构化)",
    name: "emrRecordsH",
    component: emrRecordsH,
  },
];

export default {
  name: "inpDepartRecord",
  components: {
    medRecordIndex,
  },
  props: {
    // 导航传过来的内容
    navBarObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      tabs: [],
      activeName: "",
      inDepartGoLinkData: {},
    };
  },
  computed: {
    ...mapGetters({
      inpDepartRecordData: "base/inpDepartRecordData",
    }),
  },
  watch: {
    // 配置信息
    inpDepartRecordData: {
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
  },
  mounted() {
    // 监听跳转事件
    this.$EventBus.$on("inDepartGoLink", (res) => {
      if (this.activeName !== res?.prop) {
        if (res?.prop) {
          this.activeName = res?.prop;
        }
        this.inDepartGoLinkData = res;
      }
    });
  },
  methods: {
    // 获取tab配置
    getTabList() {
      let inpDepartRecordData = this.inpDepartRecordData.childTreeDto || [];
      let arr = [];
      for (let i in tabs) {
        for (let j in inpDepartRecordData) {
          if (
            tabs[i].labels === inpDepartRecordData[j].deptName &&
            inpDepartRecordData[j].status == "1"
          ) {
            arr.push(deepClone(tabs[i]));
          }
        }
      }
      this.tabs = arr;
      this.activeName = arr.length ? arr[0].name || "" : "";
    },
  },
};
</script>

<style lang="scss" scoped="">
.inpDepartRecord {
  width: 100%;
  height: 100%;
  .title {
    font-size: 20px;
    color: #333;
    text-align: center;
    margin: 5px auto 16px;
    font-weight: bold;
  }
  .title-info {
    color: rgb(90, 90, 90);
    font-size: 16px;
    margin: 0 18px 10px;
    .el-col {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .content {
    overflow-y: auto;
    padding-right: 10px;
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header {
    background-color: rgba(239, 242, 249, 1);
    border: none;
    height: 40px;
  }
  ::v-deep.el-tabs--border-card {
    border: none;
    height: calc(100% - 91px);
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header .el-tabs__item {
    color: rgba(94, 132, 215, 1);
    font-size: 16px;
    line-height: 40px;
    font-weight: bold;
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    background-color: rgba(94, 132, 215, 1);
    color: #fff;
  }
  ::v-deep.el-tabs .el-tabs__content {
    overflow-y: auto;
    padding: 10px !important;
    padding-right: 0 !important;
    height: calc(100% - 60px);
  }
}
</style>
