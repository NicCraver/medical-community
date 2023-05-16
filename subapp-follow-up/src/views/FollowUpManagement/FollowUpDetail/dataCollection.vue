<template>
  <div class="dataCollection">
    <div
      class="tip-bar"
      :class="{ 'normal-tip-bar': dataNum, 'abnormal-tip-bar': abnormalNum }"
    >
      <template v-if="dataNum !== ''">
        <IconSvg
          :iconClass="abnormalNum ? 'org-prompt' : 'prompt'"
          width="18"
          height="18"
        ></IconSvg>
        <div class="cont">
          {{ currentData.nextFollowTime }}采集数据{{ dataNum }}条
          <template v-if="abnormalNum">，异常{{ abnormalNum }}条</template>
        </div>
        <IconSvg
          :iconClass="abnormalNum ? 'org-refresh' : 'refresh'"
          width="18"
          height="18"
          class="refresh"
          @click="refresh"
        ></IconSvg>
      </template>
    </div>

    <template v-if="isBloodPressure">
      <!-- 当日血压界面 -->
      <BloodPressure
        :bloodPressureData="bloodPressureData"
        :bloodPressureChartData="bloodPressureChartData"
        :isPersonalBP="isPersonalBP"
        :scrollDisabled="scrollDisabled"
        @loadMoreData="BPLoadMoreData"
      ></BloodPressure>
    </template>
    <template v-else-if="isBloodSugar">
      <!-- 当日血糖界面 -->
      <BloodSugar
        :bloodSugarData="bloodSugarData"
        :bloodSugarChartData="bloodSugarChartData"
        :cruorinData="cruorinData"
        :isPersonalBS="isPersonalBS"
        :scrollDisabled="scrollDisabled"
        @loadMoreData="BSLoadMoreData"
      ></BloodSugar>
    </template>
    <template v-if="dateBtnData.length">
      <div class="dateArr">
        <div class="label">*推荐最近{{ currentName }}采集周数据</div>
        <div
          class="btn-item"
          :class="{ active: index == activeIndex }"
          v-for="(item, index) in dateBtnData"
          :key="index"
          @click="dateClick(item, index)"
        >
          {{ item || "" }}
        </div>
      </div>

      <div class="tip-bar-all" v-if="activeIndex !== -1">
        <div
          class="tip-bar-cont"
          :class="{
            'normal-tip-bar': newDataNum,
            'abnormal-tip-bar': newAbnormalNum,
          }"
        >
          <template v-if="newDataNum !== ''">
            <IconSvg
              :iconClass="newAbnormalNum ? 'org-prompt' : 'prompt'"
              width="18"
              height="18"
            ></IconSvg>
            <div class="label">
              此周期内采集数据
              {{ newDataNum || 0 }}
              条，异常
              {{ newAbnormalNum || 0 }}
              条
            </div>
          </template>
        </div>
      </div>

      <template v-if="isNewBloodPressure">
        <!-- 最近血压界面 -->
        <BloodPressure
          :bloodPressureData="newBloodPressureData"
          :bloodPressureChartData="newBloodPressureChartData"
          :isPersonalBP="isPersonalBP"
          :scrollDisabled="scrollDisabled"
          @loadMoreData="newBPLoadMoreData"
        ></BloodPressure>
      </template>
      <template v-else-if="isNewBloodSugar">
        <!-- 最近血糖界面 -->
        <BloodSugar
          :bloodSugarData="newBloodSugarData"
          :bloodSugarChartData="newBloodSugarChartData"
          :cruorinData="newCruorinData"
          :isPersonalBS="isPersonalBS"
          :scrollDisabled="scrollDisabled"
          @loadMoreData="newBSLoadMoreData"
        ></BloodSugar>
      </template>
    </template>
    <!-- 当日无数据 && 最近日期无数据 -->
    <template v-if="!isBloodPressure && !isBloodSugar && !dateBtnData.length">
      <emptyCom @tixing="tixing"></emptyCom>
    </template>
    <!-- 当日有数据 && 最近日期无数据 -->
    <template v-if="(isBloodPressure || isBloodSugar) && !dateBtnData.length">
      <div class="tip-bar" style="margin-top: 10px">
        <IconSvg iconClass="prompt" width="18" height="18"></IconSvg>
        <div class="cont">无推荐{{ currentName }}采集周数据</div>
        <el-button
          type="text"
          @click="showMore"
          style="text-decoration: underline"
          >查看更多</el-button
        >
      </div>
    </template>
    <remindDIalog
      title="提醒"
      v-if="remindVisible"
      :visible.sync="remindVisible"
      width="520PX"
      :before-close="remindBeforeClose"
      @remindClose="remindBeforeClose"
      :userInfo="currentData"
    ></remindDIalog>
  </div>
</template>
<script>
import { IconSvg } from "anx-vue";
import BloodPressure from "./BloodPressure.vue";
import BloodSugar from "./BloodSugar.vue";
import emptyCom from "./emptyCom.vue";
import remindDIalog from "./remindDIalog.vue";

import {
  listPatBloodPressuresForPage,
  bloodBloodChartData,
  queryPatBPDate,
  cruorinChartData,
  bloodSugarChartData,
  listPatBloodSugarForPage,
} from "@/api/modules/dataCollection";

export default {
  name: "dataCollection",
  components: { IconSvg, BloodPressure, BloodSugar, emptyCom, remindDIalog },
  props: {
    currentData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      dateBtnData: [],
      // 病种标签（"e7fc61f10f284097b79ea226722c1da0"：“血压”；"5530e6c1ca1b4122b247756aae636c80"：“血糖”）
      diseaseCode: "",
      // 病种(1: "血压" ; 2: "血糖")
      currentDisease: "",
      activeIndex: -1,
      isPersonalBS: "",
      isPersonalBP: "",
      // 当天的血压数据
      bloodPressureData: [],
      // 当天的血压折线数据
      bloodPressureChartData: {
        dates: [],
        sbp: [],
        dbp: [],
      },
      // 周期的血压数据
      newBloodPressureData: [],
      // 周期的血压折线数据
      newBloodPressureChartData: {
        dates: [],
        sbp: [],
        dbp: [],
      },
      // 当天的血糖数据
      bloodSugarData: [],
      // 当天的血糖折线数据
      bloodSugarChartData: {
        dates: [],
        empty: [],
        morning: [],
        beforeLunch: [],
        afterLunch: [],
        beforeDinner: [],
        afterDinner: [],
        beforeSleep: [],
        afterSleep: [],
      },
      // 周期的血糖数据
      newBloodSugarData: [],
      // 周期的血糖折线数据
      newBloodSugarChartData: {
        dates: [],
        empty: [],
        morning: [],
        beforeLunch: [],
        afterLunch: [],
        beforeDinner: [],
        afterDinner: [],
        beforeSleep: [],
        afterSleep: [],
      },
      // 当天的糖画折线图
      cruorinData: {
        dates: [],
        values: [],
      },
      // 周期的糖画折线图
      newCruorinData: {
        dates: [],
        values: [],
      },
      // 当天的数据总数
      dataNum: "",
      // 当天的异常数据总数
      abnormalNum: "",
      // 周期的数据总数
      newDataNum: "",
      // 周期的异常数据总数
      newAbnormalNum: "",
      pageParams: {
        pageNum: 1,
        pageSize: 20,
      },
      scrollDisabled: true,
      // 提醒
      remindVisible: false,
    };
  },
  watch: {
    currentData: {
      handler(val, old) {
        if (val?.patId && val?.followupId !== old?.followupId) {
          this.diseaseCode = val.diseaseCode || "";
          this.currentDisease =
            this.diseaseCode === "e7fc61f10f284097b79ea226722c1da0"
              ? "1"
              : this.diseaseCode === "5530e6c1ca1b4122b247756aae636c80"
              ? "2"
              : "";
          this.refresh();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    currentName() {
      return this.currentDisease === "1"
        ? "血压"
        : this.currentDisease === "2"
        ? "血糖"
        : "";
    },
    // 当前高血压数据
    isBloodPressure() {
      let flag =
        this.currentDisease === "1" &&
        (this.bloodPressureData.length || this.dataNum);
      return flag;
    },
    // 当前糖尿病数据
    isBloodSugar() {
      let flag =
        this.currentDisease === "2" &&
        (this.bloodSugarData.length ||
          this.dataNum ||
          this.cruorinData?.dates?.length);
      return flag;
    },
    // 周期高血压数据
    isNewBloodPressure() {
      let flag =
        this.currentDisease === "1" &&
        (this.newBloodPressureData.length || this.newDataNum);
      return flag;
    },
    // 周期糖尿病数据
    isNewBloodSugar() {
      let flag =
        this.currentDisease === "2" &&
        (this.newBloodSugarData.length ||
          this.newDataNum ||
          this.newCruorinData?.dates?.length);
      return flag;
    },
  },
  mounted() {},
  methods: {
    // 刷新
    refresh() {
      this.resetData();
      let date = [
        this.currentData.nextFollowTime,
        this.currentData.nextFollowTime,
      ];
      if (this.currentDisease === "1") {
        // 获取高血压数据
        this.searchBP(date);
      } else if (this.currentDisease === "2") {
        // 获取血糖数据
        this.searchBS(date);
      }
    },
    // 获取高血压数据
    searchBP(date) {
      this.getBPData(date, (result) => {
        this.bloodPressureData = result?.patBloodList || [];
      });
      this.getBPAllDataNum(date, "DAY", ({ total, abnormal, chartData }) => {
        this.dataNum = total;
        this.abnormalNum = abnormal;
        this.bloodPressureChartData = chartData;
      });
      this.getDateData(date);
    },
    // 获取血糖数据
    searchBS(date) {
      this.getBSData(date, (result) => {
        // 将树形数据处理成正常数据
        let arr = this.handleTreeBSData(result?.patBloodList || []);
        this.bloodSugarData = arr;
      });
      this.getCruorinData(date, (result) => {
        this.cruorinData = result;
      });
      this.getBSAllDataNum(date, "DAY", ({ total, abnormal, chartData }) => {
        this.dataNum = total;
        this.abnormalNum = abnormal;
        this.bloodSugarChartData = chartData;
      });
      this.getDateData(date);
    },
    // 将树形数据处理成正常数据
    handleTreeBSData(result) {
      let arr = [];
      for (let i in result) {
        let item = result[i];
        let obj = { ...item };
        arr.push(obj);
        if (item?.children?.length) {
          for (let j in item.children) {
            let val = item.children[j];
            let obj1 = { ...val };
            delete obj1.children;
            arr.push(obj1);
          }
        }
        delete obj.children;
      }
      return arr;
    },
    // 获取高血压表格数据
    async getBPData([startDate, endDate], fn) {
      try {
        let params = {
          patId: this.currentData.patId,
          startDate,
          endDate,
          pageNum: 1,
          pageSize: this.pageParams.pageSize,
        };
        this.scrollDisabled = true;
        let { code, result, total } = await listPatBloodPressuresForPage(
          params
        );
        if (code === 0) {
          console.log("获取高血压采集数据", result);
          fn && fn(result);
          this.isPersonalBP = result.openStatus == "Y";
          this.scrollDisabled = this.pageParams.pageSize >= total;
        }
      } catch (error) {}
    },
    // 获取血糖表格数据
    async getBSData([startDate, endDate], fn) {
      try {
        let params = {
          patId: this.currentData.patId,
          startDate,
          endDate,
          // pageNum: 1,
          // pageSize: this.pageParams.pageSize,
        };
        // this.scrollDisabled = true;
        let { code, result, total } = await listPatBloodSugarForPage(params);
        if (code === 0) {
          console.log("获取血糖采集数据", result);
          fn && fn(result);
          this.isPersonalBS = result.openStatus == "Y";
          // this.scrollDisabled = this.pageParams.pageSize >= total;
        }
      } catch (error) {}
    },
    BPLoadMoreData() {
      this.scrollDisabled = true;
      this.pageParams.pageSize += 10;
      let date = [
        this.currentData.nextFollowTime,
        this.currentData.nextFollowTime,
      ];
      this.getBPData(date, (result) => {
        this.bloodPressureData = result?.patBloodList || [];
      });
    },
    newBPLoadMoreData() {
      this.scrollDisabled = true;
      this.pageParams.pageSize += 10;
      let currentDate = this.dateBtnData[this.activeIndex];
      let date = currentDate.indexOf("至") > -1 ? currentDate.split("至") : [];
      if (!date.length) {
        return;
      }
      this.getBPData(date, (result) => {
        this.newBloodPressureData = result?.patBloodList || [];
      });
    },
    BSLoadMoreData() {
      this.scrollDisabled = true;
      this.pageParams.pageSize += 10;
      let date = [
        this.currentData.nextFollowTime,
        this.currentData.nextFollowTime,
      ];
      this.getBSData(date, (result) => {
        this.bloodSugarData = result?.patBloodList || [];
      });
    },
    newBSLoadMoreData() {
      this.scrollDisabled = true;
      this.pageParams.pageSize += 10;
      let currentDate = this.dateBtnData[this.activeIndex];
      let date = currentDate.indexOf("至") > -1 ? currentDate.split("至") : [];
      if (!date.length) {
        return;
      }
      this.getBSData(date, (result) => {
        this.newBloodSugarData = result?.patBloodList || [];
      });
    },
    // 获取时间区间数据
    async getDateData([startDate, endDate]) {
      this.dateBtnData = [];
      try {
        let params = {
          patId: this.currentData.patId,
          startDate,
          endDate,
          type:
            this.currentDisease === "1"
              ? "P"
              : this.currentDisease === "2"
              ? "S"
              : "",
        };
        let { code, result } = await queryPatBPDate(params);
        if (code === 0) {
          console.log("获取随访详情时间区间", result);
          if (result?.length) {
            this.dateBtnData = result.concat("查看更多");
            if (
              (this.currentDisease === "1" && !this.isBloodPressure) ||
              (this.currentDisease === "2" && !this.isBloodSugar)
            ) {
              // 当前日期无数据，默认点击第一个日期周期
              this.dateClick(this.dateBtnData[0], 0);
            }
          }
        }
      } catch (error) {}
    },
    // 高血压异常数据量、总量查询、折线图数据查询
    async getBPAllDataNum([startDate, endDate], dateType, fn) {
      try {
        let params = {
          patId: this.currentData.patId,
          startDate,
          endDate,
          dateType,
        };
        let { code, result } = await bloodBloodChartData(params);
        if (code === 0) {
          let total = result.total || 0;
          let abnormal = result.abnormal || 0;
          let chartData = {
            dates: result.dates || [],
            sbp: result.sbp || [],
            dbp: result.dbp || [],
          };
          console.log("获取血压折线图-异常数据量总量查询", result);
          fn &&
            fn({
              total,
              abnormal,
              chartData,
            });
        }
      } catch (error) {}
    },
    // 血糖异常数据量、总量查询、折线图数据查询
    async getBSAllDataNum([startDate, endDate], dateType, fn) {
      try {
        let params = {
          patId: this.currentData.patId,
          startDate,
          endDate,
          dateType,
        };
        let { code, result } = await bloodSugarChartData(params);
        if (code === 0) {
          let total = result.total || 0;
          let abnormal = result.abnormal || 0;
          let chartData = {
            dates: result.dates,
            empty: result.empty,
            morning: result.morning,
            beforeLunch: result.beforeLunch,
            afterLunch: result.afterLunch,
            beforeDinner: result.beforeDinner,
            afterDinner: result.afterDinner,
            beforeSleep: result.beforeSleep,
            afterSleep: result.afterSleep,
          };
          console.log("获取血糖折线图-异常数据量总量查询", result);
          fn &&
            fn({
              total,
              abnormal,
              chartData,
            });
        }
      } catch (error) {}
    },
    // 糖化血红蛋白折线图数据查询
    async getCruorinData([startDate, endDate], fn) {
      try {
        let params = {
          patId: this.currentData.patId,
          startDate,
          endDate,
        };
        let { code, result } = await cruorinChartData(params);
        if (code === 0) {
          let chartData = {
            dates: result.dates,
            values: result.gly,
          };
          console.log("获取糖化血红蛋白折线图数据", result);
          fn && fn(chartData);
        }
      } catch (error) {}
    },
    // 点击日期
    dateClick(item, index) {
      this.activeIndex = index;
      if (item === "查看更多") {
        this.showMore();
        return;
      }
      let date = item.indexOf("至") > -1 ? item.split("至") : [];
      if (!date.length) {
        return;
      }
      if (this.currentDisease === "1") {
        this.getBPData(date, (result) => {
          this.newBloodPressureData = result?.patBloodList || [];
        });
        this.getBPAllDataNum(date, "WEEK", ({ total, abnormal, chartData }) => {
          this.newDataNum = total;
          this.newAbnormalNum = abnormal;
          this.newBloodPressureChartData = chartData;
        });
      } else if (this.currentDisease === "2") {
        this.getBSData(date, (result) => {
          this.newBloodSugarData = result?.patBloodList || [];
        });
        this.getCruorinData(date, (result) => {
          this.newCruorinData = result || {};
        });
        this.getBSAllDataNum(date, "WEEK", ({ total, abnormal, chartData }) => {
          this.newDataNum = total;
          this.newAbnormalNum = abnormal;
          this.newBloodSugarChartData = chartData;
        });
      }
    },
    // 查看更多
    showMore() {
      let tab = "";
      if (this.currentDisease === "1") {
        tab = "BloodPressure";
      } else if (this.currentDisease === "2") {
        tab = "BloodSugar";
      }
      const url = `/app-chronicDisease/patientCenter/patientArchives/indicatorAnaysis?patId=${this.currentData?.patId}&planId=${this.currentData?.planId}&tab=${tab}`;
      window.history.pushState(history.state, "", url);
      window.dispatchEvent(
        new PopStateEvent("popstate", { state: history.state })
      );
    },
    tixing() {
      this.remindVisible = true;
    },
    remindBeforeClose() {
      this.remindVisible = false;
    },
    // 清空当前日期的所有数据
    resetData() {
      this.pageParams.pageSize = 20;
      this.scrollDisabled = true;
      this.activeIndex = -1;

      this.dataNum = "";
      this.abnormalNum = "";
      this.bloodPressureData = [];
      this.bloodPressureChartData = {
        dates: [],
        sbp: [],
        dbp: [],
      };
      this.bloodSugarData = [];
      this.cruorinData = {
        dates: [],
        values: [],
      };
      this.bloodSugarChartData = {
        dates: [],
        empty: [],
        morning: [],
        beforeLunch: [],
        afterLunch: [],
        beforeDinner: [],
        afterDinner: [],
        beforeSleep: [],
        afterSleep: [],
      };

      this.dateBtnData = [];
      this.newDataNum = "";
      this.newAbnormalNum = "";

      this.newBloodPressureData = [];
      this.newBloodPressureChartData = {
        dates: [],
        sbp: [],
        dbp: [],
      };
      this.newBloodSugarData = [];
      this.newBloodSugarChartData = {
        dates: [],
        empty: [],
        morning: [],
        beforeLunch: [],
        afterLunch: [],
        beforeDinner: [],
        afterDinner: [],
        beforeSleep: [],
        afterSleep: [],
      };
      this.newCruorinData = {
        dates: [],
        values: [],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.dataCollection {
  padding: 10px;
  .tip-bar {
    width: 100%;
    height: 30px;
    padding: 0 15px;
    margin-bottom: 12px;
    line-height: 20px;
    font-size: 14px;
    font-family: Roboto;
    background-color: #f6f7fb;
    border: 1px solid #f6f7fb;
    display: flex;
    align-items: center;
    .cont {
      margin: 0 5px;
      font-size: 14px;
      font-family: SourceHanSansSC-regular;
    }

    .refresh {
      cursor: pointer;
    }
  }
  .normal-tip-bar {
    color: #4468bd;
    border: 1px solid #e3e8f5;
  }
  .abnormal-tip-bar {
    background-color: #ffe8d4;
    border: 1px solid #ffe8d4;
    color: #f77601;
  }
  .dateArr {
    margin-top: 12px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    .label {
      color: rgba(91, 91, 91, 1);
      font-size: 12px;
      font-family: SourceHanSansSC-regular;
    }
    .btn-item {
      margin-left: 12px;
      padding: 0 18px;
      height: 30px;
      line-height: 30px;
      border-radius: 39px;
      font-size: 14px;
      text-align: center;
      font-family: Roboto;
      border-radius: 39px;
      background-color: rgba(255, 255, 255, 1);
      color: rgba(68, 104, 189, 1);
      border: 1px solid rgba(141, 172, 249, 1);
      cursor: pointer;
    }
    .btn-item.active {
      background-color: rgba(83, 129, 227, 1);
      color: rgba(249, 250, 253, 1);
    }
  }
  .tip-bar-all {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    .tip-bar-cont {
      min-width: 287px;
      height: 32px;
      padding: 0 18px;
      line-height: 32px;
      font-size: 14px;
      text-align: center;
      font-family: Roboto;
      background-color: #f6f7fb;
      border: 1px solid #f6f7fb;
      display: flex;
      align-items: center;
      .label {
        margin-left: 8px;
      }
    }
    .normal-tip-bar {
      color: #4468bd;
      border: 1px solid #e3e8f5;
    }
    .abnormal-tip-bar {
      background-color: #ffe8d4;
      border: 1px solid #ffe8d4;
      color: #f77601;
    }
  }
  .empty {
    display: flex;
    flex-direction: column;
    height: 300px;
    align-items: center;
    justify-content: center;
    .descriptionCls {
      margin-top: 40px;
      i {
        color: #4468bd;
        cursor: pointer;
      }
    }
  }
}
</style>