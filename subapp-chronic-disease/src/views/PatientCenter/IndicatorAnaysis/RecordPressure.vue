<!--
  @description 患者指标分析-患者全局指标分析-患阅-血压
  @date
-->
<template>
  <div class='pressure'>
    <template v-if="isEmpty">
      <div class="empty">
        <el-image :src="require('./record-empty.png')"></el-image>
        <div class="text">暂无内容</div>
      </div>
    </template>
    <template v-else>
      <div class="chart">
        <div class="pressureChart" ref="chart"></div>
      </div>
      <div class="mesure-result">
        <div class="title">
          <span>血压测量结果</span>
          <span class="range">正常范围</span>
          <IconSvg iconClass="info-gray" width="14"></IconSvg>
        </div>
        <div class="result" v-for="item in resultData" :key="item.createDate">
          <div class="date">{{item.measurementDate}}</div>
          <template v-if="item.levelDesc=='正常'">
            <el-image :src="require('./normal.png')"></el-image>
            <span class="img-label" style="color:#5381E3">{{item.levelDesc}}</span>
          </template>
          <template v-else>
            <el-image :src="require('./high.png')"></el-image>
            <span class="img-label" style="color:#F79161">{{item.levelDesc.slice(0,2)}}</span>
          </template>
          <div class="middle" style="margin-left:135px">
            <p class="label">收缩压</p>
            <p class="value">{{item.sbp}}</p>
          </div>
          <div class="middle">
            <p class="label">舒张压</p>
            <p class="value">{{item.dbp}}</p>
          </div>
          <!-- <div class="arrow">
            <i class="el-icon-arrow-right"></i>
          </div> -->
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import echarts from "@/plugins/echarts";
import {
  getBPDateForChart,
  onQueryBPDate,
} from "@/api/modules/PatientCenter/indicatorAnaysis.js";

export default {
  props: {
    pressureDate: Array,
  },
  data() {
    return {
      chart: null,
      chartData: {
        xAxis: [], //日期
        data: [
          { data: [], name: "收缩压" },
          { data: [], name: "舒张压" },
        ],
      }, //血压趋势图
      resultData: [], //血压测量结果
    };
  },
  computed: {
    isEmpty() {
      return this.pressureDate.length == 0;
    },
  },
  mounted() {
    this.getChartData();
    this.getResultData();
  },
  methods: {
    // 获取血压趋势图数据
    getChartData() {
      getBPDateForChart({
        patId: this.$route.query.patId,
      }).then(({ code, result }) => {
        if (code === 0) {
          this.chartData = result;
          this.initPressureChart();
        }
      });
    },
    // 获取血压测量结果
    getResultData() {
      onQueryBPDate({
        patId: this.$route.query.patId,
        pageNum: 1,
        pageSize: 50,
      }).then(({ code, result }) => {
        if (code === 0) {
          this.resultData = result.records;
        }
      });
    },
    // 血压趋势图init
    initPressureChart() {
      if(this.isEmpty) return
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart);
      }
      let option = {
        title: {
          text: "血压趋势图",
          textStyle: {
            color: "#303133",
            fontSize: 14,
            fontWeight: "bold",
          },
          padding: [15, 10, 10, 10],
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          top: 30,
          right: 20,
          align: "right",
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: "#919191",
          },
          lineStyle: {
            color: "#f7f7f7",
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
            data: this.chartData.xAxis,
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
            data: this.chartData.data[0].data,
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
            data: this.chartData.data[1].data,
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>

<style lang='scss' scoped>
.pressure {
  height: 100%;
  overflow-y: auto;
  margin-right: 5px;
  .chart {
    height: 300px;
    background-color: #f7f7f7;
    border-radius: 12px;
    margin: 0 10px;
    .pressureChart {
      width: 100%;
      height: 100%;
    }
  }
  .mesure-result {
    margin-top: 10px;
    background-color: #f8f8fa;
    padding: 16px 10px 10px 10px;
    .title {
      height: 18px;
      line-height: 18px;
      color: #333;
      font-size: 16px;
      font-weight: 500;
      .range {
        float: right;
        text-decoration: underline;
        font-size: 12px;
        color: #919191;
      }
      .svg-icon {
        float: right;
        margin: -2px 2px 0 0;
      }
    }
    .result {
      background-color: #fff;
      height: 120px;
      margin-top: 16px;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      .date {
        font-size: 12px;
        color: #919191;
        margin: 12px;
        height: 15px;
      }
      .el-image {
        position: absolute;
        top: 45px;
        left: 7px;
      }
      .img-label {
        position: absolute;
        top: 63px;
        left: 25px;
      }
      .middle {
        display: inline-block;
        width: 50px;
        margin-top: 15px;
        margin-left: 40px;
        text-align: center;
        .value {
          color: #101010;
          font-size: 18px;
          line-height: 30px;
        }
        .label {
          font-size: 12px;
          color: #919191;
          line-height: 15px;
        }
      }
      .arrow {
        position: absolute;
        right: 20px;
        top: 65px;
        i {
          color: #d9d9d9;
          cursor: pointer;
          &.el-icon-arrow-right:before {
            font-size: 20px;
          }
        }
      }
    }
  }
  .empty {
    height: 100%;
    text-align: center;
    .el-image {
      margin-top: 300px;
      margin-bottom: 20px;
    }
  }
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  overflow: auto;
  margin-left: 5px;
  margin-right: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 4px;
}
</style>
