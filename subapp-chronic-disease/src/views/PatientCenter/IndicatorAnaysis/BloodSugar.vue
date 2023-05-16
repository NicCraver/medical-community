<!--
  @description 患者指标分析-血糖
  @date
-->
<template>
  <div class='blood-sugar'>
    <template v-if="isEmpty">
      <div class="empty">
        <el-image :src="require('./empty1.png')"></el-image>
        <div class="text">
          <span>该患者无慢病指标记录，您可通过</span>
          <span class="blue" @click="$emit('remind')">提醒</span>
          <span>的方式跟患者建立连接～</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="top">
        <div class="tip-empty" v-if="tipLoading"></div>
        <div class="tip" v-else :style="{backgroundColor:isAbnormal?'#fdf7f2':'#EBF1FD',color:isAbnormal?'#f77601':'#446abd'}">
          <IconSvg :iconClass="isAbnormal?'info':'info-blue'" width="14" style="margin: 0 8px 0 26px"></IconSvg>
          <span>此周期内采集数据{{dataNum}}条</span>
          <span v-show="abnormalNum!=null">，平台异常{{abnormalNum}}条</span>
          <span v-show="patAbnormalNum!=null">，个性化异常{{patAbnormalNum}}条</span>
        </div>
        <el-date-picker v-model="daterange" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="getData">
        </el-date-picker>
      </div>
      <el-collapse class="cruorin" v-model="activeNames" @change="collapseChange">
        <el-collapse-item name="cruorin">
          <template slot="title">
            <span class="title">糖化血红蛋白趋势图</span>
            <span class="empty" v-if="cruorinData.dates.length==0">无数据</span>
            <span class="empty" style="color:#f77601;border: 1px solid #f77601" v-else-if="cruorinData.isAbnormal">有异常</span>
            <span class="empty" style="color:#446abd;border: 1px solid #446abd" v-else>有数据</span>
          </template>
          <div class="cruorinChart" ref="cruorinChart"></div>
          <div class="button" @click="cruorinTypeChange">{{btnText}}></div>
        </el-collapse-item>
      </el-collapse>
      <div class="sugar">
        <div class="sugarChart" ref="sugarChart"></div>
      </div>
      <div class="table" :style="tableStyle">
        <div class="title">
          <span>血糖值统计表</span>
          <template v-if="isPersonal">
            <span>现已开启个性化范围监测，请查看</span>
            <span class="no-ok">需注意</span>
          </template>
          <template v-else>
            <span>现已开启平台范围监测，请查看</span>
            <span class="circle"></span>
          </template>
          <span>预警状态</span>
        </div>
        <el-table ref="table" size="small" height="calc(100% - 40px)" :data="tableData" header-cell-class-name="tableHeadStyle" cell-class-name="tableStyle" row-key="id" border>
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="状态" min-width="110">
            <template slot-scope="{row}">{{row.statusDesc}}
              <span class="circle" v-show="row.patRange==''&&row.status!='N'"></span>
            </template>
          </el-table-column>
          <el-table-column label="血糖类型" prop="typeDesc" min-width="100"></el-table-column>
          <el-table-column label="测量时间" prop="measurementDate" min-width="160"></el-table-column>
          <el-table-column label="测量结果" min-width="110">
            <template slot-scope="{row}">{{row.glu}}
              <span class="no-ok" v-show="row.patAbnormal=='Y'">需注意</span>
              <!-- <span class="ok" v-show="row.patAbnormal=='N'">达标</span> -->
            </template>
          </el-table-column>
          <el-table-column label="个性化范围" min-width="150">
            <template slot-scope="{row}">{{row.patRange==''?'—':row.patRange}}</template>
          </el-table-column>
          <el-table-column label="" prop="range" min-width="170" show-overflow-tooltip>
            <template slot="header">
              <span>平台范围(mmol/L)</span>
              <el-tooltip content="依照《中国 2 型糖尿病防治指南(2020 年版)》" placement="top">
                <IconSvg iconClass="info-blue" width="14" height="14" style="margin-left:5px"></IconSvg>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </div>
</template>

<script>
import echarts from "@/plugins/echarts";
import elTableInfiniteScroll from "el-table-infinite-scroll";
import {
  cruorinChartData,
  bloodSugarChartData,
  listPatBloodSugarForPage,
} from "@/api/modules/PatientCenter/indicatorAnaysis.js";

export default {
  props: {
    sugarDate: Array,
    pickerOptions: Object,
  },
  data() {
    return {
      daterange: [], //时间范围
      dataNum: 0, //采集数据条数
      abnormalNum: 0, //平台异常数
      patAbnormalNum: 0, //个性化异常数
      activeNames: [], //折叠面板
      cruorinData: {
        dates: [],
        values: [],
      }, //糖化血红蛋白趋势图
      cruorinChart: null,
      btnText: "全部",
      sugarData: {
        dates: [],
        empty: [], //空腹
        morning: [], //早餐后
        beforeLunch: [], //午餐前
        afterLunch: [], //午餐后
        beforeDinner: [], //晚餐前
        afterDinner: [], //晚餐后
        beforeSleep: [], //睡前
        afterSleep: [], //凌晨
      }, //血糖趋势图
      sugarChart: null,
      tableData: [], //血糖值统计表
      tableStyle: { height: "calc(100% - 432px)" },
      isPersonal: false, //是否开启个性化
      pageSize: 10,
      tipLoading: true,
      // scrollDisabled: false,
    };
  },
  directives: {
    // "el-table-infinite-scroll": elTableInfiniteScroll,
  },
  watch: {
    sugarDate: function (val) {
      this.daterange = val;
      if (val.length > 0) this.getData();
    },
  },
  computed: {
    isEmpty() {
      return this.sugarDate.length == 0;
    },
    // 是否有异常数据
    isAbnormal() {
      return this.abnormalNum || this.patAbnormalNum;
    },
  },
  mounted() {
    this.daterange = this.sugarDate;
    if (this.daterange.length > 0) this.getData();
  },
  methods: {
    // 获取患者数据
    getData() {
      let p = {
        patId: this.$route.query.patId,
        startDate: this.daterange?.[0] ?? "",
        endDate: this.daterange?.[1] ?? "",
      };
      this.getCruorinData(p);
      this.getSugarData(p);
      this.getTableData(p);
    },
    //糖化血红蛋白趋势图
    getCruorinData(param) {
      cruorinChartData(param).then(({ code, result }) => {
        if (code === 0) {
          this.cruorinData = {
            dates: result.dates,
            values: result.gly,
            isAbnormal: result.abnormal > 0 || result.patAbnormal > 0,
          };
          this.initCruorinChart();
        }
      });
    },
    //血糖趋势图&总条数&异常条数
    getSugarData(param) {
      this.tipLoading = true;
      bloodSugarChartData(param)
        .then(({ code, result }) => {
          if (code === 0) {
            this.dataNum = result.total;
            this.abnormalNum = result.abnormal;
            this.patAbnormalNum = result.patAbnormal;
            this.sugarData = {
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
            this.initsugarChart();
          }
          this.tipLoading = false;
        })
        .catch(() => {
          this.tipLoading = false;
        });
    },
    //血糖值统计表
    getTableData(param) {
      // 2022.12.29加折叠去掉分页
      // param.pageNum = 1;
      // param.pageSize = this.pageSize;
      // this.scrollDisabled = true;
      listPatBloodSugarForPage(param).then(({ code, result, total }) => {
        if (code === 0) {
          this.isPersonal = result.openStatus == "Y";
          this.tableData = result.patBloodList;
          // this.scrollDisabled = this.pageSize >= total;
        }
      });
    },
    // 折叠面板change
    collapseChange(active) {
      let style = { height: "calc(100% - 632px)" };
      if (active.length == 0) {
        style = { height: "calc(100% - 432px)" };
      }
      this.$nextTick(() => {
        this.tableStyle = style;
        if (this.cruorinChart) this.cruorinChart.resize();
      });
    },
    // 糖化血红蛋白type change
    cruorinTypeChange() {
      this.btnText = this.btnText == "全部" ? "返回" : "全部";
      let p = {
        patId: this.$route.query.patId,
      };
      if (this.btnText == "全部") {
        p.startDate = this.daterange?.[0] ?? "";
        p.endDate = this.daterange?.[1] ?? "";
      }
      this.getCruorinData(p);
    },
    // 糖化血红蛋白趋势图
    initCruorinChart() {
      if (!this.cruorinChart) {
        this.cruorinChart = echarts.init(this.$refs.cruorinChart);
      }
      let option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {},
        grid: {
          left: "5%",
          right: "5%",
          top: "30",
          bottom: "10",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisPointer: {
              show: true,
              snap: true,
              type: "none",
            },
            axisLabel: {
              color: "#303133",
            },
            data: this.cruorinData.dates,
          },
        ],
        yAxis: [
          {
            name: "%",
            type: "value",
            splitLine: {
              show: true,
            },
            nameTextStyle: {
              align: "right",
            },
            axisLabel: {
              color: "#303133",
            },
          },
        ],
        series: [
          {
            name: "糖化Hb",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            lineStyle: {
              color: "#4685B3",
            },
            areaStyle: {
              color: "#D5E0F7",
            },
            data: this.cruorinData.values,
          },
        ],
      };
      this.cruorinChart.setOption(option);
      window.addEventListener("resize", this.resizeChart);
    },
    // 血糖趋势图
    initsugarChart() {
      if (!this.sugarChart) {
        this.sugarChart = echarts.init(this.$refs.sugarChart);
      }
      let option = {
        title: {
          text: "血糖趋势图",
          textStyle: {
            color: "#303133",
            fontSize: 16,
            fontWeight: "normal",
          },
          padding: [10, 10, 10, 10],
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: 30,
          selected: {
            空腹: this.sugarData.empty.length > 0,
            早餐后: this.sugarData.morning.length > 0,
            午餐前: this.sugarData.beforeLunch.length > 0,
            午餐后: this.sugarData.afterLunch.length > 0,
            晚餐前: this.sugarData.beforeDinner.length > 0,
            晚餐后: this.sugarData.afterDinner.length > 0,
            睡前: this.sugarData.beforeSleep.length > 0,
            凌晨: this.sugarData.afterSleep.length > 0,
          },
        },
        grid: {
          left: "5%",
          right: "5%",
          top: "70",
          bottom: "10",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisPointer: {
              show: true,
              snap: true,
              type: "none",
            },
            axisLabel: {
              color: "#303133",
            },
            data: this.sugarData.dates,
          },
        ],
        yAxis: [
          {
            name: "mmol/L",
            type: "value",
            splitLine: {
              show: true,
            },
            nameTextStyle: {
              align: "right",
            },
            axisLabel: {
              color: "#303133",
            },
          },
        ],
        series: [
          {
            name: "空腹",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            lineStyle: {
              color: "#4685B3",
            },
            data: this.sugarData.empty,
          },
          {
            name: "早餐后",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            lineStyle: {
              color: "#6DD6CC",
            },
            data: this.sugarData.morning,
          },
          {
            name: "午餐前",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.sugarData.beforeLunch,
          },
          {
            name: "午餐后",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.sugarData.afterLunch,
          },
          {
            name: "晚餐前",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.sugarData.beforeDinner,
          },
          {
            name: "晚餐后",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.sugarData.afterDinner,
          },
          {
            name: "睡前",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.sugarData.beforeSleep,
          },
          {
            name: "凌晨",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.sugarData.afterSleep,
          },
        ],
      };
      this.sugarChart.setOption(option);
      window.addEventListener("resize", this.resizeChart);
    },
    resizeChart() {
      this.cruorinChart.resize();
      this.sugarChart.resize();
    },
    // loadMoreData() {
    //   this.scrollDisabled = true;
    //   this.pageSize += 10;
    //   let p = {
    //     patId: this.$route.query.patId,
    //     startDate: this.daterange?.[0] ?? "",
    //     endDate: this.daterange?.[1] ?? "",
    //   };
    //   this.getTableData(p);
    // },
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("resize", this.resizeChart);
    next();
  },
};
</script>

<style lang='scss' scoped>
.blood-sugar {
  height: 100%;
  .top {
    display: flex;
    height: 32px;
    .tip {
      display: flex;
      align-items: center;
      flex-grow: 1;
      background-color: #fdf7f2;
      border: 1px solid #fff1e5;
      margin-right: 10px;
      color: #f77601;
    }
    .tip-empty {
      flex-grow: 1;
    }
    .el-range-editor {
      width: 260px;
    }
  }
  .cruorin {
    margin: 10px 0;
    ::v-deep .el-collapse-item__header {
      background-color: #f6f7fb;
      border-radius: 6px;
      &.is-active {
        border-radius: 6px 6px 0 0;
      }
    }
    ::v-deep .el-collapse-item__wrap {
      border-radius: 0 0 6px 6px;
    }
    ::v-deep .el-collapse-item__content {
      padding: 0;
      background-color: #f6f7fb;
    }
    .el-collapse-item {
      position: relative;
      .title {
        font-size: 16px;
      }
      .empty {
        display: inline-block;
        width: 50px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #9d9d9d;
        background-color: #fff;
        border-radius: 4px;
        margin-left: 5px;
        border: 1px solid #bbb;
      }
      // .circle {
      //   display: inline-block;
      //   margin-left: 5px;
      //   background-color: #f77601;
      //   width: 6px;
      //   height: 6px;
      //   border-radius: 3px;
      // }
      .el-empty {
        text-align: center;
        ::v-deep .el-empty__image {
          margin: 0 auto;
        }
      }
      .cruorinChart {
        width: 100%;
        height: 200px;
      }
      .button {
        position: absolute;
        top: 40px;
        right: 40px;
        width: 50px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        color: #7495e6;
        background: #f0f2fb;
        border: 1px solid #d9e1ff;
        border-radius: 10px;
      }
    }
  }
  .sugar {
    height: 330px;
    background-color: #f6f7fb;
    border-radius: 6px;
    .sugarChart {
      width: 100%;
      height: 100%;
    }
  }
  .table {
    margin-top: 10px;
    .title {
      height: 40px;
      line-height: 40px;
      background-color: #f6f7fb;
      text-align: right;
      padding: 0 10px;
      span {
        font-size: 12px;
        color: #5b5b5b;
        &:first-child {
          float: left;
          font-size: 16px;
          color: #303133;
        }
        &.no-ok {
          color: #f77601;
        }
      }
    }
    .circle {
      display: inline-block;
      background-color: #f77601;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      margin: 0 3px;
    }
    .no-ok,
    .ok {
      display: inline-block;
      width: 48px;
      height: 20px;
      border-radius: 10px;
      border: 1px solid #f77601;
      text-align: center;
      color: #f77601;
      margin: 0 3px;
      line-height: 20px;
      font-size: 12px;
    }
    .ok {
      color: #a1a1a1;
      border: 1px solid #a1a1a1;
    }
    ::v-deep .tableHeadStyle {
      height: 40px;
      font-size: 14px;
      color: #303133;
      background-color: #f6f7fb !important;
    }
    ::v-deep .tableStyle {
      height: 40px;
      font-size: 14px;
    }
  }
  .empty {
    height: 100%;
    text-align: center;
    .el-image {
      margin-top: 180px;
      margin-bottom: 20px;
    }
    .text {
      font-size: 16px;
      color: #5b5b5b;
      .blue {
        color: #446abd;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
</style>
