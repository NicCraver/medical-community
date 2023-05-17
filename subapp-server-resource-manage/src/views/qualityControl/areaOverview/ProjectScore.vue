<!--
  @description 质控board-区域总览-方案得分
  @date 2022/04/01
-->
<template>
  <el-card>
    <div class="left fl" v-loading="scoreLoading">
      <header>
        <IconSvg icon-class="project" width="20" height="20"></IconSvg>
        <span class="defen">方案得分</span>
        <span class="score">{{scoreData.avgScore||scoreData.avgScore==0?scoreData.avgScore:"--"}}</span>
      </header>
      <div class="score-item" v-show="item.score || item.score == 0" v-for="(item, index) in typeData" :key="index" @click="itemClick(item)">
        <div class="score-left fl">
          <div class="icon fl">
            <IconSvg :icon-class="item.icon"></IconSvg>
          </div>
          <p class="score-type">{{item.label}}</p>
          <p class="score-label">全部机构得分</p>
        </div>
        <div class="score-right fr">{{item.score}}</div>
      </div>
      <el-image v-show="getTypeLength==1" :src="require('img/qualityControl/area-1.png')"></el-image>
      <el-image v-show="getTypeLength==2" :src="require('img/qualityControl/area-2.png')"></el-image>
      <el-image class="area-left" v-show="getTypeLength==3" :src="require('img/qualityControl/area-3-left.png')"></el-image>
      <el-image class="area-right" v-show="getTypeLength==3" :src="require('img/qualityControl/area-3-right.png')"></el-image>
    </div>
    <div class="right fr" v-loading="trendLoading">
      <header>
        <span>得分趋势</span>
        <el-date-picker size="small" v-model="queryMonth" type="month" placeholder="选择月" value-format="yyyy-MM" class="fr" @change="getChartData('2')"></el-date-picker>
        <el-radio-group size="small" v-model="content" class="fr" @change="getChartData('1')">
          <el-radio-button label="1">本次</el-radio-button>
          <el-radio-button label="2">上次</el-radio-button>
        </el-radio-group>
      </header>
      <div class="chart" ref="chart"></div>
      <el-empty description="暂无数据" v-show="echartData.areaScore==undefined || echartData.areaScore.length==0" :image="require('img/empty.png')"></el-empty>
    </div>
  </el-card>
</template>

<script>
import { formatDate } from "utils/utils";
import { getProjectScore, getProjectScoreTrend } from "api/qualityControl";

export default {
  props: {
    id: String,
    project: Object,
  },
  data() {
    return {
      scoreData: {},
      echartData: {},
      chart: null,
      content: "1",
      queryMonth: "",
      scoreLoading: false,
      trendLoading: false,
    };
  },
  computed: {
    typeData() {
      return [
        {
          type: "1",
          index: "areaRuleType1",
          icon: "sync",
          label: "一致性",
          score: this.scoreData.consistencyScore,
        },
        {
          type: "2",
          index: "areaRuleType2",
          icon: "endless",
          label: "整合性",
          score: this.scoreData.integrationScore,
        },
        {
          type: "3",
          index: "areaRuleType3",
          icon: "circular-conn",
          label: "完整性",
          score: this.scoreData.completeScore,
        },
        {
          type: "4",
          index: "areaRuleType4",
          icon: "flashlamp",
          label: "及时性",
          score: this.scoreData.timelinessScore,
        },
      ];
    },
    getTypeLength() {
      // 4种规则有得分的数量
      let num = 0;
      this.typeData.forEach((item) => {
        if (item.score || item.score == 0) num++;
      });
      return num;
    },
  },
  watch: {
    id: function (val) {
      this.content = "1";
      this.queryMonth = "";
      this.getData();
    },
  },
  methods: {
    // 获取数据
    getData() {
      // 方案得分
      this.scoreLoading = true;
      getProjectScore({ id: this.id })
        .then(({ result, code }) => {
          if (code === 0) {
            this.scoreData = result;
          }
          this.scoreLoading = false;
        })
        .catch(() => {
          this.scoreLoading = false;
        });
      this.getChartData();
    },
    //得分趋势
    getChartData(type) {
      let p = { id: this.id };
      if (type == 2 && this.queryMonth) {
        this.content = 0;
        let time = this.queryMonth.split("-");
        p.startDate = formatDate(
          new Date(time[0], time[1] - 1, 1),
          "yyyy-MM-dd"
        );
        p.endDate = formatDate(new Date(time[0], time[1], 0), "yyyy-MM-dd");
      } else {
        if (!this.queryMonth && type == 2) {
          this.content = 1;
        }
        this.queryMonth = "";
        // let date, week1, week7;
        // if (this.timeType == 1) {
        //   date = new Date();
        //   date.setDate(date.getDate() - date.getDay() + 1); //本周一
        //   week1 = formatDate(new Date(date), "yyyy-MM-dd");
        //   date.setDate(date.getDate() + 6); //本周日
        //   week7 = formatDate(new Date(date), "yyyy-MM-dd");
        // } else {
        //   date = new Date();
        //   date.setDate(date.getDate() - 7 - date.getDay() + 1); //上周一
        //   week1 = formatDate(new Date(date), "yyyy-MM-dd");
        //   date.setDate(date.getDate() + 6); //上周日
        //   week7 = formatDate(new Date(date), "yyyy-MM-dd");
        // }
        // p.startDate = week1;
        // p.endDate = week7;
        p.content = this.content;
      }

      this.trendLoading = true;
      getProjectScoreTrend(p)
        .then(({ result, code }) => {
          if (code === 0) {
            this.echartData = result;
            this.initEchart();
          }
          this.trendLoading = false;
        })
        .catch(() => {
          this.trendLoading = false;
        });
    },
    // 一致性/整合性等点击跳转
    itemClick(item) {
      this.$router.push({
        name: "areaOverviewType",
        params: {
          type: item.type,
          from: "overview",
          data: { ...this.project, ...item },
        },
      });
    },
    initEchart() {
      if (!this.chart) {
        this.chart = this.$echarts.init(this.$refs.chart);
      }
      let option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {},
        grid: {
          left: "5%",
          right: "5%",
          top: "40px",
          bottom: "0",
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
            data: this.echartData.dates,
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: true,
            },
          },
        ],
        series: [
          {
            name: "方案得分",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            lineStyle: {
              color: "#4685B3",
            },
            areaStyle: {
              color: "#DAE7F0",
            },
            data: this.echartData.areaScore,
          },
        ],
      };
      this.chart.setOption(option);
      window.addEventListener("resize", this.resizeChart);
    },
    resizeChart() {
      this.chart.resize();
    },
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("resize", this.resizeChart);
    next();
  },
};
</script>

<style lang="less" scoped>
.el-card {
  height: 100%;
  .left {
    position: relative;
    width: 35%;
    height: 100%;
    border-right: 1px solid #e9e9e9;
    header {
      height: 60px;
      padding: 0 15px 10px 10px;
      border-bottom: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
      .defen {
        font-size: 18px;
        font-weight: 700;
        margin-left: 10px;
      }
      .score {
        font-size: 26px;
        color: #446abd;
        flex-grow: 1;
        text-align: right;
      }
    }
    .score-item {
      height: 64px;
      padding: 0 10px;
      margin-top: 10px;
      margin-right: 10px;
      cursor: pointer;
      &:hover {
        border-bottom: 1px solid #dae6f0;
        border-right: 2px solid #446abd;
        color: #446abd;
        .icon {
          background-color: #e2ebfe;
        }
        .score-label {
          color: #9eb1dc;
        }
      }
      .icon {
        border: 1px solid #e2ebfe;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-top: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      p {
        margin-left: 50px;
      }
      .score-type {
        line-height: 30px;
        font-size: 16px;
      }
      .score-label {
        width: 100px;
        color: #919191;
      }
      .score-right {
        font-size: 18px;
        line-height: 64px;
      }
    }
    .el-image {
      position: absolute;
      left: calc(50% - 133px);
      bottom: 0;
      &.area-left {
        left: 0;
        bottom: 10px;
      }
      &.area-right {
        left: auto;
        right: 0px;
        bottom: -10px;
        width: 63px;
        height: 63px;
      }
    }
  }
  .right {
    width: 65%;
    position: relative;
    header {
      height: 60px;
      line-height: 50px;
      padding: 0 0 10px 10px;
      font-size: 16px;
      color: #919191;
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      .el-date-editor--daterange {
        width: 250px;
        margin-top: 9px;
      }
      .el-date-editor--month {
        width: 120px;
      }
      .el-radio-group {
        margin: 9px 10px 0 0;
      }
    }
    .chart {
      width: 100%;
      height: 298px;
    }
    .el-empty {
      position: absolute;
      right: 35%;
      bottom: 0;
    }
  }
}
</style>