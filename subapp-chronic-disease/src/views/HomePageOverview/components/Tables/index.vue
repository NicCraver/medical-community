<template>
  <div class="home-tables" ref="home-tables">
    <div class="head-action">
      <div>随访人员工作量统计</div>
      <div class="actions">
        <!-- <el-radio-group v-model="radioGroup" @change="radioChange">
          <el-radio-button label="C"> 科室 </el-radio-button>
          <el-radio-button label="D"> 病种 </el-radio-button>
        </el-radio-group> -->
        <el-date-picker
          style="margin-left: 20px"
          v-model="date"
          :picker-options="pickerOptions"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="dateChange"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-skeleton :rows="rows" :loading="loading" animated style="margin-top: 20px">
        <template>
          <el-table
            v-if="!loading"
            :data="tableData"
            :height="tableHeight - 90"
            stripe
            border
            style="width: 100%; margin-top: 10px"
          >
            <el-table-column label="排名" width="50">
              <template slot-scope="scope">
                <span
                  :style="{
                    color:
                      scope.$index === 0
                        ? '#FF2D55'
                        : scope.$index === 1
                        ? '#FF9502'
                        : scope.$index === 2
                        ? '#00BB7A'
                        : '',
                  }"
                >
                  {{ scope.$index + 1 }}
                </span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="deptDesc" label="科室" v-if="radioGroup === 'C'"> </el-table-column> -->
            <!-- <el-table-column v-if="radioGroup === 'C'" prop="diseaseStr" label="病种" min-width="150"> </el-table-column> -->
            <!-- <el-table-column v-if="radioGroup === 'D'" prop="diseaseDesc" label="病种" min-width="150"> </el-table-column> -->
            <el-table-column prop="includeUserName" label="随访人员"> </el-table-column>
            <el-table-column prop="workload" label="已随访条数"> </el-table-column>
            <el-table-column prop="terminationTot" label="已中止条数"> </el-table-column>
            <el-table-column prop="followupPatNum" label="随访患者数"> </el-table-column>
          </el-table>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getHomePageData } from '@/api/modules/Home'
export default {
  props: {
    tableHeight: {
      type: Number,
    },
  },
  data() {
    return {
      rows: 6,
      loading: true,
      date: [],
      upDate: { startDate: '', endDate: '' },
      radioGroup: 'C',
      tableData: [],
      pickerOptions: {
        disabledDate(time) {
          const today = new Date()
          today.setHours(0, 0, 0, 0) // 重置为当天零时零分零秒
          return time.getTime() > today.getTime() // 如果时间超过今天则禁止选择
        },
      },
    }
  },
  mounted() {
    console.log(`this.initDate()`, this.initDate())
    this.upDate = this.initDate()
    this.date = [this.initDate().startDate, this.initDate().endDate]
    console.log(`this.date`, this.date)
    this.init()
    this.maxRows()
  },
  methods: {
    async init() {
      this.loading = true
      try {
        const res = await getHomePageData({
          type: this.radioGroup,
          ...this.upDate,
        })
        console.log(`CDCDCDCDCDCDCD`)
        this.tableData = res.result
        setTimeout(() => {
          this.loading = false
        }, 500)
      } catch (error) {
        console.log(`error`, error)
        this.loading = false
      }
    },
    initDate() {
      var TimeNow = new Date()
      var startDate = new Date(TimeNow.getFullYear(), TimeNow.getMonth(), 1) //当月1号
      var endDate = new Date(TimeNow.getFullYear(), TimeNow.getMonth(), TimeNow.getDate())
      return {
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
      }
    },
    maxRows() {
      this.rows = Math.floor(this.$refs['home-tables'].clientHeight / 72)
    },
    dateChange(e) {
      this.upDate.startDate = e[0]
      this.upDate.endDate = e[1]
      this.init()
    },
    radioChange(e) {
      this.init()
    },
  },
}
</script>

<style lang="scss" scoped>
.home-tables {
  height: calc(100vh - 545px);
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
