<!-- 
  @description 数据资产-概览
 -->
<template>
  <div class="finOverView">
    <div class="protitle">
      {{ proEnv === "heilongjiang" ? "数据统计" : "概览" }}
    </div>
    <div class="promain">
      <el-row :gutter="10" class="el-row-cont el-row-cont1">
        <el-col :span="8">
          <dataCom flag="1" :dataComData="dataComData1"></dataCom>
        </el-col>
        <el-col :span="8">
          <dataCom flag="2" :dataComData="dataComData2"></dataCom>
        </el-col>
        <el-col :span="8">
          <dataCom flag="3" :dataComData="dataComData3"></dataCom>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="el-row-cont el-row-cont2">
        <el-col :span="16">
          <emrStatistics></emrStatistics>
        </el-col>
        <el-col :span="8">
          <finCom></finCom>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="el-row-cont el-row-cont3">
        <el-col :span="16">
          <orgStatistics></orgStatistics>
        </el-col>
        <el-col :span="8">
          <hospitalRank></hospitalRank>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import dataCom from "views/finResource/components/dataCom.vue";
import emrStatistics from "views/finResource/components/emrStatistics.vue";
import finCom from "views/finResource/components/finCom.vue";
import orgStatistics from "views/finResource/components/orgStatistics.vue";
import hospitalRank from "views/finResource/components/hospitalRank.vue";

import { getCollectData } from "api/finResource.js";

export default {
  name: "finOverView",
  components: {
    dataCom,
    emrStatistics,
    finCom,
    orgStatistics,
    hospitalRank,
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  data() {
    return {
      loading1: false,
      loading2: false,
      loading3: false,
      dataComData1: {},
      dataComData2: {},
      dataComData3: {
        allNum: 0,
        yearNum: 0,
        ratio: 0,
      },
    };
  },
  created() {
    this.getCollectDataFuc();
  },
  methods: {
    // 人口数、电子病历、健康档案查询
    async getCollectDataFuc() {
      this.loading3 = true;
      try {
        let { result = {}, code } = await getCollectData([
          "archive",
          "population",
          "emr",
        ]);
        if (code === 0) {
          console.log("人口数、电子病历、健康档案数据:", result);
          this.handleData(result);
        }
      } catch (error) {
      } finally {
        this.loading3 = false;
      }
    },
    handleData(result) {
      let dataComData1 = result.population || {};
      let dataComData2 = result.emr || {};
      let dataComData3 = result.archive || {};
      this.dataComData1 = {
        allNum: Number(dataComData1.dataAccumulation || 0),
        yearNum: Number(dataComData1.dataAnnualQty || 0),
        ratio: Number(dataComData1.yearOnYear.split("%")[0] || 0),
      };
      this.dataComData2 = {
        allNum: Number(dataComData2.dataAccumulation || 0),
        yearNum: Number(dataComData2.dataAnnualQty || 0),
        ratio: Number(dataComData2.yearOnYear.split("%")[0] || 0),
      };
      this.dataComData3 = {
        allNum: Number(dataComData3.dataAccumulation || 0),
        yearNum: Number(dataComData3.dataAnnualQty || 0),
        ratio: Number(dataComData3.yearOnYear.split("%")[0] || 0),
      };
    },
  },
};
</script>
<style lang="less" scoped>
.finOverView {
  height: 100%;
  .el-row-cont {
    ::v-deep .el-col {
      height: 100%;
    }
  }
  .el-row-cont1 {
    height: 105px;
    margin-bottom: 10px;
  }
  .el-row-cont2 {
    height: 350px;
    margin-bottom: 10px;
  }
  .el-row-cont3 {
    height: calc(100% - 475px);
  }
}
</style>