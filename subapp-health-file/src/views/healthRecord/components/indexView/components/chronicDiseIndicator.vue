<template>
  <div class="chronicDiseIndicator">
    <!-- 有数据 -->
    <div class="showCom">
      <div class="title">
        <div class="title-item">
          <IconSvg iconClass="jibenzhexiantu" width="24" height="24"></IconSvg>
          <div class="chronics">慢病指标</div>
          <div
            class="high"
            :class="{ selected: currentObj.pro === 'highOptions' }"
            v-if="
              natureData.bloodPressureList &&
              natureData.bloodPressureList.length
            "
            @click="buttonClick('highOptions')"
          >
            高
          </div>
          <div
            class="sugar"
            :class="{ selected: currentObj.pro === 'sugarOptions' }"
            v-if="
              natureData.bloodGlucoseList && natureData.bloodGlucoseList.length
            "
            @click="buttonClick('sugarOptions')"
          >
            糖
          </div>
          <div
            class="BMI"
            :class="{ selected: currentObj.pro === 'BMIOptions' }"
            v-if="natureData.bmiList && natureData.bmiList.length"
            @click="buttonClick('BMIOptions')"
          >
            BMI
          </div>
        </div>
        <div>
          <el-radio-group
            v-model="currentObj.type"
            @change="buttonClick(currentObj.pro)"
          >
            <el-radio-button label="1"
              ><IconSvg
                iconClass="jibenzhexiantu"
                width="20"
                height="20"
              ></IconSvg
            ></el-radio-button>
            <el-radio-button label="2"
              ><IconSvg iconClass="biaoge" width="20" height="20"></IconSvg
            ></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- 折线图 -->
      <div id="myChart" class="myChart" v-show="currentObj.type === '1'"></div>
      <!-- 表格 -->
      <div class="myTable" v-if="currentObj.type === '2'">
        <div class="table-title" v-if="currentObj.pro === 'highOptions'">
          <span class="table-title-item">{{ highTableData.unit }}</span>
          <span class="table-title-item table-title-item-title">{{
            highTableData.title
          }}</span>
        </div>
        <div class="table-title" v-else-if="currentObj.pro === 'sugarOptions'">
          <span class="table-title-item">{{ sugarTableData.unit }}</span>
          <span class="table-title-item table-title-item-title">{{
            sugarTableData.title
          }}</span>
        </div>
        <div class="table-title" v-else-if="currentObj.pro === 'BMIOptions'">
          <span class="table-title-item">{{ BMITableData.unit }}</span>
          <span class="table-title-item table-title-item-title">{{
            BMITableData.title
          }}</span>
        </div>
        <div class="table-cont">
          <!-- 高血压表格数据 -->
          <el-table
            :data="highTableData.data"
            v-if="currentObj.pro === 'highOptions'"
          >
            <el-table-column
              v-for="(item, index) in highTableData.column"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :min-width="item.width"
            >
            </el-table-column>
          </el-table>
          <!-- 高血糖表格数据 -->
          <el-table
            :data="sugarTableData.data"
            v-else-if="currentObj.pro === 'sugarOptions'"
          >
            <el-table-column
              v-for="(item, index) in sugarTableData.column"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :min-width="item.width"
            >
            </el-table-column>
          </el-table>
          <!-- BMI表格数据 -->
          <el-table
            :data="BMITableData.data"
            v-else-if="currentObj.pro === 'BMIOptions'"
          >
            <el-table-column
              v-for="(item, index) in BMITableData.column"
              :key="index"
              :label="item.label"
              :prop="item.prop"
              :min-width="item.width"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 无数据 -->
    <div class="emptyCom" v-if="!isShow">
      <div class="title">
        <IconSvg iconClass="jibenzhexiantu" width="24" height="24"></IconSvg>
        <div class="chronics">慢病指标</div>
      </div>
      <div class="emptyBox">
        <IconSvg
          iconClass="empty-box"
          style="color: #cacdd4"
          width="80"
          height="80"
        ></IconSvg>
        <div class="emptyText">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getChronicDiseases } from "@/api/modules/healthRecord/index.js";
import dayjs from "dayjs";

// 测试数据
const natureData = {
  bloodGlucoseList: [
    {
      date: "2020-01-05T09:17:25.566Z",
      fbg: 8,
      pbg: 7,
    },
    {
      date: "2020-03-05T09:17:25.566Z",
      fbg: 6,
      pbg: 5,
    },
    {
      date: "2020-03-08T09:17:25.566Z",
      fbg: 9,
      pbg: 7,
    },
    {
      date: "2021-01-04T09:17:25.566Z",
      fbg: 7,
      pbg: 6,
    },
    {
      date: "2021-03-05T09:17:25.566Z",
      fbg: 6,
      pbg: 9,
    },
    {
      date: "2021-03-06T09:17:25.566Z",
      fbg: 7,
      pbg: 8,
    },
    {
      date: "2021-04-01T09:17:25.566Z",
      fbg: 6,
      pbg: 5,
    },
    {
      date: "2021-04-07T09:17:25.566Z",
      fbg: 4,
      pbg: 6,
    },
    {
      date: "2021-08-10T09:17:25.566Z",
      fbg: 8,
      pbg: 9,
    },
    {
      date: "2021-10-02T09:17:25.566Z",
      fbg: 9,
      pbg: 7,
    },
    {
      date: "2021-11-15T09:17:25.566Z",
      fbg: 8,
      pbg: 5,
    },
    {
      date: "2021-12-01T09:17:25.566Z",
      fbg: 7,
      pbg: 6,
    },
  ],
  bloodPressureList: [
    {
      date: "2020-01-05T09:17:25.566Z",
      dbp: 122,
      sbp: 88,
    },
    {
      date: "2020-03-05T09:17:25.566Z",
      dbp: 148,
      sbp: 100,
    },
    {
      date: "2020-03-08T09:17:25.566Z",
      dbp: 123,
      sbp: 90,
    },
    {
      date: "2021-01-04T09:17:25.566Z",
      dbp: 130,
      sbp: 80,
    },
    {
      date: "2021-03-05T09:17:25.566Z",
      dbp: 149,
      sbp: 101,
    },
    {
      date: "2021-03-06T09:17:25.566Z",
      dbp: 121,
      sbp: 90,
    },
    {
      date: "2021-04-01T09:17:25.566Z",
      dbp: 120,
      sbp: 80,
    },
    {
      date: "2021-04-07T09:17:25.566Z",
      dbp: 149,
      sbp: 98,
    },
    {
      date: "2021-08-10T09:17:25.566Z",
      dbp: 120,
      sbp: 80,
    },
    {
      date: "2021-10-02T09:17:25.566Z",
      dbp: 180,
      sbp: 88,
    },
    {
      date: "2021-11-15T09:17:25.566Z",
      dbp: 150,
      sbp: 80,
    },
    {
      date: "2021-12-01T09:17:25.566Z",
      dbp: 135,
      sbp: 75,
    },
    {
      date: "2021-12-08T09:17:25.566Z",
      dbp: 111,
      sbp: 77,
    },
  ],
  bmiList: [
    {
      date: "2020-01-05T09:17:25.566Z",
      bmi: 28,
    },
    {
      date: "2020-03-05T09:17:25.566Z",
      bmi: 27,
    },
    {
      date: "2020-03-08T09:17:25.566Z",
      bmi: 27.5,
    },
    {
      date: "2021-01-04T09:17:25.566Z",
      bmi: 25,
    },
    {
      date: "2021-03-05T09:17:25.566Z",
      bmi: 23,
    },
    {
      date: "2021-03-06T09:17:25.566Z",
      bmi: 19,
    },
    {
      date: "2021-04-01T09:17:25.566Z",
      bmi: 20,
    },
    {
      date: "2021-04-07T09:17:25.566Z",
      bmi: 20,
    },
    {
      date: "2021-08-10T09:17:25.566Z",
      bmi: 21,
    },
    {
      date: "2021-10-02T09:17:25.566Z",
      bmi: 22,
    },
    {
      date: "2021-11-15T09:17:25.566Z",
      bmi: 24,
    },
    {
      date: "2021-12-01T09:17:25.566Z",
      bmi: 26,
    },
  ],
};
export default {
  name: "chronicDiseIndicator",
  data() {
    return {
      natureData: {
        bloodGlucoseList: [],
        bloodPressureList: [],
        bmiList: [],
      },
      //当前显示
      currentObj: {
        pro: "",
        type: "1", // 1:折线图； 2:表格
      },
      // echarts实例
      echartsInstance: null,
      // 公共属性
      commonOptions: {
        title: {
          left: "45%",
          textStyle: {
            fontSize: "14px",
            fontFamily: "SourceHanSansSC-regular",
            color: "#101010",
          },
        },
        grid: {
          left: "100px",
          bottom: "20px",
        },
        legend: {
          left: "55%",
        },
        tooltip: {
          show: true,
          trigger: "axis",
        },
        xAxis: {
          name: "",
          type: "category",
          axisLine: {
            lineStyle: {
              // color: "#6e7079",
              color: "#f4f4f4",
            },
          },
          axisPointer: {
            show: true,
            type: "shadow",
            snap: true,
          },
        },
        yAxis: {
          nameLocation: "end",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#f4f4f4",
              width: 1,
              type: "solid",
            },
          },
          axisLabel: {
            color: "#5a5a5a",
          },
        },
      },
      // 高血压定制数据
      highData: {
        //x轴数据
        xAxisData: [],
        // 刻度
        yAxisData: {
          max: 200,
          interval: 50,
        },
        // 高血压舒张压与收缩压
        seriesData: [[], []],
      },
      // 糖尿病定制数据
      sugarData: {
        //x轴数据
        xAxisData: [],
        // 刻度
        yAxisData: {
          max: 10,
          interval: 2,
        },
        // 糖尿病随机血糖与空腹血糖
        seriesData: [[], []],
      },
      // BMI定制数据
      BMIData: {
        //x轴数据
        xAxisData: [],
        // 刻度
        yAxisData: {
          max: 30,
          interval: 5,
        },
        // BMI数据
        seriesData: [[]],
      },
      // 高血压表格列名以及数据
      highTableData: {
        unit: "单位：mmHg",
        title: "近期血压情况",
        column: [
          {
            prop: "date",
            label: "时间",
            width: 80,
          },
        ],
        data: [
          {
            date: "收缩压",
          },
          {
            date: "舒张压",
          },
        ],
      },
      // 高血糖表格列名以及数据
      sugarTableData: {
        unit: "单位：mmol/L",
        title: "近期血糖情况",
        column: [
          {
            prop: "date",
            label: "时间",
            width: 80,
          },
        ],
        data: [
          {
            date: "随机血糖",
          },
          {
            date: "空腹血糖",
          },
        ],
      },
      // BMI表格列名以及数据
      BMITableData: {
        title: "近期BMI指数",
        column: [
          {
            prop: "date",
            label: "时间",
            width: 80,
          },
        ],
        data: [
          {
            date: "BMI指数",
          },
        ],
      },
    };
  },
  props: {
    // 健康档案
    personalInfos: {
      type: Object,
      default() {
        return {
          personalArchiveInfo: {},
        };
      },
    },
  },
  watch: {
    personalInfos: {
      handler(val, old) {
        if (
          old &&
          old.hasOwnProperty("personalArchiveInfo") &&
          old.personalArchiveInfo.pAId &&
          val.personalArchiveInfo.pAId !== old.personalArchiveInfo.pAId
        ) {
          this.getNatureData();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    // 高血压图表数据
    highOptions() {
      return {
        title: {
          ...this.commonOptions.title,
          text: "近期血压情况",
        },
        grid: this.commonOptions.grid,
        legend: this.commonOptions.legend,
        tooltip: this.commonOptions.tooltip,
        xAxis: {
          ...this.commonOptions.xAxis,
          data: this.highData.xAxisData,
        },
        yAxis: {
          ...this.commonOptions.yAxis,
          ...this.highData.yAxisData,
          name: "单位：mmHg",
          min: 0,
        },
        series: [
          {
            name: "收缩压",
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#ea8f8f",
              width: 0.5,
            },
            itemStyle: {
              color: "#ea8f8f",
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#ea8f8f",
                },
                {
                  offset: 1,
                  color: "rgba(255,224,191, 0)",
                },
              ]),
              // color: "#ea8f8f",
              opacity: 0.2,
            },

            symbol: "circle",
            symbolSize: 2,

            markLine: {
              label: { show: false }, //不显示文本
              silent: true, //不响应和触发鼠标事件
              lineStyle: {
                color: "#ea8f8f",
                type: "dashed",
                width: 0.5,
                opacity: 0.5,
              },
              symbol: "none", //标线两端的标记类型
              data: [
                {
                  name: "偏高临界值",
                  yAxis: 120,
                },
              ],
            },
            data: this.highData.seriesData[0],
          },
          {
            name: "舒张压",
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#446abd",
              width: 0.5,
            },
            itemStyle: {
              color: "#446abd",
            },
            symbol: "circle",
            symbolSize: 2,
            /* areaStyle: {
              color: "#446abd",
              opacity: 0.2,
            }, */
            markLine: {
              label: { show: false }, //不显示文本
              silent: true, //不响应和触发鼠标事件
              lineStyle: {
                color: "#446abd",
                type: "dashed",
                width: 0.5,
                opacity: 0.5,
              },
              symbol: "none", //标线两端的标记类型
              data: [
                {
                  name: "偏低临界值",
                  yAxis: 80,
                },
              ],
            },
            data: this.highData.seriesData[1],
          },
        ],
      };
    },
    // 糖尿病图表数据
    sugarOptions() {
      return {
        title: {
          ...this.commonOptions.title,
          text: "近期血糖情况",
        },
        grid: this.commonOptions.grid,
        legend: this.commonOptions.legend,
        tooltip: this.commonOptions.tooltip,
        xAxis: {
          ...this.commonOptions.xAxis,
          data: this.sugarData.xAxisData,
        },
        yAxis: {
          ...this.commonOptions.yAxis,
          ...this.sugarData.yAxisData,
          name: "单位：mmol/L",
          min: 0,
        },
        series: [
          {
            name: "随机血糖",
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#5087EC",
              width: 1,
            },
            itemStyle: {
              color: "#5087EC",
            },
            symbol: "circle",
            symbolSize: 2,
            data: this.sugarData.seriesData[0],
          },
          {
            name: "空腹血糖",
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#68BBC4",
              width: 1,
            },
            itemStyle: {
              color: "#68BBC4",
            },
            symbol: "circle",
            symbolSize: 2,
            data: this.sugarData.seriesData[1],
          },
        ],
      };
    },
    // BMI图表数据
    BMIOptions() {
      return {
        title: {
          ...this.commonOptions.title,
          text: "近期BMI指数",
        },
        grid: this.commonOptions.grid,
        legend: this.commonOptions.legend,
        tooltip: this.commonOptions.tooltip,
        xAxis: {
          ...this.commonOptions.xAxis,
          data: this.BMIData.xAxisData,
        },
        yAxis: {
          ...this.commonOptions.yAxis,
          ...this.BMIData.yAxisData,
          name: "单位：kg/㎡",
          min: 0,
        },
        series: [
          {
            name: "BMI",
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#5087EC",
              width: 1,
            },
            itemStyle: {
              color: "#5087EC",
            },
            markLine: {
              label: { show: false }, //不显示文本
              silent: true, //不响应和触发鼠标事件
              symbol: "none", //标线两端的标记类型
              data: [
                {
                  name: "偏高临界值",
                  yAxis: 24,
                  lineStyle: {
                    color: "#ea8f8f",
                    type: "dashed",
                    width: 0.5,
                    opacity: 0.5,
                  },
                },
                {
                  name: "偏低临界值",
                  yAxis: 18,
                  lineStyle: {
                    color: "#5087EC",
                    type: "dashed",
                    width: 0.5,
                    opacity: 0.5,
                  },
                },
              ],
            },
            symbol: "circle",
            symbolSize: 2,
            data: this.BMIData.seriesData[0],
          },
        ],
      };
    },
    isShow() {
      let arr =
        (this.natureData.bloodPressureList &&
          this.natureData.bloodPressureList) ||
        (this.natureData.bloodGlucoseList &&
          this.natureData.bloodGlucoseList) ||
        (this.natureData.bmiList && this.natureData.bmiList);
      return arr.length > 0;
    },
  },
  mounted() {
    // 初始化echarts实例（必须写在第一行）
    if (document.getElementById("myChart")) {
      this.echartsInstance = this.$echarts.init(
        document.getElementById("myChart")
      );
    }
    // 监听浏览器大小变化
    window.addEventListener("resize", () => {
      if (this.currentObj.type === "1" && this.currentObj.pro) {
        this.drawFuc(this.currentObj.pro);
      }
    });
    this.getNatureData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.echartsInstance.dispose();
    });
  },
  methods: {
    // 获取慢病数据
    async getNatureData() {
      // this.handleNatureData(natureData);
      try {
        let { code, result } = await getChronicDiseases({
          pAId:
            this.personalInfos.personalArchiveInfo.pAId ||
            "",
        });
        if (code === 0) {
          console.log("慢病折线数据：", result);
          this.handleNatureData(result);
        }
      } catch (error) {}
    },
    // 处理数据
    handleNatureData(result) {
      this.natureData = result;
      // 高血压
      this.highData = {
        xAxisData: [],
        yAxisData: {
          max: 200,
          interval: 50,
        },
        seriesData: [[], []],
      };
      this.$set(this.highTableData, "data", [
        {
          date: "收缩压",
        },
        {
          date: "舒张压",
        },
      ]);
      this.$set(this.highTableData, "column", [
        {
          prop: "date",
          label: "时间",
          width: 80,
        },
      ]);
      let bloodPressureList = this.natureData.bloodPressureList;
      let newBloodPressureList = [];
      if (bloodPressureList && bloodPressureList.length > 12) {
        // 高血压数据只展示最近12次的记录
        newBloodPressureList = bloodPressureList.slice(
          bloodPressureList.length - 12
        );
      } else if (bloodPressureList && bloodPressureList.length) {
        newBloodPressureList = bloodPressureList;
      }
      newBloodPressureList &&
        newBloodPressureList.forEach((item, index) => {
          let dateStr =
            index > 0
              ? dayjs(newBloodPressureList[index - 1].date).format("YY")
              : "";
          let dateStrNew = "";
          if (dateStr === dayjs(item.date).format("YY")) {
            dateStrNew = dayjs(item.date).format("MM-DD");
          } else {
            dateStrNew = dayjs(item.date).format("YY-MM-DD");
          }

          this.$set(this.highData.xAxisData, this.highData.xAxisData.length, {
            value: dateStrNew,
            textStyle: {
              color: "#5a5a5a",
            },
          });
          this.$set(
            this.highData.seriesData[0],
            this.highData.seriesData[0].length,
            item.sbp
          );
          this.$set(
            this.highData.seriesData[1],
            this.highData.seriesData[1].length,
            item.dbp
          );
          this.$set(
            this.highTableData.column,
            this.highTableData.column.length,
            {
              prop: dayjs(item.date).format("YYYYMMDDHHmmss"),
              label: dateStrNew,
            }
          );
          this.$set(
            this.highTableData.data[0],
            dayjs(item.date).format("YYYYMMDDHHmmss"),
            item.sbp
          );
          this.$set(
            this.highTableData.data[1],
            dayjs(item.date).format("YYYYMMDDHHmmss"),
            item.dbp
          );
        });
      let highDataAll = this.highData.seriesData[0].concat(
        this.highData.seriesData[1]
      );
      let highObj = this.getScale(highDataAll, 50, 5);
      this.$set(this.highData, "yAxisData", highObj);
      // 高血糖
      this.sugarData = {
        xAxisData: [],
        yAxisData: {
          max: 10,
          interval: 2,
        },
        seriesData: [[], []],
      };
      this.$set(this.sugarTableData, "data", [
        {
          date: "随机血糖",
        },
        {
          date: "空腹血糖",
        },
      ]);
      this.$set(this.sugarTableData, "column", [
        {
          prop: "date",
          label: "时间",
          width: 80,
        },
      ]);
      this.natureData.bloodGlucoseList &&
        this.natureData.bloodGlucoseList.forEach((item, index) => {
          let dateStr =
            index > 0
              ? dayjs(this.natureData.bloodGlucoseList[index - 1].date).format(
                  "YY"
                )
              : "";
          let dateStrNew = "";
          if (dateStr === dayjs(item.date).format("YY")) {
            dateStrNew = dayjs(item.date).format("MM-DD");
          } else {
            dateStrNew = dayjs(item.date).format("YY-MM-DD");
          }
          this.$set(this.sugarData.xAxisData, this.sugarData.xAxisData.length, {
            value: dateStrNew,
            textStyle: {
              color: "#5a5a5a",
            },
          });
          this.$set(
            this.sugarData.seriesData[0],
            this.sugarData.seriesData[0].length,
            item.fbg
          );
          this.$set(
            this.sugarData.seriesData[1],
            this.sugarData.seriesData[1].length,
            item.pbg
          );
          this.$set(
            this.sugarTableData.column,
            this.sugarTableData.column.length,
            {
              prop: dayjs(item.date).format("YYYYMMDDHHmmss"),
              label: dateStrNew,
            }
          );
          this.$set(
            this.sugarTableData.data[0],
            dayjs(item.date).format("YYYYMMDDHHmmss"),
            item.fbg
          );
          this.$set(
            this.sugarTableData.data[1],
            dayjs(item.date).format("YYYYMMDDHHmmss"),
            item.pbg
          );
        });
      let sugarDataAll = this.sugarData.seriesData[0].concat(
        this.sugarData.seriesData[1]
      );
      let sugarObj = this.getScale(sugarDataAll, 5, 5);
      this.$set(this.sugarData, "yAxisData", sugarObj);
      // BMI
      this.BMIData = {
        xAxisData: [],
        yAxisData: {
          max: 30,
          interval: 5,
        },
        seriesData: [[]],
      };
      this.$set(this.BMITableData, "data", [
        {
          date: "BMI指数",
        },
      ]);
      this.$set(this.BMITableData, "column", [
        {
          prop: "date",
          label: "时间",
          width: 80,
        },
      ]);
      this.natureData.bmiList &&
        this.natureData.bmiList.forEach((item, index) => {
          let dateStr =
            index > 0
              ? dayjs(this.natureData.bmiList[index - 1].date).format("YY")
              : "";
          let dateStrNew = "";
          if (dateStr === dayjs(item.date).format("YY")) {
            dateStrNew = dayjs(item.date).format("MM-DD");
          } else {
            dateStrNew = dayjs(item.date).format("YY-MM-DD");
          }
          this.$set(this.BMIData.xAxisData, this.BMIData.xAxisData.length, {
            value: dateStrNew,
            textStyle: {
              color: "#5a5a5a",
            },
          });
          this.$set(
            this.BMIData.seriesData[0],
            this.BMIData.seriesData[0].length,
            item.bmi
          );
          this.$set(this.BMITableData.column, this.BMITableData.column.length, {
            prop: dayjs(item.date).format("YYYYMMDDHHmmss"),
            label: dateStrNew,
          });
          this.$set(
            this.BMITableData.data[0],
            dayjs(item.date).format("YYYYMMDDHHmmss"),
            item.bmi
          );
        });
      let BMIObj = this.getScale(this.BMIData.seriesData[0], 5, 5);
      this.$set(this.BMIData, "yAxisData", BMIObj);
      // 绘制
      let optionsName =
        this.natureData.bloodPressureList &&
        this.natureData.bloodPressureList.length
          ? "highOptions"
          : this.natureData.bloodGlucoseList &&
            this.natureData.bloodGlucoseList.length
          ? "sugarOptions"
          : this.natureData.bmiList && this.natureData.bmiList.length
          ? "BMIOptions"
          : "";
      this.currentObj = {
        pro: optionsName,
        type: "1",
      };
      this.$nextTick(() => {
        optionsName && this.drawFuc(this.currentObj.pro);
      });
    },
    // 绘制折线图
    drawFuc(data) {
      // 先销毁echarts实例再进行init
      this.echartsInstance.dispose();
      if (!document.getElementById("myChart")) {
        return;
      }
      this.echartsInstance = this.$echarts.init(
        document.getElementById("myChart")
      );
      this.echartsInstance.setOption(this[data]);
    },
    // 切换高糖BMI
    buttonClick(data) {
      this.currentObj.pro = data;
      if (this.currentObj.type === "1") {
        this.drawFuc(data);
        return;
      }
      this.echartsInstance.dispose();
    },
    // 渲染刻度
    getScale(arr, ploidy, unit) {
      let maxNum = Math.max(...arr);
      // console.log("maxNummaxNummaxNummaxNum:", maxNum);
      let maxPloidy = Math.ceil(maxNum / ploidy) * ploidy;
      // console.log("maxPloidymaxPloidymaxPloidymaxPloidy:", maxPloidy);
      let obj = {
        min: 0,
        max: maxPloidy,
        interval: maxPloidy / unit,
      };
      // console.log("objobjobjobjobj:", obj);
      return obj;
    },
  },
};
</script>
<style lang="scss">
.chronicDiseIndicator {
  height: 100%;
  position: relative;
  .showCom {
    height: 100%;
    .title {
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .title-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        div {
          margin-right: 10px;
          // height: 20px;
          line-height: 20px;
          padding: 2px 6px;
          font-size: 12px;
          text-align: left;
          font-family: SourceHanSansSC-medium;
          border-radius: 2px;
        }
        .chronics {
          margin-right: 20px;
          font-size: 16px;
          color: #446bbd;
          border: 1px solid transparent;
          font-weight: bold;
        }
        .high {
          color: #f3666c;
          border: 1px solid #fde8e9;
          cursor: pointer;
        }
        .high.selected {
          background-color: #fde8e9;
          color: #f3666c;
          border: 1px solid #fde8e9;
        }
        .sugar {
          color: #68bbc4;
          border: 1px solid #e3f3f5;
          cursor: pointer;
        }
        .sugar.selected {
          background-color: #e3f3f5;
          color: #68bbc4;
          border: 1px solid #e3f3f5;
        }
        .BMI {
          color: #5087ec;
          border: 1px solid #e9eef9;
          cursor: pointer;
        }
        .BMI.selected {
          background-color: #e9eef9;
          color: #5087ec;
          border: 1px solid #e9eef9;
        }
      }
    }
    .myChart {
      height: calc(100% - 28px);
    }
    .myTable {
      height: calc(100% - 28px);
      padding: 0 10px;
      .table-title {
        height: 22px;
        color: #101010;
        font-size: 14px;
        text-align: left;
        font-family: SourceHanSansSC-regular;
        .table-title-item {
          display: inline-block;
          width: 45%;
          color: rgba(136, 137, 142, 100);
          font-size: 12px;
          font-family: SourceHanSansSC-regular;
        }
        .table-title-item-title {
          color: rgba(16, 16, 16, 100);
          font-size: 14px;
          font-weight: bold;
        }
      }
      .table-cont {
        height: calc(100% - 32px);
        margin-top: 10px;
        .el-table {
          .el-table__header-wrapper {
            border-top: 1px solid #cccccc59;
          }
          thead {
            td,
            th {
              background-color: #fafbff !important;
            }
            .el-table__cell {
              .cell {
                color: #919191 !important;
              }
            }
          }
          .el-table__cell {
            padding: 5px 0;
            .cell {
              min-height: 30px;
              line-height: 30px;
              padding-left: 5px;
              padding-right: 5px;
              color: #333;
            }
          }
        }
      }
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #5e84d7;
      background-color: #fff;
      border-color: #dcdfe6;
      box-shadow: -1px 0 0 0 #dcdfe6;
    }
    .el-radio-button__inner {
      padding: 2px 5px;
    }
  }
  .emptyCom {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    .title {
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      .chronics {
        height: 20px;
        line-height: 20px;
        padding: 2px 6px;
        text-align: left;
        font-family: SourceHanSansSC-medium;
        border-radius: 2px;
        font-size: 16px;
        color: #446bbd;
        font-weight: bold;
        border: 1px solid transparent;
      }
    }
    .emptyBox {
      height: calc(100% - 26px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .emptyText {
        color: #88898e;
        font-size: 14px;
        font-family: SourceHanSansSC-regular;
      }
    }
  }
}
</style>