<!--
  @description 机构质控-机构得分
  @date 2022/04/08
-->
<template>
  <el-card v-loading="loading">
    <header>
      <span class="name">{{scoreData.orgName}}</span>
      <div class="defen">
        <IconSvg icon-class="museum"></IconSvg>
        <span>机构得分</span>
        <span>{{scoreData.orgScore||scoreData.orgScore==0?scoreData.orgScore:"--"}}</span>
      </div>
      <div class="paiming">
        <IconSvg v-if="scoreData.orgRank=='1'" icon-class="paiming1"></IconSvg>
        <IconSvg v-else-if="scoreData.orgRank=='2'" icon-class="paiming2"></IconSvg>
        <IconSvg v-else-if="scoreData.orgRank=='3'" icon-class="paiming3"></IconSvg>
        <IconSvg v-else icon-class="paiming4"></IconSvg>
        <span>机构排名</span>
        <span :style="getPaimingStyle">{{scoreData.orgRank||'--'}}</span>
      </div>
    </header>
    <div class="left fl">
      <div class="score-item" v-show="item.score || item.score == 0" v-for="(item, index) in typeData" :key="index" @click="itemClick(item)">
        <div class="score-left fl">
          <div class="icon fl">
            <IconSvg :icon-class="item.icon"></IconSvg>
          </div>
          <p class="score-type">{{item.label}}</p>
          <p class="score-label">机构得分</p>
        </div>
        <div class="score-right fr">{{item.score}}</div>
      </div>
      <el-image v-show="getTypeLength==1" :src="require('img/qualityControl/area-1.png')"></el-image>
      <el-image v-show="getTypeLength==2" :src="require('img/qualityControl/area-2.png')"></el-image>
      <el-image class="area-left" v-show="getTypeLength==3" :src="require('img/qualityControl/area-3-left.png')"></el-image>
      <el-image class="area-right" v-show="getTypeLength==3" :src="require('img/qualityControl/area-3-right.png')"></el-image>
    </div>
    <div class="right fr">
      <div class="chart" ref="chart"></div>
    </div>
  </el-card>
</template>

<script>
import { getOrgScore } from "api/qualityControl";

export default {
  props: {
    id: String,
    project: Object,
  },
  data() {
    return {
      scoreData: {},
      chartData: {},
      chart: null,
      loading: false,
    };
  },
  computed: {
    getPaimingStyle() {
      if (this.scoreData.orgRank == "1") {
        return { color: "#F19192" };
      } else if (this.scoreData.orgRank == "2") {
        return { color: "#F2BB42" };
      } else if (this.scoreData.orgRank == "3") {
        return { color: "#66B9C4" };
      } else {
        return { color: "#4369BD" };
      }
    },
    typeData() {
      return [
        {
          type: "1",
          index: "institutionRuleType1",
          icon: "sync",
          label: "一致性",
          score: this.scoreData.consistencyScore,
        },
        {
          type: "2",
          index: "institutionRuleType2",
          icon: "endless",
          label: "整合性",
          score: this.scoreData.integrationScore,
        },
        {
          type: "3",
          index: "institutionRuleType3",
          icon: "circular-conn",
          label: "完整性",
          score: this.scoreData.completeScore,
        },
        {
          type: "4",
          index: "institutionRuleType4",
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
      this.getData();
    },
  },
  methods: {
    // 获取数据
    getData() {
      // 方案得分
      this.loading = true;
      getOrgScore({ id: this.id })
        .then(({ result, code }) => {
          if (code === 0) {
            this.scoreData = result;
            this.chartData = {
              coherence: result.consistencyMass || 0,
              integrated: result.integrationMass || 0,
              integrity: result.completeMass || 0,
              timeliness: result.timelinessMass || 0,
            };
            this.initEchart();
            this.$emit("getOrgId", result.orgId);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 一致性/整合性等点击跳转
    itemClick(item) {
      this.$router.push({
        name: "institutionOverviewType",
        params: {
          type: item.type,
          from: "overview",
          data: {
            ...this.project,
            row: {
              orgId: this.scoreData.orgId,
              orgName: this.scoreData.orgName,
              score: item.score,
            },
          },
        },
      });
    },
    initEchart() {
      if (!this.chart) {
        this.chart = this.$echarts.init(this.$refs.chart);
      }
      let option = {
        title: {
          text: "得分饱和度",
          top: 10,
          left: 20,
          textStyle: {
            fontSize: 16,
            fontWeight: "normal",
            fontFamily: "SourceHanSansSC-medium",
          },
        },
        tooltip: {
          trigger: "item",
          formatter: function ({ name, value }) {
            return name ? `${name} ${value}%` : "";
          },
        },
        legend: {
          top: "bottom",
          left: "center",
          icon: "circle",
          selectedMode: false,
          itemGap: 20,
          itemStyle: {
            borderWidth: 2,
            color: "#fff",
          },
          data: [
            {
              name: "一致性",
              itemStyle: {
                borderColor: "#F29292",
              },
            },
            {
              name: "整合性",
              itemStyle: {
                borderColor: "#FFBF85",
              },
            },
            {
              name: "完整性",
              itemStyle: {
                borderColor: "#8CCAD3",
              },
            },
            {
              name: "及时性",
              itemStyle: {
                borderColor: "#50A3FD",
              },
            },
          ],
          selected: {
            一致性: this.chartData.coherence != 0,
            整合性: this.chartData.integrated != 0,
            完整性: this.chartData.integrity != 0,
            及时性: this.chartData.timeliness != 0,
          },
        },
        series: [
          {
            type: "pie",
            radius: ["30%", "37%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: false,
            stillShowZeroSum: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              scaleSize: 5,
              label: {
                show: true,
                fontSize: "16",
                formatter: function ({ name, value }) {
                  return name ? `${name}\n${value}%` : "";
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "一致性",
                value: this.chartData.coherence,
                itemStyle: {
                  color: "#F29292",
                },
              },
              {
                name: "",
                value:
                  this.chartData.coherence == 0
                    ? 0
                    : 100 - this.chartData.coherence,
                itemStyle: {
                  color: "#E8E8E8",
                },
              },
            ],
          },
          {
            type: "pie",
            radius: ["44%", "51%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: false,
            stillShowZeroSum: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              scaleSize: 5,
              label: {
                show: true,
                fontSize: "16",
                formatter: function ({ name, value }) {
                  return name ? `${name}\n${value}%` : "";
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "整合性",
                value: this.chartData.integrated,
                itemStyle: {
                  color: "#FFBF85",
                },
              },
              {
                name: "",
                value:
                  this.chartData.integrated == 0
                    ? 0
                    : 100 - this.chartData.integrated,
                itemStyle: {
                  color: "#E8E8E8",
                },
              },
            ],
          },
          {
            type: "pie",
            radius: ["58%", "65%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: false,
            stillShowZeroSum: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              scaleSize: 5,
              label: {
                show: true,
                fontSize: "16",
                formatter: function ({ name, value }) {
                  return name ? `${name}\n${value}%` : "";
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "完整性",
                value: this.chartData.integrity,
                itemStyle: {
                  color: "#8CCAD3",
                },
              },
              {
                name: "",
                value:
                  this.chartData.integrity == 0
                    ? 0
                    : 100 - this.chartData.integrity,
                itemStyle: {
                  color: "#E8E8E8",
                },
              },
            ],
          },
          {
            type: "pie",
            radius: ["72%", "79%"],
            center: ["50%", "45%"],
            avoidLabelOverlap: false,
            stillShowZeroSum: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              scaleSize: 5,
              label: {
                show: true,
                fontSize: "16",
                formatter: function ({ name, value }) {
                  return name ? `${name}\n${value}%` : "";
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                name: "及时性",
                value: this.chartData.timeliness,
                itemStyle: {
                  color: "#50A3FD",
                },
              },
              {
                name: "",
                value:
                  this.chartData.timeliness == 0
                    ? 0
                    : 100 - this.chartData.timeliness,
                itemStyle: {
                  color: "#E8E8E8",
                },
              },
            ],
          },
        ],
      };
      this.chart.setOption(option);
      window.onresize = () => {
        this.chart.resize();
      };
    },
  },
  beforeRouteLeave(to, from, next) {
    window.onresize = null;
    next();
  },
};
</script>

<style lang="less" scoped>
.el-card {
  height: 100%;
  header {
    height: 60px;
    padding: 0 15px 10px 10px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    .name {
      font-weight: 700;
    }
    .defen {
      display: flex;
      align-items: center;
      span:first-of-type {
        margin: 0 20px 0 10px;
      }
      span:last-of-type {
        font-size: 26px;
        color: #446abd;
      }
    }
    .paiming {
      display: flex;
      align-items: center;
      span:first-of-type {
        margin: 0 20px 0 10px;
      }
      span:last-of-type {
        font-size: 36px;
        font-style: italic;
        color: #446abd;
      }
    }
  }
  .left {
    width: 35%;
    height: calc(100% - 60px);
    border-right: 1px solid #e9e9e9;
    position: relative;
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
    height: calc(100% - 60px);
    position: relative;
    .chart {
      width: 100%;
      height: 100%;
    }
  }
}
</style>