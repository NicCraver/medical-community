<template>
  <div class="workload">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <OrgHosSelect ref="orgRef" v-model="queryParams.orgId" placeholder="集团"></OrgHosSelect>
        <OrgHosSelect
          ref="hosRef"
          v-model="queryParams.hosId"
          :parentId="queryParams.orgId"
          placeholder="转出机构"
        ></OrgHosSelect>
        <!-- <ReferralSelect
          placeholder="集团"
          module="publicModule"
          type="ORG"
          :status="status"
          v-model="queryParams.orgId"
        ></ReferralSelect>
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
        ></el-cascader>
        <el-input
          placeholder="姓名"
          v-model="queryParams.name"
          clearable
          :disabled="rootDisabled"
        />
        <el-cascader
          v-model="queryParams.position"
          :options="positionOptionsData"
          :props="{ checkStrictly: true }"
          placeholder="类型-职称"
          clearable
          :disabled="!queryParams.orgId"
        ></el-cascader>
        <el-select
          v-model="queryParams.roleType"
          placeholder="角色类型"
          clearable
          :disabled="rootDisabled"
        >
          <el-option label="转诊医生" value="REF" />
          <el-option label="接诊医生" value="ADM" />
        </el-select>
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
          type="primary"
          :class="queryParams.orgId ? '' : 'grey'"
          @click="comprehensiveExportExcel"
          >导出</el-button
        >
        <span class="tips">*医生工作量统计为已完成转诊/接诊人次</span>
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
        <el-table-column label="机构名称" prop="hosName" />
        <el-table-column label="科室" prop="departMentName" />
        <el-table-column label="医生工号" prop="doctorCode" />
        <el-table-column label="医生姓名" prop="doctorName" />
        <el-table-column label="性别" prop="sexDesc" />
        <el-table-column label="职称" prop="titleDesc" />
        <el-table-column label="转出总人次" prop="transferAllNum" />
        <el-table-column label="接诊总人次" prop="drAdmNum" />
        <el-table-column label="更新时间" prop="modDate" />
        <el-table-column label="所属集团" prop="orgName" />
      </el-table>
    </ProList>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { ProList } from 'anx-vue'
import {
  onQueryDoctorWorkloadData,
  comprehensiveExportExcel,
  getDataDownBox,
} from '@/api/modules/statisticAnalysis'
import dayjs from 'dayjs'

export default {
  name: 'WorkloadAnalysis',
  components: {
    ProList,
  },
  data() {
    return {
      outDeptKey: Date.now() + 10,
      positiontKey: Date.now(),
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
      deptOptionsData: [],
      positionOptionsData: [],
      resetParams: ['outDept', 'name', 'position', 'roleType', 'statisticsDate'],
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
      hasAdmissionAuth: false,
      hasReferralAuth: false,
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
        this.filterDeptData(this[dataName], true)
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
    async onInquire() {
      if (!this.queryParams.orgId) {
        this.$message.warning('请先选择集团')
        return
      }
      this.loading = true
      console.log('queryParams.outDept', this.queryParams.outDept)
      const outDeptId =
        this.queryParams.outDept && this.queryParams.outDept.length > 1
          ? this.queryParams.outDept[this.queryParams.outDept.length - 1]
          : ''
      const outDeptType =
        this.queryParams.outDept && this.queryParams.outDept.length === 1
          ? this.queryParams.outDept[0]
          : ''

      const titleCode =
        this.queryParams.position && this.queryParams.position.length > 1
          ? this.queryParams.position[this.queryParams.position.length - 1]
          : ''
      const titleType =
        this.queryParams.position && this.queryParams.position.length === 1
          ? this.queryParams.position[0]
          : ''
      try {
        const res = await onQueryDoctorWorkloadData({
          ...this.queryParams,
          deptId: outDeptId,
          deptType: outDeptType,
          titleCode,
          titleType,
          startDateS: this.queryParams.statisticsDate
            ? `${this.queryParams.statisticsDate[0]}:00` || ''
            : '',
          startDateE: this.queryParams.statisticsDate
            ? `${this.queryParams.statisticsDate[1]}:59` || ''
            : '',
          ...this.pageParams,
        })
        console.log('onQueryDoctorWorkloadData==', res)
        this.dataList = res.result
          ? res.result.map((item) => ({
              ...item,
              titleDesc: `${item.titleTypeDesc}-${item.titleCodeDesc}`,
              // transferAllNum: item.applyRecordCount === 1 ? item.transferAllNum : '/',
              // drAdmNum: item.admCount === 1 ? item.drAdmNum : '/',
            }))
          : []
        this.dataList.forEach((el) => {
          for (let key in el) {
            if (!el[key] && el[key] !== 0) {
              el[key] = '/'
            }
          }
        })
        console.log(`this.dataList`,this.dataList)
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
          exportType: 'DOC_WORK',
          loginId: window.sessionStorage.getItem('userId'),
          operator: window.sessionStorage.getItem('headerLoginName'),
        }
        if (this.queryParams.statisticsDate) {
          params.startDateS = `${this.queryParams.statisticsDate[0]}:00`
          params.startDateE = `${this.queryParams.statisticsDate[1]}:59`
        }
        const outDeptId =
          this.queryParams.outDept && this.queryParams.outDept.length > 1
            ? this.queryParams.outDept[this.queryParams.outDept.length - 1]
            : ''
        const outDeptType =
          this.queryParams.outDept && this.queryParams.outDept.length === 1
            ? this.queryParams.outDept[0]
            : ''

        const titleCode =
          this.queryParams.position && this.queryParams.position.length > 1
            ? this.queryParams.position[this.queryParams.position.length - 1]
            : ''
        const titleType =
          this.queryParams.position && this.queryParams.position.length === 1
            ? this.queryParams.position[0]
            : ''

        params.deptId = outDeptId
        params.deptType = outDeptType

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
        downloadElement.setAttribute('download', '医生工作量统计表.xls')
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
          this.getDataDownBox('TITLE', 'positionOptionsData')
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
          this.getDataDownBox('TITLE', 'positionOptionsData')
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.workload {
  .tips {
    color: #4468bd;
    font-size: 14px;
    margin-left: 20px;
  }
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
