<!--
  @description 患者指标分析
  @date 2022/12/02
-->
<template>
  <div class="IndicatorAnaysis">
    <div class="tab">
      <el-tabs v-model="activeComponent" type="card">
        <el-tab-pane v-for="item in tabDatas" :key="item.label" :name="item.component" :label="item.label"></el-tab-pane>
      </el-tabs>
      <div class="tab-main">
        <component :is="activeComponent" :sugarDate="sugarDate" :pressureDate="pressureDate" :pickerOptions="pickerOptions" @remind="remind"></component>
      </div>
    </div>
    <div class="patient">
      <Patient ref="patient" :patientDate="patientDate" :sugarDate="sugarDate" :pressureDate="pressureDate" :pickerOptions="pickerOptions"></Patient>
    </div>
  </div>
</template>

<script>
import { ProLayout } from "anx-vue";
import BloodSugar from "./IndicatorAnaysis/BloodSugar.vue";
import BloodPressure from "./IndicatorAnaysis/BloodPressure.vue";
import Patient from "./IndicatorAnaysis/Patient.vue";
import dayjs from "dayjs";
import { getPatBloodDateRange } from "@/api/modules/PatientCenter/indicatorAnaysis.js";

export default {
  components: {
    ProLayout,
    BloodSugar,
    BloodPressure,
    Patient,
  },
  data() {
    return {
      activeComponent: "BloodSugar",
      tabDatas: [
        { label: "血糖指标", component: "BloodSugar" },
        { label: "血压指标", component: "BloodPressure" },
      ],
      patId: "",
      patientDate: [],
      sugarDate: [],
      pressureDate: [],
    };
  },
  computed: {
    pickerOptions() {
      return {
        shortcuts: [
          {
            text: "本周",
            onClick(picker) {
              const start = dayjs().day(1).$d;
              const end = dayjs().day(7).$d;
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "本月",
            onClick(picker) {
              const start = dayjs().startOf("month").$d;
              const end = dayjs().endOf("month").$d;
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上一个月",
            onClick(picker) {
              const start = dayjs().startOf("month").subtract(1, "month").$d;
              const end = dayjs().endOf("month").subtract(1, "month").$d;
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      };
    },
  },
  mounted() {
    this.patId = this.$route.query.patId;
    // 获取日期范围
    getPatBloodDateRange({ patId: this.patId }).then(({ code, result }) => {
      if (code === 0) {
        this.patientDate = result.patBloodMonth;
        this.sugarDate = result.sugarWeek;
        this.pressureDate = result.pressureWeek;
        if(this.$route.query.tab) {
          this.activeComponent = this.$route.query.tab;
        } else if(this.sugarDate.length==0 && this.pressureDate.length>0) {
          this.activeComponent = 'BloodPressure'
        }
      }
    });
  },
  methods: {
    // 提醒
    remind() {
      this.$refs.patient.remindFuc();
    },
  },
};
</script>

<style lang="scss" scoped>
.IndicatorAnaysis {
  background-color: #f5f5f5;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  display: flex;
  // padding: 10px;
  // margin-bottom: 25px;
  .tab {
    width: calc(100% - 340px);
    height: 100%;
    margin-right: 10px;
    .el-tabs ::v-deep .el-tabs__header {
      .el-tabs__nav-scroll {
        background-color: #f5f5f5 !important;
      }
      .el-tabs__nav {
        border: none;
      }
      .el-tabs__item {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-weight: 500;
        border: none;
        background-color: #f5f5f5;
        &.is-active {
          background-color: #fff;
        }
      }
    }
    .tab-main {
      background-color: #fff;
      height: calc(100% - 32px);
      padding: 10px;
    }
  }
  .patient {
    width: 330px;
    height: 100%;
  }
}
</style>
