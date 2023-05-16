<!--
  @description 患者指标分析-血压
  @date
-->
<template>
  <div class='blood-pressure'>
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
      <div class="chart" ref="chart"></div>
      <div class="table">
        <div class="title">
          <span>血压值统计表</span>
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
        <el-table ref="table" size="small" height="0" v-adaptive="{ bottomOffset: 20 }" :data="tableData" v-el-table-infinite-scroll="loadMoreData" infinite-scroll-disabled="scrollDisabled" header-cell-class-name="tableHeadStyle" cell-class-name="tableStyle" border>
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="状态" min-width="80" sortable>
            <template slot-scope="{row}">{{row.statusDesc}}
              <span class="circle" v-show="row.patRange==''&&row.status!='0'"></span>
            </template>
          </el-table-column>
          <el-table-column label="测量时间" prop="measurementDate" min-width="160"></el-table-column>
          <el-table-column label="收缩压(高压)" min-width="120">
            <template slot-scope="{row}">{{row.sbp}}
              <span class="no-ok" v-show="row.patSbpAbnormal=='Y'">需注意</span>
            </template>
          </el-table-column>
          <el-table-column label="舒张压(低压)" min-width="120">
            <template slot-scope="{row}">{{row.dbp}}
              <span class="no-ok" v-show="row.patDbpAbnormal=='Y'">需注意</span>
            </template>
          </el-table-column>
          <el-table-column label="个性化范围" min-width="150">
            <template slot-scope="{row}">{{row.patRange==''?'—':row.patRange}}</template>
          </el-table-column>
          <el-table-column label="" prop="range" min-width="200" show-overflow-tooltip>
            <template slot="header">
              <span>平台范围(mmHg)</span>
              <el-tooltip content="依照《中国高血压防治指南2018年修订版》" placement="top">
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
  bloodPressureChartData,
  listPatBloodPressuresForPage,
} from "@/api/modules/PatientCenter/indicatorAnaysis.js";

export default {
  props: {
    pressureDate: Array,
    pickerOptions: Object,
  },
  data() {
    return {
      daterange: [], //时间范围
      dataNum: 0, //采集数据条数
      abnormalNum: 0, //平台异常数
      patAbnormalNum: 0, //个性化异常数
      chart: null, //血压折线图
      chartData: {
        dates: [],
        sbp: [],
        dbp: [],
      },
      tableData: [], //血压值统计表
      isPersonal: false, //是否开启个性化
      pageSize: 10,
      scrollDisabled: false,
      tipLoading: true,
    };
  },
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll,
  },
  watch: {
    pressureDate: function (val) {
      this.daterange = val;
      if (val.length > 0) this.getData();
    },
  },
  computed: {
    isEmpty() {
      return this.pressureDate.length == 0;
    },
    // 是否有异常数据
    isAbnormal() {
      return this.abnormalNum || this.patAbnormalNum;
    },
  },
  mounted() {
    this.daterange = this.pressureDate;
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
      this.getChartData(p);
      this.getTableData(p);
    },
    // 血压折线图&总条数&异常条数
    getChartData(param) {
      this.tipLoading = true;
      bloodPressureChartData(param)
        .then(({ code, result }) => {
          if (code === 0) {
            this.dataNum = result.total;
            this.abnormalNum = result.abnormal;
            this.patAbnormalNum = result.patAbnormal;
            this.chartData = {
              dates: result.dates,
              sbp: result.sbp,
              dbp: result.dbp,
            };
            this.initChart();
          }
          this.tipLoading = false;
        })
        .catch(() => {
          this.tipLoading = false;
        });
    },
    // 血压值统计表
    getTableData(param) {
      param.pageNum = 1;
      param.pageSize = this.pageSize;
      this.scrollDisabled = true;
      listPatBloodPressuresForPage(param).then(({ code, result, total }) => {
        if (code === 0) {
          this.isPersonal = result.openStatus == "Y";
          this.tableData = result.patBloodList;
          this.scrollDisabled = this.pageSize >= total;
        }
      });
    },
    // 折线图init
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart);
      }
      let option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: 30,
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
            data: this.chartData.dates,
          },
        ],
        yAxis: [
          {
            name: "mmHg",
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
            name: "收缩压",
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
            data: this.chartData.sbp,
          },
          {
            name: "舒张压",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            lineStyle: {
              color: "#6DD6CC",
            },
            areaStyle: {
              color: "#B3DEED",
            },
            data: this.chartData.dbp,
          },
        ],
      };
      this.chart.setOption(option);
      window.addEventListener("resize", this.resizeChart);
    },
    resizeChart() {
      this.chart.resize();
    },
    loadMoreData() {
      this.scrollDisabled = true;
      this.pageSize += 10;
      let p = {
        patId: this.$route.query.patId,
        startDate: this.daterange?.[0] ?? "",
        endDate: this.daterange?.[1] ?? "",
      };
      this.getTableData(p);
    },
  },
};
</script>

<style lang='scss' scoped>
.blood-pressure {
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
  .chart {
    height: 300px;
    background-color: #f6f7fb;
    margin: 10px 0;
    border-radius: 6px;
  }
  .table {
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
      margin: 2px 3px;
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
