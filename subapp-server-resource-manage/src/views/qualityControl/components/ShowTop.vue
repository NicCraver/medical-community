<!--
  @description 质控board-区域总览-各个总览-查看-上面部分
  @date 2022/03/30
-->
<template>
  <div>
    <el-card class="top">
      <div class="left fl">
        <header>
          <el-select v-if="isMultiple" size="small" v-model="activeId" @change="selectChange">
            <el-option v-for="item in projectData" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
          <span v-else>{{info.name}}</span>
          <i class="iconfont icon-ellipsis" @click.stop="$refs.show.open(info)"></i>
        </header>
        <p class="hospital">{{info.orgName}}</p>
        <div class="hos-left fl">
          <div class="icon fl">
            <IconSvg :icon-class="info.icon"></IconSvg>
          </div>
          <p class="type">{{info.label}}</p>
          <p class="score-type">机构得分</p>
        </div>
        <div class="hos-right fr">
          <span class="score">{{info.score}}</span>
          <span class="fen">分</span>
        </div>
      </div>
      <div class="right fr">
        <div class="chart" ref="chart"></div>
      </div>
    </el-card>

    <Show ref="show"></Show>
  </div>
</template>

<script>
import Show from "../areaOverview/Show.vue";
import { getProjects } from "api/qualityControl";

export default {
  components: { Show },
  props: {
    info: Object,
    echartData: Object,
    isMultiple: Boolean,
  },
  data() {
    return {
      chart: null,
      activeId: "",
      projectData: [],
    };
  },
  watch: {
    echartData: function (val) {
      this.initEchart();
    },
  },
  methods: {
    // 获取发布方案
    getProjectData(type, id) {
      getProjects({ configType: type, overviewType: 1 }).then(
        ({ result, code }) => {
          if (code === 0) {
            this.projectData = result;
            if (result.length > 0) {
              let index = 0;
              if (id) {
                index = result.findIndex((item) => item.id == id);
                index = index == -1 ? 0 : index;
              }
              this.activeId = result[index].id;
              this.$emit("projectChange", this.activeId, result[index].name);
            } else {
              this.activeId = "";
            }
          }
        }
      );
    },
    selectChange(val) {
      let name = this.projectData.find((item) => item.id == val).name;
      this.$emit("projectChange", val, name);
    },
    initEchart() {
      if (!this.chart) {
        this.chart = this.$echarts.init(this.$refs.chart);
      }
      let option = {
        color: ["#4685B3", "#DA775B"],
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["机构得分", "区域得分"],
          top: "middle",
          left: "right",
          align: "right",
          orient: "vertical",
        },
        grid: {
          left: "5%",
          right: "20%",
          top: "40px",
          bottom: "5px",
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
            name: "得分趋势",
            nameGap: 20,
            interval: this.echartData.scoreType == 1 ? 0.2 : 20,
            max: this.echartData.scoreType == 1 ? 1 : 100,
            min: 0,
            nameTextStyle: {
              color: "#919191",
              fontSize: "14",
              align: "right",
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                width: 1,
              },
            },
          },
        ],
        series: [
          {
            name: "机构得分",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.echartData.orgScores,
          },
          {
            name: "区域得分",
            type: "line",
            smooth: true,
            symbol: "rect",
            emphasis: {
              focus: "series",
            },
            data: this.echartData.areaScore,
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
.top {
  height: 175px;
  margin-bottom: 10px;
  .left {
    width: 30%;
    height: 100%;
    border-right: 1px solid #e9e9e9;
    header {
      height: 26px;
      line-height: 21px;
      border-bottom: 1px solid #e9e9e9;
      span {
        font-size: 16px;
        color: #919191;
        margin: 0 10px;
      }
      .iconfont {
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        &::before {
          display: inline-block;
          transform: rotate(90deg);
        }
      }
      .el-select ::v-deep {
        .el-input__inner {
          border: none;
          height: 20px;
          line-height: 20px;
          color: #1d42d0;
        }
        .el-input__icon {
          line-height: 20px !important;
          color: #1d42d0;
        }
      }
    }
    .hospital {
      font-size: 16px;
      margin: 16px 10px;
    }
    .hos-left {
      margin-left: 10px;
      .icon {
        border: 1px solid #e2ebfe;
        width: 35px;
        height: 35px;
        margin-top: 15px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      p {
        margin-left: 50px;
      }
      .type {
        font-size: 16px;
        margin-top: 5px;
        margin-bottom: 10px;
      }
      .score-type {
        color: #919191;
      }
    }
    .hos-right {
      margin: 15px 25px 0 0;
      .score {
        font-size: 28px;
        color: #446abd;
        margin-right: 3px;
      }
      .fen {
        color: #919191;
      }
    }
  }
  .right {
    width: 70%;
    height: 100%;
    .chart {
      width: 100%;
      height: 100%;
    }
  }
}
</style>