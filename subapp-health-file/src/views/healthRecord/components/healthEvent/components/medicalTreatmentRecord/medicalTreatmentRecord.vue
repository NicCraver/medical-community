<template>
  <div class="medicalTreatmentRecord" id="medicalTreatmentRecord">
    <div class="title">
      {{ navBarObj.hospitalName }}
    </div>

    <el-row class="title-info">
      <el-col :span="4" :title="navBarObj.itemType || ''">类型：{{ navBarObj.itemType || "--" }}
      </el-col>
      <el-col :span="5" :title="navBarObj.departmentName || ''">科室：{{ navBarObj.departmentName || "--" }}
      </el-col>
      <el-col :span="5" :title="navBarObj.doctorName || ''">医生：{{ doctorNamePrivacy(navBarObj.doctorName) || "--" }}
      </el-col>
      <el-col :span="5" :title="navBarObj.itemDate ? navBarObj.itemDate.split(' ')[0] : ''">日期：{{
          navBarObj.itemDate ? navBarObj.itemDate.split(" ")[0] : ""
        }}</el-col>
      <el-col :span="5" :title="navBarObj.itemLabel || ''">诊断：{{ navBarObj.itemLabel }}</el-col>
    </el-row>
    <el-tabs type="border-card" class="elTabsCls" v-model="activeName">
      <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.name">
        <div class="content height100" v-if="activeName == item.name">
          <component dType="cis" :is="item.name" :navBarObj="navBarObj"></component>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import assaysRecord from "./components/assaysRecord";
import checkRecord from "./components/checkRecord";
import prescriptionInfo from "./components/prescriptionInfo";
import treatmentRecord from "./components/treatmentRecord";
import { mapGetters } from "vuex";
import { deepClone } from "@/utils/utils.js";

let tabs = [
  {
    label: "门诊病历",
    name: "treatmentRecord",
  },
  {
    label: "处方信息",
    name: "prescriptionInfo",
  },
  {
    label: "检验记录",
    name: "assaysRecord",
  },
  {
    label: "检查记录",
    name: "checkRecord",
  },
];
export default {
  name: "medicalTreatmentRecord",
  components: {
    assaysRecord,
    checkRecord,
    prescriptionInfo,
    treatmentRecord,
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
  computed: {
    ...mapGetters({
      medicalRecordData: "base/medicalRecordData",
      doctorNamePrivacy: "base/doctorNamePrivacy",
    }),
  },
  data() {
    return {
      getWindowInfo: {
        height: "", //动态获取content高度
      },
      tabs: [],
      activeName: "",
    };
  },
  watch: {
    // 配置信息
    medicalRecordData: {
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
  created() {
    window.addEventListener("resize", this.getMaxHeight); //注册监听器
    this.getMaxHeight(); //页面创建时先调用一次
  },
  destroyed() {
    window.removeEventListener("resize", this.getMaxHeight);
  },
  methods: {
    getMaxHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）,再减去head-DIV高度值80
      this.getWindowInfo.height = window.innerHeight - 360 + "px";
    },
    // 获取tab配置
    getTabList() {
      let medicalRecordData = this.medicalRecordData.childTreeDto || [];
      let arr = [];
      for (let i in tabs) {
        for (let j in medicalRecordData) {
          if (
            tabs[i].label === medicalRecordData[j].deptName &&
            medicalRecordData[j].status == "1"
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
.medicalTreatmentRecord {
  width: 100%;
  height: 100%;
  ::v-deep.el-tabs .el-tabs__content {
    padding-right: 15px !important;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin: 5px auto 16px;
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

// .elTabsCls {
//   ::v-deep .el-tabs__content {
//     height: calc(100% - 82px) !important;
//   }
// }
</style>
