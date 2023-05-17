<template>
  <el-card class="colStatistics" v-loading="loading">
    <div class="title">
      <div class="title-info">
        采集数据统计
        <img
          :src="require('img/collectMonitor/iconPark-refresh.png')"
          alt=""
          @click="getNatureData"
        />
      </div>
      <div class="date-select">
        <div class="right-title">
          <span :class="{ select: yearCurrent === 'C' }" @click="yearClick('C')"
            >本周</span
          >
          <span
            :class="{
              select: yearCurrent === 'L',
            }"
            @click="yearClick('L')"
            >上周</span
          >
        </div>
        <el-date-picker
          v-model="dateVal"
          type="date"
          size="small"
          style="width: 210px"
          :class="{ 'dateVal-select': dateVal }"
          placeholder="选择日期"
          format="yyyy-MM"
          value-format="yyyy-MM"
          @change="dateChange"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="cont">
      <!-- 折线图 -->
      <div id="colStatisticsChart" class="colStatisticsChart"></div>
    </div>
  </el-card>
</template>
<script>
import { getCreateLineChartForDate } from "api/indicator.js";

export default {
  name: "colStatistics",
  data() {
    return {
      yearCurrent: "C",
      dateVal: "",
      loading: false,
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
          interval: 50,
          max: 250,
          min: 0,
        },
        series: [
          {
            data: [],
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#4f4da6",
            },
            areaStyle: {
              color: "#dcdbed",
            },
          },
        ],
      },
      // 接口原始数据
      natureData: [],
      // x轴数据
      xAxisData: [],
      // 数据
      seriesData: [],
    };
  },
  mounted() {
    // 初始化echarts实例（必须写在第一行）
    this.echartsInstance = this.$echarts.init(
      document.getElementById("colStatisticsChart")
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
  },
  destroyed() {
    window.removeEventListener("resize", () => {
      this.drawFuc();
    });
  },
  methods: {
    yearClick(data) {
      this.dateVal = "";
      this.yearCurrent = data;
      this.getNatureData();
    },
    dateChange(val) {
      if (val) {
        this.yearCurrent = "";
        this.getNatureData();
      }
    },
    // 获取折线图数据
    async getNatureData() {
      this.loading = true;
      this.natureData = [];
      try {
        let params = {
          week: this.yearCurrent,
          month: this.dateVal,
        };
        let { result, code } = await getCreateLineChartForDate(params);
        if (code === 0) {
          console.log("采集数据统计:", result);
          this.natureData = result;
          this.handleNatureData();
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    handleNatureData() {
      let xAxisData = this.natureData.map((item) => {
        return item.date;
      });
      let seriesData = this.natureData.map((item) => {
        return item.value;
      });
      // let seriesData = [100, 140, 230, 100, 130, 100, 180];
      let scals = this.getScale(seriesData, 50, 5);
      console.log("scals:", scals);
      this.$set(this.echartsOptions.xAxis, "data", xAxisData);
      this.$set(this.echartsOptions.series[0], "data", seriesData);
      this.$set(this.echartsOptions, "yAxis", {
        ...this.echartsOptions.yAxis,
        ...scals,
      });
      this.drawFuc();
    },
    // 绘制折线图
    drawFuc() {
      // 先销毁echarts实例再进行init
      this.echartsInstance.dispose();
      this.echartsInstance = this.$echarts.init(
        document.getElementById("colStatisticsChart")
      );
      this.echartsInstance.setOption(this.echartsOptions);
    },
    // 渲染刻度
    getScale(arr, ploidy, unit) {
      let maxNum = Math.max(...arr);
      console.log("maxNummaxNummaxNummaxNum:", maxNum);
      let maxPloidy = Math.ceil(maxNum / ploidy) * ploidy || 50;
      console.log("maxPloidymaxPloidymaxPloidymaxPloidy:", maxPloidy);
      let obj = {
        min: 0,
        max: maxPloidy,
        interval: maxPloidy / unit,
      };
      console.log("objobjobjobjobj:", obj);
      return obj;
    },
  },
};
</script>
<style lang="less" scoped>
.colStatistics {
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
      display: flex;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        margin-left: 6px;
        cursor: pointer;
      }
    }
    .date-select {
      display: flex;
      align-items: center;
      .right-title {
        margin-right: 10px;
        span {
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          border-radius: 2px 0px 0px 2px;
          background-color: rgba(255, 255, 255, 100);
          color: rgba(93, 118, 217, 100);
          font-size: 14px;
          text-align: center;
          font-family: Roboto;
          border: 1px solid rgba(225, 225, 225, 100);
          cursor: pointer;
        }
        span:nth-child(1) {
          border-right: 0;
        }
        span.select {
          background-color: #5d76d9;
          color: rgba(254, 255, 254, 100);
        }
      }
      .dateVal-select {
        background-color: #5d76d9;
        ::v-deep .el-input__inner {
          background-color: #5d76d9;
          color: rgba(254, 255, 254, 100);
        }
      }
      ::v-deep .el-input__prefix {
        color: transparent;
      }
    }
  }
  .cont {
    height: calc(100% - 40px);
    .colStatisticsChart {
      height: 100%;
    }
  }
}
</style>