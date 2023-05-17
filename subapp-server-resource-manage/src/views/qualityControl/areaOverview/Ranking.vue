<!--
  @description 质控board-区域总览-机构质控排名
  @date 2022/04/01
-->
<template>
  <el-card v-loading="loading">
    <header>
      <span>机构质控排名</span>
      <IconSvg icon-class="download" width="16" height="16"></IconSvg>
      <el-select size="small" v-model="numType" v-show="rankData.total > 10" @change="getData">
        <el-option v-for="item in numTypeData" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
      <el-select size="small" class="chart-select" v-model="chartType" v-show="rankData.total > 5">
        <el-option v-for="item in chartTypeData" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
    </header>
    <div class="info">
      <span>考核机构：{{rankData.total}}家</span>
      <span class="fr">时间范围：{{rankData.dataStartDate?rankData.dataStartDate+'-'+rankData.dataEndDate:'累计'}}</span>
    </div>
    <el-table ref="table" height="0" v-adaptive="{ bottomOffset:chartType=='1'&&rankData.total>5?52:370 }" v-show="chartType != '2'" :data="rankData.orgScores" :cell-style="$parent.cellStyle">
      <el-table-column label="" type="index" width="50" align="center"></el-table-column>
      <el-table-column label="医疗机构" prop="orgName"></el-table-column>
      <el-table-column label="机构得分" prop="orgScore" align="center"></el-table-column>
    </el-table>
    <div class="chart" ref="chart" v-show="rankData.total <= 5 || chartType != '1'"></div>
  </el-card>
</template>

<script>
import { getOrgRank } from "api/qualityControl";

export default {
  props: { id: String },
  data() {
    return {
      numType: "2",
      numTypeData: [
        { value: "1", label: "全部" },
        { value: "2", label: "top 10" },
      ],
      chartType: "1",
      chartTypeData: [
        { value: "1", label: "排名" },
        { value: "2", label: "图表" },
        { value: "3", label: "排名+图表" },
      ],
      chart: null,
      rankData: {
        total: 0,
        dataStartDate: "",
        dataEndDate: "",
        orgScores: [],
      },
      loading: false,
    };
  },
  computed: {
    chartData() {
      let data = this.rankData.orgScores;
      return data.map((item) => {
        return { name: item.orgName, value: item.orgScore };
      });
    },
  },
  watch: {
    id: function (val) {
      this.numType = "2";
      this.chartType = "1";
      this.getData();
    },
  },
  methods: {
    getData() {
      let p = { id: this.id };
      if (this.numType == 2) {
        p.pageSize = 10;
        p.pageNum = 1;
      }
      this.loading = true;
      getOrgRank(p)
        .then(({ code, result }) => {
          if (code === 0) {
            this.rankData = result;
            this.initEchart();
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    initEchart() {
      if (!this.chart) {
        this.chart = this.$echarts.init(this.$refs.chart);
        this.$nextTick(() => {
          window.addEventListener("resize", this.resizeChart);
        });
      }
      let option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "bottom",
          left: "center",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "60%"],
            top: "-30",
            itemStyle: {
              borderRadius: "10%",
            },
            label: {
              show: true,
              position: "outside",
              width: 80,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "18",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: this.chartData,
          },
        ],
      };
      this.chart.setOption(option);
      this.$nextTick(() => {
        this.resizeChart();
      });
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
  ::v-deep .el-card__body {
    padding: 0;
  }
  header {
    height: 60px;
    line-height: 60px;
    padding: 0 10px;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 10px;
    span {
      font-size: 18px;
      font-weight: 700;
      margin-right: 10px;
    }
    .svg-icon {
      cursor: pointer;
    }
    .el-select {
      float: right;
      width: 90px;
    }
    .chart-select {
      width: 115px;
      margin-right: 10px;
    }
  }
  .info {
    height: 40px;
    line-height: 40px;
    background-color: #f5f5f5;
    padding: 0 10px;
    margin-bottom: 10px;
  }
  .el-table {
    padding: 0 10px;
  }
  .chart {
    width: 100%;
    height: 350px;
  }
}
</style>