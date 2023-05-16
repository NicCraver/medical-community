<!--
 * @Author: Nic
 * @Date: 2023-04-05 17:46:38
 * @LastEditTime: 2023-04-11 16:59:10
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-chronic-disease/src/views/PatientCenter/BasicArchives/table.vue
-->
<template>
  <div class="TimeLine">
    <el-table
      :data="tableData"
      header-row-class-name="table_header"
      :span-method="arraySpanMethod"
      style="width: 100%"
    >
      <el-table-column fixed="left">
        <template slot="header" slot-scope="scope">
          <div class="date-type" style="" @click="changeDateType">
            {{ dateType }}
          </div>
        </template>
        <template slot-scope="scope">
          {{ scope.row.taskName }}
        </template>
      </el-table-column>
      <!-- v-if="dateType === 'day'" -->
      <template>
        <el-table-column
          class-name="column-item"
          align="left"
          header-align="center"
          v-for="(item, dindex) in ganttTitleDate"
          :resizable="false"
          :key="dindex"
          width="75"
        >
          <template slot="header" slot-scope="scope">
            <div
              class="meter-header"
              :class="{
                'meter-header-hover':
                  (dateType === '每周' && hoverFirstWeekDate === item.date) ||
                  (dateType === '每月' && hoverFirstMonthDate === item.date),
                'meter-header-hover2':
                  (dateType === '每周' && hoverIndex === item.weekIndex && hoverFirstWeekDate !== item.date) ||
                  (dateType === '每月' && hoverIndex === item.monthIndex && hoverFirstMonthDate !== item.date),
                'meter-header-hover2-last':
                  (dateType === '每周' && hoverIndex === item.weekIndex && hoverLastWeekDate === item.date) ||
                  (dateType === '每月' && hoverIndex === item.monthIndex && hoverLastMonthDate === item.date),
              }"
              @mouseenter="handleMouseEnter(item)"
              @mouseleave="handleMouseleave()"
            >
              <div
                class="meter-header-box"
                v-if="
                  (dateType === '每周' && hoverFirstWeekDate === item.date) ||
                  (dateType === '每月' && hoverFirstMonthDate === item.date)
                "
              >
                {{ hoverText }}
              </div>
              <div
                class="meter-header-box2"
                :class="{
                  'meter-header-box2-hover':
                    (dateType === '每周' && hoverIndex === item.weekIndex) ||
                    (dateType === '每月' && hoverIndex === item.monthIndex),
                }"
              >
                {{ dateType === '每天' ? `第${item.day}天` : dateType === '每周' ? item.dayOfWeek : `${item.month}` }}
              </div>
            </div>
          </template>
          <template v-slot="scope">
            <div v-if="scope.row.rowType === '1' && dindex === scope.row.mergeColumns - 1" style="display: flex">
              <div
                style="
                  border-radius: 100px;
                  background-color: rgba(29, 197, 196, 1);
                  color: rgba(255, 255, 255, 1);
                  font-size: 12px;
                  width: 60px;
                  text-align: center;
                  margin: 0 10px;
                "
              >
                家庭血压
              </div>
              <div>详细信息</div>
            </div>
            <div v-if="scope.row.rowType === '2'">
              <!-- {{ scope.$index }}-{{ dindex }} -->
              <div v-for="item in scope.row.timeLine">
                <div v-if="item.x === dindex">
                  <div v-if="item.lineType === 'start'" class="item-on start" @click="test(scope.row, item)">
                    <div class="item-l"></div>
                    <div class="item-c"></div>
                    <div class="item-r full"></div>
                  </div>
                  <div v-else-if="item.lineType === 'end'" class="item-on end" @click="test(scope.row, item)">
                    <div class="item-l full"></div>
                    <div class="item-c"></div>
                    <div class="item-r"></div>
                  </div>
                  <div v-else-if="item.lineType === 'middle'" class="item-on middle" @click="test(scope.row, item)">
                    <div class="item-l full"></div>
                    <div class="item-c"></div>
                    <div class="item-r full"></div>
                  </div>
                  <div v-else-if="item.lineType === 'full'" class="item-on full" @click="test(scope.row, item)">
                    <div class="item-l full"></div>
                    <div class="item-r full"></div>
                  </div>
                  <div v-else-if="item.lineType === 'single'" class="item-on single" @click="test(scope.row, item)">
                    <div class="item-c"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import { isEmpty } from '@/utils'
import dayjs from 'dayjs'
const taskTypeMap = {
  // 每天
  everyDay: '1',
  // 断点
  breakpoint: '2',
  // 不是每天
  notEveryDay: '3',
  // 断断续续
  intermittent: '4',
}
const dateTypeMap = {
  // 每天
  everyDay: '1',
  // 每周
  everyWeek: '2',
  // 每月
  everyMonth: '3',
}
// lineType: 'start',
//     // end 结束
//     // middle 连接
//     // full 充满
export default {
  data() {
    return {
      hoverText: '',
      hoverIndex: null,
      hoverFirstWeekDate: null,
      hoverLastWeekDate: null,
      hoverFirstMonthDate: null,
      hoverLastMonthDate: null,
      dateTypeMap: dateTypeMap,
      dateType: '每周',
      ganttTitleDate: [],
      tableData: [
        {
          id: '111111',
          name: '王小虎1',
          mergeColumns: 1,
          type: '1',
        },
        {
          id: '',
          name: '王小虎2',
          type: '2',
          timeline: [
            {
              lineType: 'start',
              x: 0,
              full_date: '2021-03-31',
              ssss: {},
            },
            {
              lineType: 'full',
              x: 1,
              full_date: '2021-04-01',
              ssss: {},
            },
            {
              lineType: 'middle',
              x: 2,
              full_date: '2021-04-02',
              ssss: {},
            },
            {
              lineType: 'full',
              x: 3,
              full_date: '2021-04-03',
              ssss: {},
            },
            {
              lineType: 'end',
              x: 4,
              full_date: '2021-04-04',
              ssss: {},
            },
          ],
          lineId: '1',
        },
        {
          id: '',
          name: '王小虎3',
          mergeColumns: 3,
          type: '1',
        },
        {
          id: '',
          name: '王小虎4',
          type: '2',
          lineType: 'full',
          timeline: [
            {
              lineType: 'start',
              x: 2,
              ssss: {},
            },
            {
              lineType: 'full',
              x: 3,
              ssss: {},
            },
            {
              lineType: 'middle',
              x: 4,
              ssss: {},
            },
            {
              lineType: 'full',
              x: 5,
              ssss: {},
            },
            {
              lineType: 'end',
              x: 15,
              ssss: {},
            },
          ],
        },
        {
          id: '22222',
          name: '王小虎4',
          mergeColumns: 3,
          type: '1',
        },
        {
          id: '',
          name: '王小虎4',
          type: '2',
          timeline: [
            {
              lineType: 'start',
              x: 2,
              ssss: {},
            },
            {
              lineType: 'full',
              x: 3,
              ssss: {},
            },
            {
              lineType: 'middle',
              x: 4,
              ssss: {},
            },
            {
              lineType: 'full',
              x: 5,
              ssss: {},
            },
            {
              lineType: 'end',
              x: 6,
              ssss: {},
            },
          ],
        },
        {
          id: '',
          name: '王小虎4',
          mergeColumns: 3,
          type: '1',
        },
        {
          id: '',
          name: '王小虎4',
          type: '2',
          timeline: [
            {
              lineType: 'start',
              x: 2,
              ssss: {},
            },
            {
              lineType: 'full',
              x: 3,
              ssss: {},
            },
            {
              lineType: 'middle',
              x: 4,
              ssss: {},
            },
            {
              lineType: 'full',
              x: 5,
              ssss: {},
            },
            {
              lineType: 'end',
              x: 6,
              ssss: {},
            },
          ],
        },
      ],
    }
  },
  mounted() {
    this.tableData = []
    this.tableData = this.initData()
    console.log(` this.tableData`, JSON.parse(JSON.stringify(this.tableData)))
  },
  methods: {
    // 鼠标移入
    handleMouseEnter(item) {
      if (this.dateType === '每天') {
        return
      }
      console.log('鼠标移入了元素', JSON.parse(JSON.stringify(item)))
      // 每天 每周 每月
      if (this.dateType === '每周') {
        // 判断weekIndex是不是最后一周
        if (item.weekIndex === this.ganttTitleDate[this.ganttTitleDate.length - 1].weekIndex) {
          this.hoverText = `最后一周`
        } else {
          this.hoverText = `第${item.weekIndex}周`
        }
        this.hoverIndex = item.weekIndex
        this.hoverFirstWeekDate = item.hoverFirstWeekDate
        this.hoverLastWeekDate = item.hoverLastWeekDate
      } else if (this.dateType === '每月') {
        // 判断monthIndex是不是最后一月
        if (item.monthIndex === this.ganttTitleDate[this.ganttTitleDate.length - 1].monthIndex) {
          this.hoverText = `最后一月`
        } else {
          this.hoverText = `第${item.monthIndex}月`
        }
        this.hoverIndex = item.monthIndex
        this.hoverFirstMonthDate = item.hoverFirstMonthDate
        this.hoverLastMonthDate = item.hoverLastMonthDate
      }
    },
    // 鼠标移出
    handleMouseleave() {
      this.hoverIndex = null
      this.hoverFirstWeekDate = null
      this.hoverLastWeekDate = null
      this.hoverFirstMonthDate = null
      this.hoverLastMonthDate = null
    },
    // 改变changeDateType
    changeDateType() {
      // 每天 每周 每月
      if (this.dateType === '每天') {
        this.dateType = '每周'
      } else if (this.dateType === '每周') {
        this.dateType = '每月'
      } else if (this.dateType === '每月') {
        this.dateType = '每天'
      }
    },
    // 初始化数据
    initData() {
      let result = []
      const dateList = this.dateRange('2023-04-01', '2023-06-30')
      // 列的数组
      this.ganttTitleDate = dateList
      // 模拟接口数据
      let mockData = [
        {
          taskName: '任务一',
          taskDate: '2023-04-01',
          taskDetails: {
            name: '家庭血压',
            taskInfo: {},
          },
          taskType: '1',
          timeLine: [
            {
              // lineType: 'start',
              taskDate: '2023-04-01',
              timeLineDetails: {},
            },
            {
              // lineType: 'middle',
              taskDate: '2023-04-02',
              timeLineDetails: {},
            },
            {
              // lineType: 'middle',
              taskDate: '2023-04-03',
              timeLineDetails: {},
            },
            {
              // lineType: 'middle',
              taskDate: '2023-04-04',
              timeLineDetails: {},
            },
            {
              // lineType: 'end',
              taskDate: '2023-04-05',
              timeLineDetails: {},
            },
            {
              // lineType: 'end',
              taskDate: '2023-04-06',
              timeLineDetails: {},
            },
            {
              // lineType: 'end',
              taskDate: '2023-04-07',
              timeLineDetails: {},
            },
            {
              // lineType: 'end',
              taskDate: '2023-04-08',
              timeLineDetails: {},
            },
          ],
        },
        {
          taskName: '任务一',
          taskDate: '2023-04-03',
          taskDetails: {
            name: '家庭血压',
            taskInfo: {},
          },
          taskType: '2',
          timeLine: [
            {
              // lineType: 'start',
              taskDate: '2023-04-03',
              timeLineDetails: {},
            },
            {
              // lineType: 'middle',
              taskDate: '2023-04-08',
              timeLineDetails: {},
            },
            {
              // lineType: 'middle',
              taskDate: '2023-04-13',
              timeLineDetails: {},
            },
            {
              // lineType: 'middle',
              taskDate: '2023-04-18',
              timeLineDetails: {},
            },
            {
              // lineType: 'middle',
              taskDate: '2023-04-23',
              timeLineDetails: {},
            },
            {
              // lineType: 'middle',
              taskDate: '2023-04-28',
              timeLineDetails: {},
            },
            {
              // lineType: 'middle',
              taskDate: '2023-05-03',
              timeLineDetails: {},
            },
            {
              // lineType: 'end',
              taskDate: '2023-05-08',
              timeLineDetails: {},
            },
          ],
        },
        {
          taskName: '任务二',
          taskDate: '2023-04-03',
          taskDetails: {
            name: '家庭血压',
            taskInfo: {},
          },
          taskType: '3',
          timeLine: [
            {
              taskDate: '2023-04-03',
              timeLineDetails: {},
            },
            {
              taskDate: '2023-04-08',
              timeLineDetails: {},
            },
            {
              taskDate: '2023-04-13',
              timeLineDetails: {},
            },
            {
              taskDate: '2023-04-18',
              timeLineDetails: {},
            },
            {
              taskDate: '2023-04-23',
              timeLineDetails: {},
            },
            {
              taskDate: '2023-04-28',
              timeLineDetails: {},
            },
            {
              taskDate: '2023-05-03',
              timeLineDetails: {},
            },
            {
              taskDate: '2023-05-08',
              timeLineDetails: {},
            },
            {
              taskDate: '2023-05-12',
              timeLineDetails: {},
            },
          ],
        },
        {
          taskName: '任务二',
          taskDate: '2023-04-03',
          taskDetails: {
            name: '家庭血压',
            taskInfo: {},
          },
          taskType: '4',
          timeLine: [
            {
              lineType: 'start',
              taskDate: '2023-04-03',
              timeLineDetails: {},
            },
            {
              lineType: 'middle',
              taskDate: '2023-04-08',
              timeLineDetails: {},
            },
            {
              lineType: 'middle',
              taskDate: '2023-04-13',
              timeLineDetails: {},
            },
            {
              lineType: 'end',
              taskDate: '2023-04-18',
              timeLineDetails: {},
            },
            // 这中间是断的
            {
              lineType: 'start',
              taskDate: '2023-04-23',
              timeLineDetails: {},
            },
            { lineType: 'middle', taskDate: '2023-04-28', timeLineDetails: {} },
            { lineType: 'middle', taskDate: '2023-05-03', timeLineDetails: {} },
            { lineType: 'middle', taskDate: '2023-05-08', timeLineDetails: {} },
            { lineType: 'end', taskDate: '2023-05-12', timeLineDetails: {} },
          ],
        },
      ]
      mockData.forEach((item) => {
        console.log(`item`, item)
        let { taskName, taskDate, taskDetails, timeLine, taskType } = item

        // 向result中添加一任务数据
        addTask(taskName, taskDate, taskDetails)

        //   console.log(`dateList`,dateList)
        //   console.log(`timeLine`, timeLine)

        result.push({
          taskName,
          rowType: '2',
          timeLine: updateTimeLineItem(taskName, timeLine, taskType),
        })
      })


      function addTask(taskName, taskDate, taskDetails) {
        const x = dateList.findIndex((_) => _.date === taskDate) + 1
        result.push({
          taskName,
          mergeColumns: x,
          rowType: '1',
          taskDetails,
        })
      }
      function updateTimeLineItem(taskName, timeLine, taskType) {
        // 向timeLine 添加x
        timeLine.forEach((item) => {
          item.x = dateList.findIndex((_) => _.date === item.taskDate)
        })

        // everyDay - 判断任务类型如果是 每天 则设置对应的lineType
        if (taskType === taskTypeMap['everyDay']) {
          // 设置第一个元素的lineType
          timeLine[0].lineType = 'start'
          // 设置最后一个元素的lineType
          timeLine[timeLine.length - 1].lineType = 'end'
          // 设置中间元素的lineType
          timeLine.forEach((item, index) => {
            if (index !== 0 && index !== timeLine.length - 1) {
              item.lineType = 'full'
            }
          })
        }
        // breakpoint - 判断任务类型如果是 断点 则设置对应的lineType
        if (taskType === taskTypeMap['breakpoint']) {
          timeLine.forEach((item, index) => {
            item.lineType = 'single'
          })
        }

        // notEveryDay - 判断任务类型如果是 不是每天 则设置对应的lineType
        if (taskType === taskTypeMap['notEveryDay']) {
          // 设置第一个元素的lineType
          timeLine[0].lineType = 'start'
          // 设置最后一个元素的lineType
          timeLine[timeLine.length - 1].lineType = 'end'
          // 设置中间元素的lineType
          timeLine.forEach((item, index) => {
            if (index !== 0 && index !== timeLine.length - 1) {
              item.lineType = 'middle'
            }
          })
        }

        // 第一项的x for循环的起始值
        let firstX = timeLine[0].x
        // 最后一项的x for循环的结束值
        let lastX = timeLine[timeLine.length - 1].x + 1
        // 判断是否是单个点的任务
        let isLineTypeSingle = timeLine[0].lineType === 'single'

        let temp = []
        for (let i = firstX; i < lastX; i++) {
          // 找到timeLine中等于i的对象
          let el = timeLine.find((_) => _.x === i)
          let previousLineType = temp[temp.length - 1]?.lineType
          if (el) {
            temp.push(el)
          } else {
            if (!isLineTypeSingle && previousLineType !== 'end') {
              temp.push({
                lineType: 'full',
                x: i,
                timeLineDetails: {},
              })
            }
          }
        }

        // 返回结果
        return temp
      }

      // // 如果任务名相同，则保留第一个，后面的taskName赋 ''
      result.forEach((item, index) => {
        if (mockData[item.taskName]) {
          result[index].taskName = ''
        } else {
          mockData[item.taskName] = true
        }
      })

      return result
    },
    test(row, column) {
      console.log(`row`, row)
      console.log(`column`, column)
    },
    // 用于计算表格单元格的合并行列数
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let rowspan = 0
      let colspan = 0
      if (row.mergeColumns && columnIndex === row.mergeColumns) {
        rowspan = 1
        colspan = this.ganttTitleDate.length - row.mergeColumns + 1
      } else if (columnIndex < row.mergeColumns || !row.mergeColumns) {
        rowspan = 1
        colspan = 1
      } else {
        rowspan = 0
        colspan = 0
      }
      return [rowspan, colspan]
    },
    // 计算日期
    dateRange(startDate, endDate) {
      const result = [] // 存储结果的数组
      let tempWeekIndex = 1 // 当前所属周索引
      let tempMonthIndex = 1 // 当前所属月份索引
      let tempFirstWeekDate = startDate // 当前周的第一天日期
      let tempFirstMonthDate = startDate // 当前月的第一天日期

      // 根据传入的 startDate 和 endDate，计算出相差的天数
      const start = dayjs(startDate)
      const end = dayjs(endDate)
      const days = end.diff(start, 'day') + 1

      // 遍历每一天
      for (let i = 0; i < days; i++) {
        const date = start.add(i, 'day') // 当前日期
        const dayOfWeek = date.day() // 当前星期几
        const startOfWeek = start.startOf('week').add(1, 'day') // 当前周的第一天日期
        const diffWeeks = date.diff(startOfWeek, 'week') // 相对于当前周第一天，是第几周
        const weekIndex = diffWeeks + 1 // 当前所属周索引

        // 获取当天是第几号
        const month = `${date.date()}号`
        const monthIndexOfDay = date.date()

        // 获取当天是周期内的第几天
        const day = i

        // 计算当前是周期内的第几个月
        const monthIndex = date.month() - start.month() + 1

        if (tempWeekIndex === weekIndex) {
          // 如果当前日期和 tempFirstWeekDate 在同一周，不需要更新 tempFirstWeekDate
          tempFirstWeekDate = date
        }
        if (tempMonthIndex === monthIndexOfDay) {
          // 如果当前日期和 tempFirstMonthDate 在同一个月，不需要更新 tempFirstMonthDate
          tempFirstMonthDate = date
        }

        // 计算当前日期所属周的第一天和月的第一天的日期，并格式化为 YYYY-MM-DD 格式
        const hoverFirstWeekDate = tempFirstWeekDate.format('YYYY-MM-DD')
        const hoverFirstMonthDate = tempFirstMonthDate.format('YYYY-MM-DD')

        // 更新当前所属周索引
        tempWeekIndex = weekIndex + 1

        // 周中每一天对应的汉字
        const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

        // 将当前日期的相关信息添加到 result 数组
        result.push({
          month, // 当前日期的月份
          date: date.format('YYYY-MM-DD'), // 当前日期
          dayOfWeek: weeks[dayOfWeek], // 当前星期几，以汉字形式表示
          hoverFirstWeekDate, // 当前日期所在周的第一天日期
          hoverFirstMonthDate, // 当前日期所在月份的第一天日期
          weekIndex, // 当前日期所属周的索引
          monthIndex, // 当前日期所属月份的索引
          day, // 在整个周期中是第几天
        })
      }

      // 提取所有的 weekIndex 和 monthIndex
      const weekIndexArr = result.map((el) => el.weekIndex)
      const monthIndexArr = result.map((el) => el.monthIndex)

      // 初始化最近周和月的日期
      let lastWeekDate = null
      let lastMonthDate = null

      // 遍历 result
      result.forEach((el, index) => {
        // 如果当前元素是该 weekIndex 下的最后一个元素，则将该元素的日期赋给 lastWeekDate
        if (weekIndexArr.lastIndexOf(el.weekIndex) === index) {
          lastWeekDate = el.date
        }
        // 如果当前元素是该 monthIndex 下的最后一个元素，则将该元素的日期赋给 lastMonthDate
        if (monthIndexArr.lastIndexOf(el.monthIndex) === index) {
          lastMonthDate = el.date
        }

        // 将最近周和月的日期分别添加到每个元素的 hoverLastWeekDate 和 hoverLastMonthDate 属性中
        el.hoverLastWeekDate = lastWeekDate
        el.hoverLastMonthDate = lastMonthDate
      })
      console.log(`result===`, result)
      return result
    },
  },
}
</script>

<style lang="scss" scoped>
.TimeLine {
  ::v-deep .el-table td {
    border-bottom: none;
  }
  ::v-deep th {
    background-color: #fff !important;
  }
  ::v-deep .el-table th.is-leaf {
    border-bottom: none;
  }
  ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
  }
  ::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: #157283;
    color: #fff;
  }
  ::v-deep .el-table__body .el-table__row.hover-row td {
    background-color: #fff !important;
  }
  ::v-deep .table_header {
    color: #606266;
    background-color: #fff;
  }
  ::v-deep.el-table .cell {
    padding: 0;
  }
  ::v-deep .el-table td,
  .el-table th {
    padding: 6px 0;
  }

  .column-item {
    position: relative;
    transition: all 0.3s;
    .item-on {
      display: flex;
      align-items: center;
    }
    .item-l {
      flex: 1;
      height: 4px;
      margin-right: -1px;
    }
    .item-r {
      height: 4px;
      flex: 1;
      margin-left: -1px;
    }
    .item-c {
      border-radius: 50%;
      width: 10px;
      height: 10px;
      background-color: rgba(255, 255, 255, 1);
      text-align: center;
      border: 3px solid #1dc5c4;
    }
    .full {
      background-color: #1dc5c4;
    }
    .single {
      justify-content: center;
    }
  }
  .date-type {
    height: 30px;
    line-height: 30px;
    width: 100px;
    background-color: #fff;
    z-index: 20 !important;
  }

  .meter-header {
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    position: relative;
    text-align: center;
    .meter-header-box {
      position: absolute;
      left: 5px;
      z-index: 1;
      color: #436abd;
      font-weight: bold;
    }
    .meter-header-box2 {
      position: absolute;
      // 左右居中
      left: 50%;
      transform: translateX(-50%);
    }
    .meter-header-box2-hover {
      color: #b8b9bc;
    }
  }
  .meter-header-hover {
    border-radius: 4px 0 0 4px;
    // 渐变背景从左到右 #90B4F3 #C5D7F6 #DFE6F7 #F9F9F9 #F9F9F9 从百分之10开始逐渐变为#F9F9F9
    background: linear-gradient(to right, #90b4f3 10%, #c5d7f6 20%, #dfe6f7 30%, #f9f9f9 40%, #f9f9f9 100%);
  }
  .meter-header-hover2 {
    color: #b8b9bc;
    background: #f9f9f9;
    border-radius: 0;
  }
  .meter-header-hover2-last {
    border-radius: 0 4px 4px 0;
  }
}
</style>
