<template>
  <div class="DiseaseStatistics">
    <div ref="ChartRef" class="ChartRef" v-loading="loading"></div>
  </div>
</template>

<script>
import HollowCircle from "@/assets/hollow-circle.png";
import echarts from "@/plugins/echarts";
import { getHomePageData } from "@/api/modules/Home";

export default {
  data() {
    return {
      myChart: null,
      loading: true,
    };
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.fn);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.fn);
  },
  methods: {
    fn() {
      console.log(`按病种统计建档人数 监听窗口变化`);
      if (this.myChart) {
        this.myChart.resize();
      }
    },
    async init() {
      try {
        const res = await getHomePageData({
          type: "E",
        });
        const mockData = [
          { value: 40, name: "糖尿病" },
          { value: 38, name: "高血压" },
          { value: 32, name: "冠心病" },
          { value: 30, name: "通风" },
          { value: 28, name: "其他" },
        ];
        this.loading = false;
        // mock
        // this.createEcharts(mockData);
        this.createEcharts(res.result);
      } catch (error) {
        this.loading = false;
        console.log(`error`, error)
      }
    },
    createEcharts(data) {
      console.log(`data`, data);
      this.myChart = echarts.init(this.$refs.ChartRef);
      let option = {
        tooltip: {
          show: true,
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 0,
          top: 0,
          bottom: 20,
        },
        series: [
          // {
          //   type: "pie",
          //   radius: "70%",
          //   center: ["43%", "50%"],
          //   data: data,
          //   emphasis: {
          //     itemStyle: {
          //       shadowBlur: 10,
          //       shadowOffsetX: 0,
          //       shadowColor: "rgba(0, 0, 0, 0.5)",
          //     },
          //   },
          // },
          {
            name: "建档人数",
            type: "pie",
            radius: [30, 100],
            center: ["43%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            data: data,
          },
        ],
      };

      this.myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.DiseaseStatistics {
  .ChartRef {
    width: 100%;
    height: 290px;
  }
}
</style>
