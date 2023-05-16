<template>
  <div class="workload">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <OrgHosSelect ref="orgRef" v-model="queryParams.orgId" placeholder="集团"></OrgHosSelect>
        <OrgHosSelect
          ref="hosRef"
          v-model="queryParams.hosId"
          :parentId="queryParams.orgId"
          placeholder="转入机构"
        ></OrgHosSelect>
        <el-cascader
          v-model="queryParams.outDept"
          :options="deptOptionsData"
          :props="{ checkStrictly: true }"
          placeholder="科室名称"
          clearable
          :disabled="!queryParams.hosId"
        ></el-cascader>
        <el-select v-model="queryParams.hosType" placeholder="医院类型" clearable>
          <el-option
            v-for="item in hospitalLypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
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
        <span class="tips">*科室工作量统计为已完成转诊/接诊人次</span>
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
        <el-table-column label="科室" prop="deptTypeAndName" />
        <el-table-column label="转出总人次" prop="transferOutAndInTotal" />
        <el-table-column label="接诊总人次" prop="alreadyAdmNum" />
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
  onQueryDeptAnaData,
  onQueryAdmAnaData,
} from '@/api/modules/statisticAnalysis'

export default {
  name: 'DeptWorkloadAnalysis',
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
      hospitalLypeList: [],
      resetParams: ['outDept', 'name', 'position', 'roleType', 'statisticsDate'],
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
        console.log('type', type)
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
        const res = await onQueryDeptAnaData({
          ...this.queryParams,
          deptId: outDeptId,
          deptType: outDeptType,
          // titleCode,
          // titleType,
          statisticsDateS: this.queryParams.statisticsDate
            ? `${this.queryParams.statisticsDate[0]}:00` || ''
            : '',
          statisticsDateE: this.queryParams.statisticsDate
            ? `${this.queryParams.statisticsDate[1]}:59` || ''
            : '',
          ...this.pageParams,
        })
        console.log('onQueryDoctorWorkloadData==', res)
        this.dataList = res.result
          ? res.result.map((item) => ({
              ...item,
              titleDesc: `${item.titleTypeDesc}-${item.titleCodeDesc}`,
              transferAllNum: item.applyRecordCount === 1 ? item.transferAllNum : '/',
              drAdmNum: item.admCount === 1 ? item.drAdmNum : '/',
            }))
          : []
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
          exportType: 'DEPT_ANA',
          loginId: window.sessionStorage.getItem('userId'),
          operator: window.sessionStorage.getItem('headerLoginName'),
        }
        if (this.queryParams.statisticsDate) {
          params.statisticsDateS = `${this.queryParams.statisticsDate[0]}:00`
          params.statisticsDateE = `${this.queryParams.statisticsDate[1]}:59`
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
        downloadElement.setAttribute('download', '转诊科室工作量统计表.xls')
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
        // console.log('newVal', newVal)
        if (newVal) {
          this.getDataDownBox('TITLE', 'positionOptionsData')
          this.getDataDownBox('HOS_TYPE', 'hospitalLypeList')
        }
      },
    },
    'queryParams.hosId': {
      immediate: true,
      handler(newVal) {
        this.queryParams.outDept = ''
        this.deptOptionsData = []
        if (newVal) {
          this.getDataDownBox('HOS_TYPE', 'hospitalLypeList')
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
