<template>
  <el-dialog
    :visible.sync="frequencySettingDialogVisible"
    width="400px"
    class="universal-dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
    :show-close="false"
    :before-close="handleClose"
  >
    <template #title>
      <div class="dialog-head">频率设置</div>
    </template>
    <div class="dialog-body">
      <div class="head">
        <div class="tabs">
          <div class="tab" :class="selected === 'DAY' ? 'selected' : ''" @click="changeSelected('DAY')">每天</div>
          <div class="tab" :class="selected === 'WEEK' ? 'selected' : ''" @click="changeSelected('WEEK')">每周</div>
          <div class="tab" :class="selected === 'MONTH' ? 'selected' : ''" @click="changeSelected('MONTH')">每月</div>
        </div>
        <div class="main">
          <div v-if="selected === 'DAY'">
            <div class="selected">
              <div>每</div>
              <div class="combination-form">
                <el-select v-model="dayValue" placeholder="请选择">
                  <el-option v-for="item in dayOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <div class="unit">天</div>
              </div>
              <div class="combination-form">
                <el-select v-model="freqValue" placeholder="请选择">
                  <el-option v-for="item in freqOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <div class="unit">次</div>
              </div>
            </div>
            <div class="text">
              预估单个方案周期内至多可推送 <span class="text-item">{{ pushTimes }}</span> 次；
            </div>
          </div>
          <div v-if="selected === 'WEEK'">
            <div class="selected">
              <div>每</div>
              <div class="combination-form" style="width: 320px">
                <el-select v-model="weekValue" placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <div class="unit">周</div>
              </div>
            </div>
            <div class="week-tags">
              <div
                class="tag"
                :class="{ 'tag-selected': tag.selected }"
                v-for="tag in weekList"
                :key="tag.value"
                @click="toggleSelected(tag)"
              >
                {{ tag.label }}
              </div>
            </div>
            <div class="text">
              预估单个方案周期内至多可推送 <span class="text-item">{{ pushTimes }}</span> 次；
            </div>
          </div>
          <div v-if="selected === 'MONTH'">
            <div class="selected">
              <div>每</div>
              <div class="combination-form" style="width: 320px">
                <el-select v-model="monthsValue" placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in monthsOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <div class="unit">月</div>
              </div>
            </div>
            <div style="margin-top: 10px; padding-left: 20px">
              <span style="color: #f56c6c">*</span>
              <span style="color: #888888; font-size: 14px">选择日期：</span>
            </div>
            <div class="months-tags">
              <div
                class="tag"
                :class="{ 'tag-selected': tag.selected }"
                v-for="tag in monthsList"
                :key="tag.value"
                @click="toggleSelected(tag)"
              >
                <div :style="{ minWidth: tag.label === '最后一天' ? '80px' : '40px' }">{{ tag.label }}</div>
              </div>
            </div>
            <div class="text">
              预估单个方案周期内至多可推送 <span class="text-item">{{ pushTimes }}</span> 次；
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submitForm()">保存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import currency from 'currency.js'
export default {
  name: 'RuleDialog',
  props: {
    editData: {
      type: Object,
    },
    // 周期
    // cycle: {
    //   type: Number,
    //   default: 180,
    // },
    diagnosticConditions: {
      type: Array,
    },
    frequencySettingDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'frequencySettingDialogVisible',
    event: 'close',
  },
  data() {
    return {
      // 选中的选项卡
      selected: 'DAY',
      // 每天
      dayValue: '1',
      // 每次
      freqValue: '1',
      // 每周
      weekValue: '1',
      // 每天选项
      dayOptions: [
        {
          label: '1',
          value: '1',
        },
        {
          label: '2',
          value: '2',
        },
        {
          label: '3',
          value: '3',
        },
        {
          label: '4',
          value: '4',
        },
        {
          label: '5',
          value: '5',
        },
        {
          label: '6',
          value: '6',
        },
        {
          label: '7',
          value: '7',
        },
      ],
      // 每次选项
      freqOptions: [
        {
          label: '1',
          value: '1',
        },
        {
          label: '2',
          value: '2',
        },
        {
          label: '3',
          value: '3',
        },
        {
          label: '4',
          value: '4',
        },
        {
          label: '5',
          value: '5',
        },
      ],
      // 每周选项
      weekOptions: [
        {
          label: '1',
          value: '1',
        },
        {
          label: '2',
          value: '2',
        },
        {
          label: '3',
          value: '3',
        },
        {
          label: '4',
          value: '4',
        },
      ],
      // 每周列表
      weekList: [
        {
          label: '周一',
          value: 1,
          selected: false,
        },
        {
          label: '周二',
          value: 2,
          selected: false,
        },
        {
          label: '周三',
          value: 3,
          selected: false,
        },
        {
          label: '周四',
          value: 4,
          selected: false,
        },
        {
          label: '周五',
          value: 5,
          selected: false,
        },
        {
          label: '周六',
          value: 6,
          selected: false,
        },
        {
          label: '周日',
          value: 7,
          selected: false,
        },
      ],
      // 每月
      monthsValue: '1',
      // 每月选项
      monthsOptions: [
        {
          label: '1',
          value: '1',
        },
        {
          label: '2',
          value: '2',
        },
        {
          label: '3',
          value: '3',
        },
        {
          label: '4',
          value: '4',
        },
        {
          label: '5',
          value: '5',
        },
        {
          label: '6',
          value: '6',
        },
      ],
      // 每月列表
      monthsList: [
        {
          label: '1',
          value: 1,
          selected: false,
        },
        // 生成 1-31
        ...Array.from({ length: 30 }, (item, index) => {
          return {
            label: `${index + 2}`,
            value: index + 2,
            selected: false,
          }
        }),
        {
          label: '最后一天',
          value: 32,
          selected: false,
        },
      ],
      cycle: null,
    }
  },
  mounted() {
    this.cycle = +window.localStorage.getItem('cycleNum')
    // 判断 this.editData 对象是否为空
    if (Object.keys(this.editData).length) {
      this.initData()
    }
  },
  computed: {
    // 周期内推送多少次
    pushTimes() {
      let text = ''
      if (this.selected === 'DAY') {
        text = Math.floor(currency(this.cycle).divide(this.dayValue).multiply(this.freqValue).value)
      }
      if (this.selected === 'WEEK') {     
        // 次数
        const times = this.weekList.filter((item) => item.selected).length
        text = Math.floor(currency(this.cycle).divide(this.weekValue).divide(7).multiply(times).value)
      }
      if (this.selected === 'MONTH') {
        // 次数
        const times = this.monthsList.filter((item) => item.selected).length
        text = Math.floor(currency(this.cycle).divide(30).divide(this.monthsValue).multiply(times).value)
      }
      return text
    },
  },
  methods: {
    // 初始化数据
    initData() {
      console.log(`this.editData`, JSON.parse(JSON.stringify(this.editData)))
      console.log(`this.editData.pushCycle`, this.editData.pushCycle)
      let temp = []
      if (typeof this.editData.pushCycle === 'string') {
        temp = JSON.parse(this.editData.pushCycle)
      } else {
        temp = this.editData.pushCycle
      }
      this.selected = this.editData.pushUnit
      if (this.selected === 'DAY') {
        this.dayValue = this.editData.executeCount
        this.freqValue = temp
      }
      if (this.selected === 'WEEK') {
        this.weekValue = this.editData.pushCount
        temp.forEach((el) => {
          this.weekList.forEach((item) => {
            if (el === item.value) {
              item.selected = true
            }
          })
        })
      }
      if (this.selected === 'MONTH') {
        this.monthsValue = this.editData.pushCount
        temp.forEach((el) => {
          this.monthsList.forEach((item) => {
            if (el === item.value) {
              item.selected = true
            }
          })
        })
      }
    },
    // 选中
    toggleSelected(item) {
      item.selected = !item.selected
    },
    // 切换选项卡
    changeSelected(index) {
      this.selected = index
    },
    // 关闭
    handleClose() {
      this.$emit('close', false)
    },
    // 提交
    submitForm() {
      let text = ''
      // 判断是否有选中
      if (this.selected === 'DAY') {
        // console.log(`this.dayValue`, this.dayValue)
        // console.log(`this.freqValue`, this.freqValue)
        text = `每${this.dayValue === '1' ? '' : this.dayValue}天${this.freqValue}次`
      }
      if (this.selected === 'WEEK') {
        // weekList中选中的项
        let selectedWeekList = this.weekList.filter((item) => item.selected).map((item) => item.label)
        if (selectedWeekList.length === 0) {
          this.$message.warning('请选择周几推送')
          return
        }
        // console.log(`this.weekValue`, this.weekValue)
        // console.log(`selectedWeekList`, selectedWeekList)
        text = `每${this.weekValue - 1 === 0 ? '' : '隔' + (this.weekValue - 1).toString()}周${selectedWeekList.join(
          '、',
        )}`
      }
      if (this.selected === 'MONTH') {
        // monthsList中选中的项
        let selectedMonthsList = this.monthsList
          .filter((item) => item.selected)
          .map((item) => (item.label === '最后一天' ? item.label : item.label + '号'))
        if (selectedMonthsList.length === 0) {
          this.$message.warning('请选择几号推送')
          return
        }
        // console.log(`this.monthsValue`, this.monthsValue)
        // console.log(`selectedMonthsList`, selectedMonthsList)
        text = `每${
          this.monthsValue - 1 === 0 ? '' : '隔' + (this.monthsValue - 1).toString() + '个'
        }月${selectedMonthsList.join('、')}`
      }
      // console.log(`text`, text)
      // console.log(`this.selected`, this.selected)
      const data = {
        // 单位:DAY,WEEK,MONTH
        pushUnit: this.selected,
        // // 每隔的周数，每隔的月数
        // pushCount: '',
        // // 频率,例如：没几天，每一周周几，每一个月第几天
        // pushCycle: '',
        // // 用户需要执行次数
        // executeCount: '',
        clockingTimes: 0,
        text,
      }
      if (this.selected === 'DAY') {
        data.executeCount = this.dayValue
        data.pushCycle = this.freqValue
      }
      if (this.selected === 'WEEK') {
        data.pushCount = this.weekValue
        data.pushCycle = this.weekList.filter((item) => item.selected).map((item) => item.value)
      }
      if (this.selected === 'MONTH') {
        data.pushCount = this.monthsValue
        data.pushCycle = this.monthsList.filter((item) => item.selected).map((item) => item.value)
      }
      // console.log(`data`, data)
      this.$emit('frequencySettingOnSubmit', data)
    },
  },
}
</script>

<style lang="scss" scoped>
.universal-dialog {
  ::v-deep .el-dialog__footer {
    text-align: center;
    border-top: none !important;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 10px 15px;
    color: rgba(48, 49, 51, 1);
    font-size: 16px;
    padding: 10px 15px 10px 25px !important;
  }
  ::v-deep .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    // padding: 10px 15px;
  }
  ::v-deep .el-dialog__body {
    padding: 20px 20px 20px 0px;
  }

  .dialog-head {
    position: relative;
    font-weight: 700;

    &::before {
      content: '';
      position: absolute;
      left: -15px;
      width: 3px;
      height: 19px;
      margin-top: 4px;
      background-color: #134796;
    }
  }
  .dialog-body {
    padding: 0 0 0 20px;
    .head {
      .tabs {
        margin: 0 auto;
        width: 210px;
        height: 35px;
        border-radius: 2px;
        background-color: rgba(68, 106, 189, 0.05);
        font-size: 14px;
        border: 1px solid rgba(211, 220, 236, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        .tab {
          width: 100px;
          height: 33px;
          line-height: 33px;
          text-align: center;
          border-radius: 2px;
          cursor: pointer;
          &.selected {
            background-color: rgba(68, 104, 189, 1);
            color: rgba(255, 255, 255, 1);
          }
        }
      }
      .main {
        margin-top: 20px;
        .selected {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .combination-form {
          width: 165px;
          border: 1px solid rgba(217, 217, 217, 1);
          display: flex;
          align-items: center;
          border-radius: 3px;
          margin-left: 10px;
          ::v-deep .el-input__inner {
            border: 0 !important;
            height: 30px;
          }
          .unit {
            background: #f7f7f7;
            height: 100% !important;
            display: flex;
            width: 42px;
            align-items: center;
            justify-content: center;
            border-top-right-radius: 3px;
            border-bottom-right-radius: 3px;
            padding: 3px 0;
          }
          .combination-form:hover {
            border-color: #446bbd;
          }
        }
        .week-tags {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 10px;
          .tag {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            text-align: center;
            background-color: #ffffff;
            color: rgba(16, 16, 16, 1);
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            margin-right: 6px;
            border: 1px solid rgba(187, 187, 187, 1);
            margin-bottom: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
          }
          .tag-selected {
            background-color: #436abd;
            border: 1px solid #436abd;
            color: #fff;
          }
        }
        .months-tags {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 10px;
          padding: 0 25px;
          .tag {
            height: 40px;
            background-color: #fff;
            text-align: center;
            color: rgba(16, 16, 16, 1);
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            margin-right: 4px;
            margin-bottom: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
          }
          .tag-selected {
            background-color: #436abd;
            color: #fff;
          }
        }

        .text {
          margin-top: 10px;
          color: rgba(100, 100, 100, 1);
          font-size: 14px;
          .text-item {
            color: #4468bd;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.VagueSearchSelectClass {
  .el-select-dropdown__item {
    font-size: 14px;
    padding: 0;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 50px !important;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
    margin-bottom: 4px;
  }
  .el-select-dropdown__item.hover {
    background-color: #fff;
  }

  // 块
  .option-block {
    font-size: 12px;
    .option-block-top {
      padding: 10px;
      display: flex;
      align-items: center;
      height: 20px;
      line-height: 20px;
      margin-bottom: 4px;
    }
    .option-block-1 {
      background-color: rgba(230, 255, 251, 1);
      color: rgba(29, 197, 196, 1);
      width: 60px;
      text-align: center;
      margin-right: 6px;
      border-radius: 4px;
    }
    .option-block-2 {
      flex: 1;
      background-color: rgba(245, 245, 245, 1);
      color: rgba(153, 153, 153, 1);
      padding-left: 10px;
    }
    .option-block-3 {
      background-color: #fff;
      color: rgba(90, 94, 102, 1);
      // padding-left: 10px;
      padding: 10px 0 10px 24px;
      display: flex;
      align-items: center;
      text-align: center;
      height: 26px;
      line-height: 26px;
    }
    .option-block-3:hover {
      background-color: #f4f6f9;
    }
  }
}
</style>
