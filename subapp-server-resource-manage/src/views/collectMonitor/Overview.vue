<!--
  @description 采集监控-概览
  @date 2022/03/07
-->
<template>
  <div class="OverView">
    <div class="protitle">{{proEnv==='heilongjiang'?'数据统计':'概览'}}</div>
    <div class="promain">
      <el-row :gutter="10" class="el-row-cont el-row-cont1">
        <el-col :span="8">
          <dataCom
            flag="1"
            :dataComData="dataComData1"
            v-loading="loading1"
          ></dataCom>
        </el-col>
        <el-col :span="8">
          <dataCom
            flag="2"
            :dataComData="dataComData2"
            v-loading="loading2"
          ></dataCom>
        </el-col>
        <el-col :span="8">
          <dataCom
            flag="3"
            :dataComData="dataComData3"
            v-loading="loading3"
          ></dataCom>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="el-row-cont el-row-cont2">
        <el-col :span="24">
          <colStatistics></colStatistics>
        </el-col>
        <!-- <el-col :span="8">
          <colProperty></colProperty>
        </el-col> -->
      </el-row>
      <el-row :gutter="10" class="el-row-cont el-row-cont3">
        <el-col :span="24">
          <orgStatistics></orgStatistics>
        </el-col>
        <!-- <el-col :span="8">
          <colEvents></colEvents>
        </el-col> -->
      </el-row>
    </div>
  </div>
</template>
<script>
import dataCom from "views/collectMonitor/overviewComs/dataCom.vue";
import colStatistics from "views/collectMonitor/overviewComs/colStatistics.vue";
import colProperty from "views/collectMonitor/overviewComs/colProperty.vue";
import orgStatistics from "views/collectMonitor/overviewComs/orgStatistics.vue";
import colEvents from "views/collectMonitor/overviewComs/colEvents.vue";

import { getCollectData } from "api/indicator.js";
import { getCollectData as getCollectDataP } from "api/finResource.js";

export default {
  name: "OverView",
  components: {
    dataCom,
    colStatistics,
    colProperty,
    orgStatistics,
    colEvents,
  },
  data() {
    return {
      loading1: false,
      loading2: false,
      loading3: false,
      dataComData1: {},
      dataComData2: {},
      dataComData3: {},
    };
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  created() {
    this.getCollectDataFuc();
    this.getCollectDataPFuc();
  },
  methods: {
    // 医疗机构、采集数据
    async getCollectDataFuc() {
      this.loading1 = true;
      this.loading2 = true;
      try {
        let { result, code } = await getCollectData();
        if (code === 0) {
          console.log("医疗机构、采集数据:", result);
          this.dataComData1 = {
            allNum: Number(result.orgAccumulation || 0),
            yearNum: Number(result.orgAnnualQty || 0),
            ratio: "",
          };
          this.dataComData2 = {
            allNum: Number(result.dataAccumulation || 0),
            yearNum: Number(result.dataAnnualQty || 0),
            ratio: Number(result.yearOnYear.split("%")[0] || 0),
          };
        }
      } catch (error) {
      } finally {
        this.loading1 = false;
        this.loading2 = false;
      }
    },
    // 健康档案
    async getCollectDataPFuc() {
      this.loading3 = true;
      try {
        let { result = {}, code } = await getCollectDataP(["archive"]);
        if (code === 0) {
          console.log("健康档案数据:", result);
          this.dataComData3 = {
            allNum: Number(result?.archive?.dataAccumulation || 0),
            yearNum: Number(result?.archive?.dataAnnualQty || 0),
            ratio: Number(result?.archive?.yearOnYear.split("%")[0] || 0),
          };
        }
      } catch (error) {
      } finally {
        this.loading3 = false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.OverView {
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