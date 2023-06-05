<template>
  <div
    class="prescriptionInfo"
    v-loading="tableLoading"
    :style="prescriptionInfoStyle"
  >
    <div>
      <div
        class="partContent"
        style="margin-top: 0px"
        v-if="westTableData.length > 0"
      >
        <div class="title">西药、中成药</div>
        <mainTable dType="west" :dData="westTableData"></mainTable>
      </div>
      <div class="partContent" v-if="chmTableData.length > 0">
        <div class="title">中草药</div>
        <mainTable dType="chm" :dData="chmTableData"></mainTable>
      </div>
      <div
        class="partContent"
        v-if="tableData.length > 0 && navBarObj.type !== 'pharmacy'"
      >
        <div class="title">非药品项目</div>
        <mainTable dType="noDrug" :dData="tableData"></mainTable>
      </div>
    </div>
    <div
      style="margin-top: 20vh; text-align: center"
      v-if="
        tableData.length == 0 &&
        chmTableData.length == 0 &&
        westTableData.length == 0
      "
    >
      暂无数据
    </div>
  </div>
</template>

<script>
import { getAdviceDetailsByMedicalRecord } from "@/api/modules/healthRecord/index.js";
import mainTable from "./mainTable.vue";

export default {
  name: "prescriptionInfo",
  components: { mainTable },
  props: {
    // 健康档案
    personalInfos: {
      type: Object,
      default() {
        return {};
      },
    },
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
      prescriptionInfoStyle: {},
      tableData: [],
      westTableData: [],
      tableLoading: false,
      chmTableData: [],
      timer: null,
    };
  },
  watch: {
    personalInfos: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {},
      deep: true,
    },
    navBarObj: {
      handler(val) {
        this.getAdviceDetailsByMedicalRecord();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    // this.getAdviceDetailsByMedicalRecord();
  },
  methods: {
    async getAdviceDetailsByMedicalRecord() {
      this.tableLoading = true;
      try {
        let { result, desc, code } = await getAdviceDetailsByMedicalRecord({
          mzjzlsh: this.navBarObj.serialNumber,
          yljgdm: this.navBarObj.hosCode,
        });
        console.log("门诊医嘱信息：",result);
        if (code == 0) {
          let { herbs = [], nonMedicines = [], patents = [] } = result;
          this.westTableData = patents;
          this.chmTableData = herbs;
          this.tableData = nonMedicines;
        } else {
          // this.$message.error(desc || "医嘱数据获取错误！");
        }
      } catch (error) {
      } finally {
        this.tableLoading = false;
        this.timer = setTimeout(() => {
          this.prescriptionInfoStyle = { "overflow-y": "auto" };
        }, 500);
      }
    },
  },
  // 销毁定时器
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="scss" scoped>
.prescriptionInfo {
  height: 100%;
  overflow-y: hidden;
  .partContent {
    margin: 13px 0px;
    border: 1px solid #ebeef5;
    border-bottom: none;
    .title {
      color: rgba(51, 51, 51, 100);
      font-size: 16px;
      font-weight: 600;
      text-align: left;
      font-family: SourceHanSansSC-medium;
      line-height: 40px;
      background-color: rgba(247, 247, 247, 100);
      padding-left: 8px;
    }
  }
}
</style>
