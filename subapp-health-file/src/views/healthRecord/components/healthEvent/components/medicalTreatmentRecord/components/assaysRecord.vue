<template>
  <div class="assaysRecord" v-loading="tableLoading">
    <div class="innerAssaysRecord" v-if="applctionList.length > 0">
      <div class="appList">
        <applctionList
          :total="total"
          @clickItem="clickItem"
          :list="applctionList"
        ></applctionList>
      </div>
      <div class="reportShow">
        <reportShow :reportObj="reportData"></reportShow>
      </div>
    </div>
    <div v-else class="noneData">暂无数据</div>
  </div>
</template>

<script>
import applctionList from "@/views/healthRecord/components/healthEvent/components/medicalTreatmentRecord/components/applctionList.vue";
import reportShow from "@/views/healthRecord/components/healthEvent/components/medicalTreatmentRecord/components/reportShow.vue";
import {
  getLisReportByIpReg,
  getLisReportByOpVisit,
} from "@/api/modules/healthRecord/index.js";

export default {
  name: "assaysRecord",
  components: {
    applctionList,
    reportShow,
  },
  props: {
    // 健康档案
    personalInfos: {
      type: Object,
      default() {
        return {};
      },
    },
    dType: {
      type: String,
      default() {
        return "cis";
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
      applctionList: [],
      reportData: {},
      total: 0,
      tableLoading: false,
    };
  },
  watch: {
    navBarObj: {
      //深度监听,可监听到对象、数组的变化
      handler(val) {
        if (val.serialNumber) {
          this.getList();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  methods: {
    getList() {
      switch (this.dType) {
        case "cis":
          this.getCisList();
          break;

        case "hos":
          this.getHosList();
          break;
      }
    },
    async getCisList() {
      this.tableLoading = true;
      let { result, desc, code, total } = await getLisReportByOpVisit({
        visitId: this.navBarObj.serialNumber,
        hosCode: this.navBarObj.hosCode || ""
      });
      if (code == 0) {
        console.log("result:::::", result);
        this.applctionList = result;
        this.total = total;
      } else {
        // this.$message.error(desc || "数据获取错误！");
      }
      this.tableLoading = false;
    },
    async getHosList() {
      this.tableLoading = true;
      let { result, desc, code, total } = await getLisReportByIpReg({
        regId: this.navBarObj.serialNumber,
        hosCode: this.navBarObj.hosCode || ""
      });

      if (code == 0) {
        console.log("result:::::", result);
        this.applctionList = result;
        this.total = total;
      } else {
        // this.$message.error(desc || "数据获取错误！");
      }
      this.tableLoading = false;
    },
    clickItem(data) {
      this.reportData = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.assaysRecord {
  width: 100%;
  height: 100%;

  .innerAssaysRecord {
    display: flex;
    height: 100%;
  }
  .appList {
    width: 304px;
    height: 100%;
  }
  .reportShow {
    margin-left: 12px;
    flex: 1;
    height: 100%;
  }
}

.noneData {
  margin-top: 20vh;
  text-align: center;
}
</style>
