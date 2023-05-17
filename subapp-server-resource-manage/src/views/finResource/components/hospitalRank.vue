<template>
  <el-card class="hospitalRank">
    <div class="title">
      <div class="title-info">排名</div>
      <div class="date-select">
        <el-select
          v-model="dateVal"
          placeholder="请选择"
          size="small"
          style="width: 100px"
          @change="dateChange"
        >
          <el-option
            v-for="item in dateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="cont">
      <div id="myChartHrank" class="myChartHrank"></div>
    </div>
  </el-card>
</template>
<script>
import { createPieChartForRanking } from "api/finResource.js";

export default {
  name: "hospitalRank",
  data() {
    return {
      loading: false,
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
        tooltip: {
          trigger: "item",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          left: "right",
          top: "center",
        },
        series: [
          {
            name: "",
            type: "pie",
            left: 0,
            radius: ["50%", "80%"],
            center: ["40%", "50%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            hoverAnimation: false,
            label: {
              position: "outer",
              alignTo: "none",
              bleedMargin: 5,
            },
            data: [],
          },
        ],
      },
    };
  },
  mounted() {
    // 初始化echarts实例（必须写在第一行）
    this.echartsInstance = this.$echarts.init(
      document.getElementById("myChartHrank")
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
    dateChange() {
      this.getNatureData();
    },
    // 获取饼图数据
    async getNatureData() {
      this.loading = true;
      try {
        let params = {
          type: this.dateVal || "",
        };
        let { result = [], code } = await createPieChartForRanking(params);
        if (code === 0) {
          console.log("医疗机构排名:", result);
          let arr = result.map((item, index) => {
            return {
              name: item.name || "",
              value: item.count || "0",
            };
          });

          this.$set(this.echartsOptions.series[0], "data", arr);
          this.drawFuc();
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 绘制饼图
    drawFuc() {
      this.echartsInstance.dispose();
      this.echartsInstance = this.$echarts.init(
        document.getElementById("myChartHrank")
      );
      this.echartsInstance.setOption(this.echartsOptions);
    },
  },
};
</script>
<style lang="less" scoped>
.hospitalRank {
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
    .myChartHrank {
      height: 100%;
    }
  }
}
</style>