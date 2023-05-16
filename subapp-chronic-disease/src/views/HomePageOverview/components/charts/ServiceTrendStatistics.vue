<template>
  <div class="ServiceTrendStatistics">
    <div class="head-action">
      <div class="actions">
        <el-select v-model="dateType" @change="dateChange">
          <el-option label="本周" value="week"> </el-option>
          <el-option label="本月" value="month"> </el-option>
          <el-option label="本年" value="year"> </el-option>
        </el-select>
      </div>
    </div>
    <div class="ChartRef" v-if="loading" v-loading="loading"></div>
    <div v-else>
      <div ref="ChartRef" class="ChartRef"></div>
    </div>
  </div>
</template>

<script>
import HollowCircle from '@/assets/hollow-circle.png'
import echarts from '@/plugins/echarts'
import { getHomePageData } from '@/api/modules/Home'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      activeName: 'PendingReview',
      dateType: 'week',
      myChart: null,
      loading: false,
    }
  },
  mounted() {
    this.init()
    window.addEventListener('resize', this.fn)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.fn)
  },
  methods: {
    handleClick() {},
    fn() {
      console.log(`服务趋势统计 监听窗口变化`)
      if (this.myChart) {
        this.myChart.resize()
      }
    },
    dateChange(e) {
      this.loading = true
      this.init()
    },
    async init() {
      try {
        const res = await getHomePageData({
          type: 'B',
          dateType: this.dateType,
        })
        const { data, xAxis } = res.result
        const mockXdata = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        const mockYdata = [820, 932, 901, 934, 1290, 1330, 1320]
        this.loading = false
        // mock
        // this.createEcharts(mockXdata, mockYdata);
        this.$nextTick(() => {
          this.createEcharts(xAxis, data)
        })
      } catch (error) {
        this.loading = false
        console.log(`error`, error)
      }
    },
    createEcharts(XData, YData) {
      console.log(XData, YData)
      this.myChart = echarts.init(this.$refs.ChartRef);
      let option = {
        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '5%',
          containLabel: true,
        },
        tooltip: {
          formatter: (params) => {       
            if (this.dateType === "week") {
              return (
                params[0].axisValue +
                "<br/>" +
                params[0].marker +
                params[0].value +
                "次"
              );
            }
            if (this.dateType === 'month') {
              let y = dayjs(dayjs()).format('YYYY')
              let m = dayjs(dayjs()).format('MM')
              return (
                y +
                '年' +
                m +
                '月' +
                params[0].axisValue +
                '日' +
                '<br/>' +
                params[0].marker +
                params[0].value +
                '次'
              )
            }
            if (this.dateType === 'year') {
              let y = dayjs(dayjs()).format('YYYY')
              return (
                y +
                '年' +
                (params[0].dataIndex + 1) +
                '月' +
                '<br/>' +
                params[0].marker +
                params[0].value +
                '次'
              )
            }
          },

          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        xAxis: [
          {
            offset: 5.5,
            type: 'category',
            boundaryGap: false,
            data: XData,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
        ],
        yAxis: {
          offset: 5.5,
          minInterval : 1,
          type: "value"
        },
        series: [
          {         
            data: YData,
            type: 'line',
            smooth: true,
            symbolSize: 12,         
            symbol: `image://${HollowCircle}`,
            lineStyle: {
              width: 4,
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#6B71E1',
                },
                {
                  offset: 1,
                  color: '#EEEFFB',
                },
              ]),
            },
          },
        ],
      }
      this.myChart.setOption(option)
    },
  },
}
</script>

<style lang="scss" scoped>
.ServiceTrendStatistics {
  ::v-deep.el-tabs__item {
    font-size: 16px;
    color: #bbbbbb;
  }
  ::v-deep.el-tabs__item.is-active {
    color: #303133 !important;
  }
  ::v-deep.el-tabs__nav-wrap::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background-color: #fff !important;
    z-index: 1;
  }
}
.ChartRef {
  width: 100%;
  // min-width: 500px;
  // max-width: 900px;
  height: 270px;
}
.head-action {
  position: relative;
  // display: flex;
  // justify-content: space-between;
  color: rgba(16, 16, 16, 100);
  // align-items: center;
  font-size: 16px;
  .el-select {
    margin-left: 20px;
    width: 120px;
  }
  .actions {
    position: absolute;
    top: -50px;
    right: 0;
    display: flex;
    align-items: center;
  }
  ::v-deep.el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #fff;
    background-color: #5d76d9;
    border-color: #5d76d9;
    box-shadow: -1px 0 0 0 #5d76d9;
  }
}
</style>
