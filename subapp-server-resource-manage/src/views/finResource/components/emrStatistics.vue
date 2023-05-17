<template>
  <el-card class="emrStatistics">
    <div class="title">
      <div class="title-info">电子病历数据统计</div>
      <div class="date-select">
        <el-select v-model="dateVal" placeholder="请选择" size="small" style="width: 100px" @change="dateChange">
          <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="cont">
      <!-- 折线图 -->
      <div id="myChart" class="myChart"></div>
    </div>
  </el-card>
</template>
<script>
import { createLineChartForEmr } from "api/finResource.js";

export default {
  name: "emrStatistics",
  data() {
    return {
      dateVal: "A",
      dateOptions: [
        {
          label: "全部",
          value: "A",
        },
        {
          label: "本年",
          value: "Y",
        },
        {
          label: "本月",
          value: "M",
        },
        {
          label: "本周",
          value: "W",
        },
      ],
      echartsInstance: null,
      echartsOptions: {
        legend: {
          left: "55%",
        },
        tooltip: {
          show: true,
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          axisPointer: {
            show: true,
            snap: true,
            type: "shadow",
          },
          data: [],
        },
        yAxis: {
          type: "value",
          name: "条数",
          nameTextStyle: {
            color: "#ccc",
          },
          nameGap: 20,
          nameLocation: "end",
          splitLine: {
            lineStyle: {
              type: "dashed",
              width: 1,
            },
            show: true,
          },
          /* interval: 10,
          max: 10000,
          min: 0, */
        },
        series: [
          {
            data: [],
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#5087ec",
            },
            areaStyle: {
              color: "#dce7fb",
            },
          },
        ],
      },
    };
  },
  mounted() {
    // 初始化echarts实例（必须写在第一行）
    this.echartsInstance = this.$echarts.init(
      document.getElementById("myChart")
    );
    // 监听浏览器大小变化
    window.addEventListener(
      "resize",
      () => {
        this.drawFuc();
      },
      false
    );
    this.getNatureData();
    this.drawFuc();
  },
  destroyed() {
    window.removeEventListener("resize", () => {
      this.drawFuc();
    });
  },
  methods: {
    dateChange() {
      this.getNatureData();
    },
    // 获取折线图数据
    async getNatureData() {
      this.loading = true;
      try {
        let params = {
          type: this.dateVal || "",
        };
        let { result = [], code } = await createLineChartForEmr(params);
        if (code === 0) {
          console.log("电子病历数据统计:", result);
          this.handleData(result);
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    handleData(result) {
      let xData = [];
      let yData = [];
      result.map((item) => {
        xData.push(item.name || "");
        yData.push(Number(item.count) || 0);
      });
      let obj = this.getScale(yData, 50, 5);
      this.$set(this.echartsOptions.xAxis, "data", xData);
      this.$set(this.echartsOptions.series[0], "data", yData);
      this.$set(this.echartsOptions, "yAxis", {
        ...this.echartsOptions.yAxis,
        ...obj,
      });
      this.drawFuc();
    },
    // 绘制折线图
    drawFuc() {
      // 先销毁echarts实例再进行init
      this.echartsInstance.dispose();
      this.echartsInstance = this.$echarts.init(
        document.getElementById("myChart")
      );
      this.echartsInstance.setOption(this.echartsOptions);
    },
    // 渲染刻度
    getScale(arr, ploidy, unit) {
      let maxNum = Math.max(...arr);
      let maxPloidy = Math.ceil(maxNum / ploidy) * ploidy;
      let obj = {
        min: 0,
        max: maxPloidy,
        interval: maxPloidy / unit,
      };
      return obj;
    },
  },
};
</script>
<style lang="less" scoped>
.emrStatistics {
  height: 100%;
  .title {
    height: 30px;
    padding: 0 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(48, 49, 51, 100);
    font-size: 18px;
    font-family: SourceHanSansSC-medium;
    .title-info {
      font-weight: 700;
    }
  }
  .cont {
    height: calc(100% - 40px);
    .myChart {
      height: 100%;
    }
  }
}
</style>