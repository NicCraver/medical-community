<!--
  @description 患者指标分析-患者全局指标分析-患阅-血糖
  @date
-->
<template>
  <div class='sugar'>
    <template v-if="isEmpty">
      <div class="empty">
        <el-image :src="require('./record-empty.png')"></el-image>
        <div class="text">暂无内容</div>
      </div>
    </template>
    <template v-else>
      <div class="week-sugar">
        <div class="title">
          <i class="el-icon-caret-left" @click="getLastWeek"></i>
          <i class="el-icon-caret-right" @click="getNextWeek"></i>
          {{daterange.start}} 至 {{daterange.end}}
        </div>
        <div class="top">
          <span class="left">周血糖</span>
          <span class="circle normal"></span>正常{{weekData.nTot}}次
          <span class="circle low"></span>偏低{{weekData.lTot}}次
          <span class="circle high"></span>偏高{{weekData.hTot}}次
        </div>
        <div class="head">
          <div style="width:47px">
            <p>检测</p>
            <p>日期</p>
          </div>
          <div style="width:80px">
            <p>早餐</p><span>空腹</span><span>餐后</span>
          </div>
          <div style="width:80px">
            <p>午餐</p><span>餐前</span><span>餐后</span>
          </div>
          <div style="width:80px">
            <p>晚餐</p><span>餐前</span><span>餐后</span>
          </div>
          <div style="width:40px;line-height:36px">睡前</div>
          <div style="width:42px;line-height:36px">凌晨</div>
        </div>
        <div class="main">
          <div class="day" v-for="(l,index) in weekLabels" :key="index">
            <div class="weekday">
              <p class="date">{{weekdays[index]&&weekdays[index].label?weekdays[index].label:''}}</p>
              <p class="label" :style="{color:getWeekday(index)=='今天'?'#5381E3':'#919191'}">{{ getWeekday(index)}}</p>
            </div>
            <div v-for="type in dayData" :key="type" :style="getItemStyle(index,type)">{{getItemValue(index,type)}}</div>
          </div>
        </div>
      </div>
      <el-collapse class="cruorin" v-model="activeNames">
        <el-collapse-item name="cruorin">
          <template slot="title">
            <span class="title">糖化血红蛋白趋势图</span>
          </template>
          <div class="cruorinChart" ref="cruorinChart"></div>
        </el-collapse-item>
      </el-collapse>
      <div class="mesure-result">
        <div class="title">
          <span>血糖测量结果</span>
          <span class="range">正常范围</span>
          <IconSvg iconClass="info-gray" width="14"></IconSvg>
        </div>
        <div class="result" v-for="item in mesureResult" :key="item.measurementDate">
          <div class="date">{{item.measurementDateM}}</div>
          <template v-if="item.status=='H'">
            <el-image :src="require('./high.png')"></el-image>
            <span class="img-label" style="color:#F79161">偏高</span>
          </template>
          <template v-else-if="item.status=='L'">
            <el-image :src="require('./low.png')"></el-image>
            <span class="img-label" style="color:#2CD5C2">偏低</span>
          </template>
          <template v-else>
            <el-image :src="require('./normal.png')"></el-image>
            <span class="img-label" style="color:#5381E3">正常</span>
          </template>
          <div class="middle">
            <span class="value">{{item.glu}}</span>
            <span class="label">mmol/L {{item.typeDesc}}</span>
          </div>
          <!-- <div class="arrow">
            <i class="el-icon-arrow-right"></i>
          </div> -->
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import echarts from "@/plugins/echarts";
import dayjs from "dayjs";
import {
  onQueryBSDateForChart,
  onQueryGlyDateForChart,
  onQueryBSDate,
} from "@/api/modules/PatientCenter/indicatorAnaysis.js";

export default {
  props: {
    sugarDate: Array,
  },
  data() {
    return {
      daterange: { start: "", end: "" }, //日期范围
      weekdays: [], //一周日期
      weekLabels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"], //星期
      weekData: {
        nTot: "-",
        hTot: "-",
        lTot: "-",
        data: [],
      }, //周血糖
      dayData: [
        "typeA",
        "typeB",
        "typeC",
        "typeD",
        "typeE",
        "typeF",
        "typeG",
        "typeH",
      ], //血糖监测点
      activeNames: ["cruorin"],
      cruorinChart: null,
      cruorinData: {
        xAxis: [], //日期
        data: [{ data: [], name: "糖化Hb" }],
      }, //糖化血红蛋白趋势图
      mesureResult: [], //血糖测量结果
    };
  },
  computed: {
    isEmpty() {
      return this.sugarDate.length == 0;
    },
  },
  mounted() {
    this.getCurrentWeek();
    this.getCruorinData();
    this.getMesureResult();
  },
  methods: {
    // 获取周血糖数据
    getWeekData() {
      let p = {
        patId: this.$route.query.patId,
        startDate: dayjs().year().toString().slice(0, 2) + this.daterange.start,
        endDate: dayjs().year().toString().slice(0, 2) + this.daterange.end,
      };
      onQueryBSDateForChart(p).then(({ code, result }) => {
        if (code === 0) {
          if (result.data) {
            this.weekData = result;
          } else {
            this.weekData = { nTot: "-", hTot: "-", lTot: "-", data: [] };
          }
        }
      });
    },
    // 获取趋势图数据
    getCruorinData() {
      onQueryGlyDateForChart({
        patId: this.$route.query.patId,
      }).then(({ code, result }) => {
        if (code === 0) {
          this.cruorinData = result;
          this.initCruorinChart();
        }
      });
    },
    // 获取血糖测量结果
    getMesureResult() {
      onQueryBSDate({
        patId: this.$route.query.patId,
        pageNum: 1,
        pageSize: 50,
      }).then(({ code, result }) => {
        if (code === 0) {
          this.mesureResult = result.records;
        }
      });
    },
    // 当前周
    getCurrentWeek() {
      if (this.sugarDate.length > 0) {
        let arr = [];
        let monday = this.sugarDate[0];
        for (let i = 0; i < 7; i++) {
          let d = dayjs(monday).day(i + 1);
          arr.push({
            value: d.format("YY-MM-DD"),
            label: d.format("D"),
          });
        }
        this.weekdays = arr;
        this.daterange = {
          start: arr[0].value,
          end: arr[6].value,
        };
        this.getWeekData();
      }
    },
    // 上一周
    getLastWeek() {
      let arr = [];
      let monday =
        dayjs().year().toString().slice(0, 2) + this.weekdays[0].value;
      for (let i = 0; i < 7; i++) {
        let d = dayjs(monday).subtract(7 - i, "day");
        arr.push({ value: d.format("YY-MM-DD"), label: d.format("D") });
      }
      this.weekdays = arr;
      this.daterange = {
        start: arr[0].value,
        end: arr[6].value,
      };
      this.getWeekData();
    },
    // 下一周
    getNextWeek() {
      let arr = [];
      let sunday =
        dayjs().year().toString().slice(0, 2) + this.weekdays[6].value;
      for (let i = 0; i < 7; i++) {
        let d = dayjs(sunday).add(i + 1, "day");
        arr.push({ value: d.format("YY-MM-DD"), label: d.format("D") });
      }
      this.weekdays = arr;
      this.daterange = {
        start: arr[0].value,
        end: arr[6].value,
      };
      this.getWeekData();
    },
    //检测日期
    getWeekday(i) {
      if (
        this.weekdays[i] &&
        this.weekdays[i].value &&
        this.weekdays[i].value == dayjs().format("YY-MM-DD")
      ) {
        return "今天";
      }
      return this.weekLabels[i];
    },
    // 糖化血红蛋白趋势图
    initCruorinChart() {
      if(this.isEmpty) return
      if (!this.cruorinChart) {
        this.cruorinChart = echarts.init(this.$refs.cruorinChart);
      }
      let option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          right: 20,
          align: "right",
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: "#919191",
          },
          lineStyle: {
            color: "#f7f7f7",
          },
        },
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
            data: this.cruorinData.xAxis,
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
            name: "糖化Hb",
            type: "line",
            smooth: true,
            emphasis: {
              focus: "series",
            },
            lineStyle: {
              color: "#4685B3",
            },
            areaStyle: {
              color: "#D6E0F4",
            },
            data: this.cruorinData.data[0].data,
          },
        ],
      };
      this.cruorinChart.setOption(option);
    },
    // 样式
    getItemStyle(index, type) {
      if (this.weekData.data[index]) {
        let day = this.weekData.data[index];
        let status = day[type].status;
        if (status == "N") {
          return { color: "#5381e3" };
        } else if (status == "L") {
          return { color: "#2cd5c2" };
        } else if (status == "H") {
          return { color: "#f79161" };
        }
      }
    },
    // 血糖值
    getItemValue(index, type) {
      if (this.weekData.data[index]) {
        let day = this.weekData.data[index];
        let item = day[type];
        return item.glu;
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.sugar {
  height: 100%;
  overflow-y: auto;
  margin-right: 5px;
  .week-sugar {
    margin: 0 10px;
    box-sizing: border-box;
    .title {
      border-radius: 12px 12px 0 0;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background-color: #f0f0f0;
      color: #101010;
      padding: 0 10px;
      i {
        cursor: pointer;
        line-height: 38px;
        &::before {
          font-size: 18px;
        }
      }
      .el-icon-caret-left {
        float: left;
      }
      .el-icon-caret-right {
        float: right;
      }
    }
    .top {
      height: 44px;
      line-height: 44px;
      padding: 0 10px;
      background-color: #f7f7f7;
      font-size: 12px;
      color: #919191;
      .left {
        font-size: 16px;
        color: #333;
      }
      span.circle {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        margin: 0 5px 0 10px;
        &.normal {
          margin-left: 108px;
          background-color: #5381e3;
        }
        &.low {
          background-color: #2cd5c2;
        }
        &.high {
          background-color: #f79161;
        }
      }
    }
    .head {
      height: 36px;
      background-color: #f7f7f7;
      line-height: 18px;
      color: #333;
      div {
        float: left;
        text-align: center;
        span {
          display: inline-block;
          width: 40px;
          color: #919191;
        }
      }
    }
    .main {
      height: 290px;
      background-color: #f7f7f7;
      border-radius: 0 0 12px 12px;
      .day {
        height: 40px;
        div {
          float: left;
          height: 40px;
          width: 40px;
          line-height: 40px;
          text-align: center;
          background-color: #fff;
          border-bottom: 1px solid #f7f7f7;
          border-right: 1px solid #f7f7f7;
        }
        .weekday {
          width: 47px;
          background-color: #f7f7f7;
          .date {
            line-height: 25px;
            font-size: 16px;
            color: #101010;
          }
          .label {
            line-height: 15px;
            font-size: 12px;
            color: #919191;
          }
        }
      }
    }
  }
  .cruorin {
    margin: 10px;
    ::v-deep .el-collapse-item__header {
      background-color: #f0f0f0;
      border-radius: 12px;
      &.is-active {
        border-radius: 12px 12px 0 0;
      }
    }
    ::v-deep .el-collapse-item__wrap {
      border-radius: 0 0 12px 12px;
    }
    ::v-deep .el-collapse-item__content {
      padding: 10px 0 0 0;
      background-color: #f7f7f7;
    }
    .el-collapse-item {
      .title {
        font-size: 16px;
        color: #333;
      }
      .cruorinChart {
        width: 100%;
        height: 260px;
      }
    }
  }
  .mesure-result {
    background-color: #f8f8fa;
    padding: 16px 10px 10px 10px;
    .title {
      height: 18px;
      line-height: 18px;
      color: #333;
      font-size: 16px;
      .range {
        float: right;
        text-decoration: underline;
        font-size: 12px;
        color: #919191;
      }
      .svg-icon {
        float: right;
        margin: -2px 2px 0 0;
      }
    }
    .result {
      background-color: #fff;
      height: 120px;
      margin-top: 16px;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      .date {
        font-size: 12px;
        color: #919191;
        margin: 12px;
        height: 15px;
      }
      .el-image {
        position: absolute;
        top: 45px;
        left: 7px;
      }
      .img-label {
        position: absolute;
        top: 63px;
        left: 22px;
      }
      .middle {
        height: 75px;
        line-height: 75px;
        padding-left: 115px;
        .value {
          color: #101010;
          font-size: 18px;
          margin-right: 6px;
        }
        .label {
          font-size: 12px;
          color: #919191;
        }
      }
      .arrow {
        position: absolute;
        right: 20px;
        top: 65px;
        i {
          color: #d9d9d9;
          cursor: pointer;
          &.el-icon-arrow-right:before {
            font-size: 20px;
          }
        }
      }
    }
  }
  .empty {
    height: 100%;
    text-align: center;
    .el-image {
      margin-top: 300px;
      margin-bottom: 20px;
    }
  }
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  overflow: auto;
  margin-left: 5px;
  margin-right: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 4px;
}
</style>
