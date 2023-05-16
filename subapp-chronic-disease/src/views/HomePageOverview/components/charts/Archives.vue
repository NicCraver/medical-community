<template>
  <div class="Archives">
    <header>
      <div class="head-action">
        <div>档案性别构成</div>
        <div class="actions">
          <el-select v-model="diseaseType" @change="dateChange">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.typeDesc"
              :value="item.typeCode"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="ChartRefA" v-if="loadingA" v-loading="loadingA"></div>
      <div v-else>
        <div ref="ChartRefA" class="ChartRefA"></div>
      </div>
    </header>
    <footer>
      <div class="head-action">
        <div>档案年龄分布</div>
      </div>
      <div class="ChartRefB" v-if="loadingB" v-loading="loadingB"></div>
      <div v-else>
        <div ref="ChartRefB" class="ChartRefB"></div>
      </div>
    </footer>
  </div>
</template>

<script>
import { getHomePageData, onQueryAllDiseaseTypes } from '@/api/modules/Home'
import echarts from '@/plugins/echarts'
import { fail } from 'assert'
export default {
  data() {
    return {
      options: [],
      loadingA: false,
      loadingB: false,
      myChartA: null,
      myChartB: null,
      diseaseType: '',
      radioGroup: '1',
    }
  },
  mounted() {
    this.onQueryAllDiseaseTypes()
    this.initA()
    this.initB()
    window.addEventListener('resize', this.fn)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.fn)
  },
  methods: {
    fn() {
      console.log(`档案  监听窗口变化`)
      if (this.myChartA) {
        this.myChartA.resize()
        this.myChartB.resize()
      }
    },
    async onQueryAllDiseaseTypes() {
      try {
        const res = await onQueryAllDiseaseTypes()
        this.options = res.result
        this.options.unshift({
          typeCode: '',
          typeDesc: '全部',
        })
      } catch (error) {
        console.log(`error`, error)
      }
    },
    async initA() {
      this.loadingA = true
      try {
        const res = await getHomePageData({
          type: 'G',
          diseaseType: this.diseaseType,
        })
        console.log('GGGGGGGGG')
        // const { data, xAxis } = res.result;
        const mockData = [
          {
            value: 40,
            name: '女',
            percentage: 45,
            itemStyle: {
              color: '#EC6166',
              borderColor: '#EC6166',
            },
          },
          {
            value: 60,
            name: '男',
            percentage: 55,
            itemStyle: {
              color: '#5D76D9',
              borderColor: '#5D76D9',
            },
          },
          {
            value: 60,
            name: '未知',
            percentage: 55,
            itemStyle: {
              color: '#F1CB6C',
              borderColor: '#F1CB6C',
            },
          },
        ]
        const dataSource = [
          {
            ...res.result[1],
            itemStyle: {
              color: '#EC6166',
              borderColor: '#EC6166',
            },
          },
          {
            ...res.result[0],
            itemStyle: {
              color: '#5D76D9',
              borderColor: '#5D76D9',
            },
          },
        ]
        if (res.result.length === 3) {
          if (res.result[2].value !== 0) {
            dataSource.unshift({
              ...res.result[2],
              itemStyle: {
                color: '#F1CB6C',
                borderColor: '#F1CB6C',
              },
            })
          }
        }

        setTimeout(() => {
          this.loadingA = false
          this.$nextTick(() => {
            // moock
            // this.createEchartsA(mockData);
            this.createEchartsA(dataSource)
          })
        }, 300)
      } catch (error) {
        this.loadingA = false
        console.log(`error`, error)
      }
    },
    async initB() {
      this.loadingB = true
      try {
        const res = await getHomePageData({
          type: 'H',
          diseaseType: this.diseaseType,
        })
        console.log('HHHHHHHHH')
        // const { data, xAxis } = res.result;

        setTimeout(() => {
          this.loadingB = false
          this.$nextTick(() => {
            this.createEchartsB(res.result)
          })
        }, 300)
      } catch (error) {
        this.loadingB = false
        console.log(`error`, error)
      }
    },
    dateChange(e) {
      console.log(`dateChange`, e)
      this.initA()
      this.initB()
    },
    createEchartsA(dataSource) {
      this.myChartA = echarts.init(this.$refs.ChartRefA)
      let option = {
        animation: false,
        silent: true,
        tooltip: {
          show: false,
        },
        legend: {},
        grid: {
          left: '0%',
          right: '30%',
          bottom: -10,
          top: '5%',
          containLabel: true,
        },
        xAxis: {
          show: false,
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          show: false,
          type: 'category',
        },
        series: [
          {
            stack: 'total',
            barWidth: 35,
            label: {
              offset: [10, 0],
              show: true, //开启显示
              position: 'insideLeft', //在上方显示
              //数值样式
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,

              formatter: function (params) {
                //核心部分 formatter 可以为字符串也可以是回调
                if (params.value) {
                  //如果当前值存在则拼接
                  return params.value + '人'
                } else {
                  //否则返回个空
                  return ''
                }
              },
            },
            type: 'bar',
            data: dataSource,
          },
          {
            stack: 'total',
            label: {
              show: true, //开启显示
              position: 'right', //在上方显示
              offset: [20, 0],
              //数值样式
              color: '#303133',
              fontSize: 16,
              fontWeight: 600,
              formatter: function (params) {
                //核心部分 formatter 可以为字符串也可以是回调
                if (params.value) {
                  //如果当前值存在则拼接
                  return params.name + params.data.percentage
                } else {
                  //否则返回个空
                  return ''
                }
              },
            },
            type: 'bar',
            data: dataSource,
          },
        ],
      }
      this.myChartA.dispatchAction({
        type: 'downplay',
      })

      this.myChartA.setOption(option)
    },
    createEchartsB(dataSource) {
      this.myChartB = echarts.init(this.$refs.ChartRefB)
      let option = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
        },
        series: [
          {
            type: 'pie',
            radius: [30, 80],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: dataSource,
          },
        ],
      }
      this.myChartB.setOption(option)
    },
  },
}
</script>

<style lang="scss" scoped>
.Archives {
  .ChartRefA {
    height: 200px;
  }
  .ChartRefB {
    min-height: 180px;
    height: 80px;
  }
  .head-action {
    display: flex;
    justify-content: space-between;
    color: rgba(16, 16, 16, 100);
    align-items: center;
    font-size: 16px;
    .el-select {
      margin-left: 20px;
      width: 120px;
    }
    .actions {
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
}
</style>
