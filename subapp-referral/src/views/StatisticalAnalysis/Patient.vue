<template>
  <div class="patient">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <OrgHosSelect ref="orgRef" v-model="queryParams.orgId" placeholder="集团"></OrgHosSelect>
        <OrgHosSelect
          ref="hosRef"
          v-model="queryParams.hosId"
          :parentId="queryParams.orgId"
          placeholder="转出机构"
        ></OrgHosSelect>
        <!-- 
        <ReferralSelect placeholder="集团" module="publicModule" type="ORG" :status="status" v-model="queryParams.orgId"></ReferralSelect>
        <ReferralSelect
          placeholder="转出机构"
          module="publicModule"
          type="ORG_HOS"
          :status="status"
          v-model="queryParams.hosId"
          :orgId="queryParams.orgId"
          :disabled="!queryParams.orgId"
        ></ReferralSelect> -->
        <el-cascader
          v-model="queryParams.outDept"
          :options="deptOptionsData"
          :props="{ checkStrictly: true }"
          placeholder="转出科室"
          clearable
          :disabled="!queryParams.hosId"
          :key="Date.now()"
        ></el-cascader>
        <el-select
          v-model="queryParams.referralType"
          clearable
          placeholder="转诊类型"
          :disabled="rootDisabled"
        >
          <el-option label="上转" value="A" />
          <el-option label="下转" value="B" />
        </el-select>
        <el-select
          v-model="queryParams.status"
          placeholder="转诊结果"
          clearable
          :disabled="rootDisabled"
        >
          <el-option label="转诊成功" value="S" />
          <el-option label="转诊失败" value="F" />
        </el-select>
        <el-select
          v-model="queryParams.failCode"
          placeholder="失败原因"
          clearable
          :disabled="rootDisabled"
        >
          <el-option
            :label="item.LABLE"
            :value="item.VALUE"
            :key="item.VALUE"
            v-for="item in failReason"
          />
        </el-select>
        <el-input
          placeholder="姓名/门诊住院号/身份证号"
          v-model="queryParams.searchValue"
          clearable
          :disabled="rootDisabled"
        />
        <el-select
          v-model="queryParams.ageType"
          placeholder="年龄段分布"
          clearable
          :disabled="rootDisabled"
        >
          <el-option label="<=18岁" value="1" />
          <el-option label="18~35岁" value="2" />
          <el-option label="36~59岁" value="3" />
          <el-option label=">=60岁" value="4" />
        </el-select>
        <el-select
          v-model="queryParams.sex"
          placeholder="性别分布"
          clearable
          :disabled="rootDisabled"
        >
          <el-option
            :label="item.LABLE"
            :value="item.VALUE"
            :key="item.VALUE"
            v-for="item in sexList"
          />
        </el-select>
        <el-input placeholder="诊断分布" v-model="queryParams.icdName" clearable />
        <!-- <el-select v-model="queryParams.icdCode" placeholder="诊断分布" clearable :disabled="!queryParams.orgId">
          <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in diagnosisData" />
        </el-select> -->
        <el-date-picker
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          start-placeholder="统计开始时间"
          end-placeholder="统计结束时间"
          range-separator="至"
          v-model="queryParams.statisticsDate"
          clearable
          style="width: 410px"
          :picker-options="pickerOptions"
          :disabled="rootDisabled"
          :default-time="['00:00:00', '23:59:59']"
        />
      </template>
      <template #actions>
        <el-button type="primary" @click="onInquire">搜索</el-button>
        <el-button @click="resetQueryParams">重置</el-button>
      </template>
      <template #batchActions>
        <el-button
          :class="queryParams.orgId ? '' : 'grey'"
          type="primary"
          @click="comprehensiveExportExcel"
          >导出</el-button
        >
      </template>
      <el-table
        ref="singleTable"
        v-adaptive="{ bottomOffset: 60 }"
        height="0"
        :data="dataList"
        border
        v-loading="loading"
        row-key="id"
      >
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="modDate" />
        <el-table-column label="转诊结果" width="100">
          <template slot-scope="{ row }">
            {{ row.statusDesc }}
            <el-tooltip effect="dark" placement="top-start" v-if="row.status === 'F'">
              <div slot="content">失败原因：{{ row.abortReason }}</div>
              <i class="el-icon el-icon-warning-outline" style="color: #4468bd"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="首次提交时间" prop="submitDate" />
        <el-table-column label="流转天数" prop="dayNum" />
        <el-table-column label="完成时间" prop="finishDate" />
        <el-table-column label="转诊类型" prop="referralTypeDesc" />
        <el-table-column label="转出机构" prop="outHosName" />
        <el-table-column label="转出科室" prop="outDeptName" />
        <el-table-column label="门诊/住院号" prop="caseNo" />
        <el-table-column label="患者姓名" prop="patName" />
        <el-table-column label="性别" prop="sexDesc" />
        <el-table-column label="年龄" prop="refAge" />
        <el-table-column label="身份证号" prop="idNo" />
        <el-table-column label="联系方式" prop="phone" />
        <el-table-column label="诊断" prop="icdName" show-overflow-tooltip />
        <el-table-column label="去向" prop="targetSourceName" />
        <el-table-column label="转入机构" prop="inHosName" />
        <el-table-column label="转入科室" prop="inDeptName" />
        <el-table-column label="所属集团" prop="orgName" />
      </el-table>
    </ProList>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { ProList } from 'anx-vue'
import {
  onQueryPatAnaData,
  comprehensiveExportExcel,
  getDataDownBox,
} from '@/api/modules/statisticAnalysis'
import { getDictionary } from '@/api/modules/systemAdmin'
import dayjs from 'dayjs'

export default {
  name: 'PatientAnalysis',
  components: {
    ProList,
  },
  data() {
    return {
      queryParams: {},
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      status: 'Y',
      dataList: [],
      total: 0,
      loading: false,
      exportLoading: null,
      sexList: [],
      failReason: [],
      deptOptionsData: [],
      diagnosisData: [],
      resetParams: [
        'outDept',
        'referralType',
        'status',
        'failCode',
        'searchValue',
        'ageType',
        'sex',
        'icdCode',
        'statisticsDate',
        'icdName',
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const end = new Date(dayjs(new Date()).format('YYYY-MM-DD') + ' 23:59')
              const start = new Date(dayjs(new Date()).format('YYYY-MM-DD') + ' 00:00')
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '本周',
            onClick(picker) {
              const weekDay = new Date().getDay()
              const cur = new Date()
              const end = new Date()
              const start = new Date(
                dayjs(new Date(cur.getTime() - 3600 * 1000 * 24 * (weekDay - 1))).format(
                  'YYYY-MM-DD',
                ) + ' 00:00',
              )
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '本月',
            onClick(picker) {
              const start = new Date(
                dayjs(new Date(dayjs(new Date()).format('YYYY-MM'))).format('YYYY-MM-DD') +
                  ' 00:00',
              )
              const end = new Date()
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
    }
  },
  computed: {
    rootDisabled() {
      return this.$IS_ROOT_ADMIN && !this.queryParams.orgId
    },
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
  },
  methods: {
    async getDataDownBox(type, dataName) {
      try {
        const res = await getDataDownBox({
          hosId: this.queryParams.hosId || '',
          orgId: this.queryParams.orgId || '',
          type,
        })
        this[dataName] = res.result
        if (type === 'DEPT_OUT') {
          this.filterDeptData(this[dataName], true)
        }
        console.log('getDataDownBox==', res)
      } catch (err) {
        console.error(err)
      }
    },
    filterDeptData(optionsData, isFirst) {
      optionsData.forEach((item) => {
        if (!isFirst && item.children) {
          item.disabled = true
        }
        if (item.children) {
          this.filterDeptData(item.children)
        }
      })
    },
    async getDictionary(mapList, code) {
      try {
        const res = await getDictionary({
          code,
        })
        console.log('getDictionary==', res)
        this[mapList] = res.result
      } catch (err) {
        console.error(err)
      }
    },
    async onInquire() {
      if (!this.queryParams.orgId) {
        this.$message.warning('请先选择集团')
        return
      }
      try {
        this.loading = true
        let deptId = ''
        let deptType = ''
        if (this.queryParams.outDept && this.queryParams.outDept.length > 1) {
          deptId = this.queryParams.outDept[this.queryParams.outDept.length - 1]
        }
        if (this.queryParams.outDept && this.queryParams.outDept.length === 1) {
          deptType = this.queryParams.outDept[0]
        }
        const res = await onQueryPatAnaData({
          ...this.queryParams,
          startDateS: this.queryParams.statisticsDate
            ? `${this.queryParams.statisticsDate[0]}:00` || ''
            : '',
          startDateE: this.queryParams.statisticsDate
            ? `${this.queryParams.statisticsDate[1]}:59` || ''
            : '',
          ...this.pageParams,
          deptId: deptId,
          deptType: deptType,
        })
        console.log('onQueryPatAnaData==', res)
        this.dataList =
          res.result.map((item) => ({
            ...item,
            referralTypeDesc: item.referralType === 'A' ? '上转' : '下转',
          })) || []
        this.dataList.forEach((el) => {
          for (let key in el) {
            if (!el[key] && el[key] !== 0) {
              el[key] = '/'
            }
          }
        })
        this.total = res.total
        this.loading = false
      } catch (err) {
        this.loading = false
        console.error(err)
      }
    },
    async comprehensiveExportExcel() {
      if (!this.queryParams.orgId) {
        this.$message.warning('请先选择集团')
        return
      }
      try {
        const params = {
          ...this.queryParams,
          exportType: 'PAT_ANA',
          loginId: window.sessionStorage.getItem('userId'),
          operator: window.sessionStorage.getItem('headerLoginName'),
        }
        if (this.queryParams.statisticsDate) {
          params.startDateS = `${this.queryParams.statisticsDate[0]}:00`
          params.startDateE = `${this.queryParams.statisticsDate[1]}:59`
        }
        let deptId = ''
        let deptType = ''
        if (this.queryParams.outDept && this.queryParams.outDept.length > 1) {
          deptId = this.queryParams.outDept[this.queryParams.outDept.length - 1]
        }
        if (this.queryParams.outDept && this.queryParams.outDept.length === 1) {
          deptType = this.queryParams.outDept[0]
        }
        params.deptId = deptId
        params.deptType = deptType

        this.exportLoading = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)',
        })
        const res = await comprehensiveExportExcel(params)
        this.exportLoading.close()
        if (res.data.type === 'application/json') {
          const reader = new FileReader()
          reader.readAsText(res.data, 'utf-8')
          reader.onload = () => {
            const { desc } = JSON.parse(reader.result)
            this.$message.error(desc)
          }
          return
        }
        let blob = new Blob([res.data])
        let downloadElement = document.createElement('a')
        let href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.setAttribute('download', '患者转诊记录统计表.xls')
        document.body.appendChild(downloadElement)
        downloadElement.click()
      } catch (err) {
        this.exportLoading.close()
        console.error('error', err)
      }
    },
    async resetQueryParams() {
      this.queryParams = {}
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.onInquire()
    },
  },
  watch: {
    'queryParams.orgId': {
      immediate: true,
      handler(newVal) {
        this.queryParams.outDept = ''
        this.deptOptionsData = []
        console.log('newVal', newVal)
        if (newVal) {
          this.getDataDownBox('ICD')
        }
      },
    },
    'queryParams.hosId': {
      immediate: true,
      handler(newVal) {
        this.queryParams.outDept = ''
        this.deptOptionsData = []
        if (newVal) {
          this.getDataDownBox('DEPT_OUT', 'deptOptionsData')
          this.getDataDownBox('ICD')
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.patient {
  .ProList {
    border-radius: 2px;
    padding: 10px;
    background-color: #fff;
  }
  .grey {
    background-color: #ccc;
    border: #ccc;
  }
}
</style>
