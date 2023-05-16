<template>
  <div class="blood-pressure">
    <div class="echartCont">
      <div class="title">血压趋势图</div>
      <div ref="ChartRef" class="ChartRef"></div>
    </div>

    <div class="tableCont">
      <div class="title">
        <span>血压值统计表</span>
        <template v-if="isPersonalBP">
          <span>现已开启个性化范围监测，请查看</span>
          <span class="no-ok">需注意</span>
        </template>
        <template v-else>
          <span>现已开启平台范围监测，请查看</span>
          <span class="circle"></span>
        </template>
        <span>预警状态</span>
      </div>
      <el-table
        :data="bloodPressureData"
        height="320px"
        border
        v-el-table-infinite-scroll="loadMoreData"
        infinite-scroll-disabled="scrollDisabled"
      >
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :min-width="item.width"
          :sortable="item.sortable"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <template v-if="item.prop === 'statusDesc'">
              {{ row[item.prop] }}
              <span
                class="circle"
                v-show="!isPersonalBP && row.status == 'Y'"
              ></span>
            </template>
            <template v-else-if="item.prop === 'sbp' || item.prop === 'dbp'">
              {{ row[item.prop] }}
              <span class="no-ok" v-show="row[item.props] == 'Y'">需注意</span>
              <!-- <span class="ok" v-show="row[item.props] == 'N'">达标</span> -->
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
import { IconSvg } from "anx-vue";
import elTableInfiniteScroll from "el-table-infinite-scroll";

export default {
  name: "BloodPressure",
  components: { IconSvg },
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll,
  },
  props: {
    isPersonalBP: {
      type: Boolean,
      default: false,
    },
    bloodPressureData: {
      type: Array,
      default() {
        return [];
      },
    },
    bloodPressureChartData: {
      type: Object,
      default() {
        return {
          dates: [],
          sbp: [],
          dbp: [],
        };
      },
    },
    scrollDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myChart: null,
      echartsOptions: {
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
            data: [],
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
            data: [],
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
            data: [],
          },
        ],
      },
      tableColumn: [
        {
          prop: "statusDesc",
          label: "状态",
          width: 80,
          sortable: true,
        },
        {
          prop: "measurementDate",
          label: "测量时间",
          width: 160,
        },
        {
          prop: "sbp",
          props: "patSbpAbnormal",
          label: "收缩压（高压）",
          width: 120,
        },
        {
          prop: "dbp",
          props: "patDbpAbnormal",
          label: "舒张压（低压）",
          width: 120,
        },
        {
          prop: "patRange",
          label: "个性化范围 ",
          width: 150,
        },
        {
          prop: "range",
          label: "级别范围 （mmHg）",
          width: 180,
        },
      ],
    };
  },
  watch: {
    bloodPressureData: {
      handler(val) {},
      immediate: true,
      deep: true,
    },
    bloodPressureChartData: {
      handler(val) {
        if (val?.dates?.length) {
          let dates = val.dates || [];
          let sbp = val.sbp || [];
          let dbp = val.dbp || [];
          this.$set(this.echartsOptions.xAxis[0], "data", dates);
          this.$set(this.echartsOptions.series[0], "data", sbp);
          this.$set(this.echartsOptions.series[1], "data", dbp);
          this.$nextTick(() => {
            this.myChart = echarts.init(this.$refs.ChartRef);
            this.myChart.setOption(this.echartsOptions);
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.myChart = echarts.init(this.$refs.ChartRef);
      this.myChart.setOption(this.echartsOptions);
      setTimeout(() => {
        this.fn();
      }, 500);
    });
    window.addEventListener("resize", this.fn);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.fn);
  },
  methods: {
    // 监听窗口变化
    fn() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },
    loadMoreData() {
      this.$emit("loadMoreData");
    },
  },
};
</script>

<style lang='scss' scoped>
.blood-pressure {
  .echartCont {
    width: 100%;
    height: 300px;
    margin-bottom: 10px;
    border-radius: 6px;
    background-color: rgba(246, 247, 251, 1);
    padding: 10px;
    display: flex;
    flex-direction: column;
    .title {
      height: 22px;
      line-height: 22px;
      color: rgba(51, 51, 51, 1);
      font-size: 16px;
      font-family: SourceHanSansSC-regular;
      margin-bottom: 10px;
    }
    .ChartRef {
      flex: 1;
    }
  }

  .tableCont {
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
