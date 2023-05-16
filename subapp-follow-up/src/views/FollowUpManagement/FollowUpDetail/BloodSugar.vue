<template>
  <div class="blood-sugar">
    <el-collapse class="cruorin" v-model="activeNames" @change="collapseChange">
      <el-collapse-item name="cruorin">
        <template slot="title">
          <span class="title">糖化血红蛋白趋势图</span>
          <span class="empty" v-if="cruorinData.dates.length == 0">无数据</span>
          <span class="circle" v-else></span>
        </template>
        <div
          class="cruorinChart"
          ref="cruorinChart"
          v-show="activeNames.indexOf('cruorin') > -1"
        ></div>
      </el-collapse-item>
    </el-collapse>
    <div class="sugar">
      <div class="sugarChart" ref="sugarChart"></div>
    </div>
    <div class="table">
      <div class="title">
        <span>血糖值统计表</span>
        <template v-if="isPersonalBS">
          <span>现已开启个性化范围监测，请查看</span>
          <span class="no-ok">需注意</span>
        </template>
        <template v-else>
          <span>现已开启平台范围监测，请查看</span>
          <span class="circle"></span>
        </template>
        <span>预警状态</span>
      </div>
      <el-table :data="bloodSugarData" max-height="320px" border row-key="id">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :min-width="item.width"
          :sortable="item.sortable"
          show-overflow-tooltip
        >
          <template slot="header">
            <template v-if="item.prop === 'range'">
              <span>平台范围(mmol/L)</span>
              <el-tooltip
                content="依照《中国 2 型糖尿病防治指南(2020 年版)》"
                placement="top"
              >
                <IconSvg
                  iconClass="info-blue"
                  width="14"
                  height="14"
                  style="margin-left: 5px"
                ></IconSvg>
              </el-tooltip>
            </template>
            <template v-else>{{ item.label }}</template>
          </template>
          <template slot-scope="{ row }">
            <template v-if="item.prop === 'statusDesc'">
              {{ row[item.prop] }}
              <span
                class="circle"
                v-show="!isPersonalBS && row.status != 'N'"
              ></span>
            </template>
            <template v-else-if="item.prop === 'glu'">
              {{ row[item.prop] }}
              <span class="no-ok" v-show="row.patAbnormal == 'Y'">需注意</span>
              <!-- <span class="ok" v-show="row.patAbnormal == 'N'">达标</span> -->
            </template>
            <template v-else-if="item.prop === 'patRange'">
              {{ row[item.prop] || "—" }}
            </template>
            <template v-else>{{ row[item.prop] }}</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import echarts from "@/plugins/echarts";

export default {
  props: {
    pickerOptions: Object,
    cruorinData: {
      type: Object,
      default() {
        return {
          dates: [],
          values: [],
        };
      },
    },
    bloodSugarChartData: {
      type: Object,
      default() {
        return {
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
      },
    },
    bloodSugarData: {
      type: Array,
      default() {
        return [];
      },
    },
    isPersonalBS: {
      type: Boolean,
      default: false,
    },
    scrollDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeNames: [],
      cruorinChart: null,
      sugarChart: null,
      tableColumn: [
        {
          prop: "statusDesc",
          label: "状态",
          width: 80,
          sortable: true,
        },
        {
          prop: "typeDesc",
          label: "监测时间点",
          width: 100,
        },
        {
          prop: "measurementDate",
          label: "测量时间",
          width: 160,
        },
        {
          prop: "glu",
          props: "patAbnormal",
          label: "测量结果",
          width: 110,
        },
        {
          prop: "patRange",
          label: "个性化范围 ",
          width: 150,
        },
        {
          prop: "range",
          label: "",
          width: 180,
        },
      ],
      timer: null,
    };
  },
  watch: {
    bloodSugarData: {
      handler(val) {},
      immediate: true,
      deep: true,
    },
    bloodSugarChartData: {
      handler(val) {
        if (val?.dates?.length) {
          this.$nextTick(() => {
            this.initsugarChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
    cruorinData: {
      handler(val) {
        this.activeNames = [];
        if (val?.dates?.length) {
          this.activeNames = ["cruorin"];
          this.$nextTick(() => {
            this.initCruorinChart();
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.cruorinChart = echarts.init(this.$refs.cruorinChart);
      this.sugarChart = echarts.init(this.$refs.sugarChart);
    });

    window.addEventListener("resize", this.resizeChart);
  },
  methods: {
    // 折叠面板change
    collapseChange(active) {
      this.timer = setTimeout(() => {
        this.resizeChart();
      }, 5);
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
            data: this.cruorinData?.dates || [],
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
            name: "空腹",
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
            data: this.cruorinData?.values || [],
          },
        ],
      };
      this.cruorinChart.setOption(option);
      this.timer = setTimeout(() => {
        this.resizeChart();
      }, 5);
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
            空腹: this.bloodSugarChartData?.empty?.length,
            早餐后: this.bloodSugarChartData?.morning?.length,
            午餐前: this.bloodSugarChartData?.beforeLunch?.length,
            午餐后: this.bloodSugarChartData?.afterLunch?.length,
            晚餐前: this.bloodSugarChartData?.beforeDinner?.length,
            晚餐后: this.bloodSugarChartData?.afterDinner?.length,
            睡前: this.bloodSugarChartData?.beforeSleep?.length,
            凌晨: this.bloodSugarChartData?.afterSleep?.length,
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
            data: this.bloodSugarChartData?.dates || [],
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
            data: this.bloodSugarChartData?.empty || [],
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
            data: this.bloodSugarChartData?.morning || [],
          },
          {
            name: "午餐前",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.bloodSugarChartData?.beforeLunch || [],
          },
          {
            name: "午餐后",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.bloodSugarChartData?.afterLunch || [],
          },
          {
            name: "晚餐前",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.bloodSugarChartData?.beforeDinner || [],
          },
          {
            name: "晚餐后",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.bloodSugarChartData?.afterDinner || [],
          },
          {
            name: "睡前",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.bloodSugarChartData?.beforeSleep || [],
          },
          {
            name: "凌晨",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            data: this.bloodSugarChartData?.afterSleep || [],
          },
        ],
      };
      this.sugarChart.setOption(option);
      this.timer = setTimeout(() => {
        this.resizeChart();
      }, 5);
    },
    resizeChart() {
      this.cruorinChart?.resize();
      this.sugarChart?.resize();
    },
    loadMoreData() {
      this.$emit("loadMoreData");
    },
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("resize", this.resizeChart);
    clearTimeout(this.timer);
    this.timer = null;
    next();
  },
};
</script>

<style lang='scss' scoped>
.blood-sugar {
  height: 100%;
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
      .circle {
        display: inline-block;
        margin-left: 5px;
        background-color: #f77601;
        width: 6px;
        height: 6px;
        border-radius: 3px;
      }
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
  }
}
</style>
