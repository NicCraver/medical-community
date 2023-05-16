<template>
  <div class="comprehensiveAnalysis">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <OrgHosSelect ref="orgRef" v-model="queryParams.orgId" placeholder="集团"></OrgHosSelect>
        <OrgHosSelect
          ref="hosRef"
          v-model="queryParams.hosId"
          :parentId="queryParams.orgId"
          placeholder="转出机构"
        ></OrgHosSelect>
        <!-- <ReferralSelect placeholder="集团" module="publicModule" type="ORG" :status="status" v-model="queryParams.orgId"></ReferralSelect>
        <ReferralSelect
          placeholder="转出机构"
          module="publicModule"
          type="ORG_HOS"
          :status="status"
          v-model="queryParams.hosId"
          :orgId="queryParams.orgId"
          :disabled="!queryParams.orgId"
        ></ReferralSelect> -->
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
          :disabled="$IS_ROOT_ADMIN && !queryParams.orgId"
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
          @click="comprehensiveExportExcel('STA')"
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
        @sort-change="handleSortChange"
      >
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构名称" prop="hosName" min-width="180px" />
        <el-table-column
          label="转出总人次"
          prop="transferOutAndInTotal"
          sortable="custom"
          min-width="120px"
        />
        <el-table-column
          label="转出门诊人次"
          prop="transferOutClinicNum"
          sortable="custom"
          min-width="130px"
        />
        <el-table-column
          label="转出检查人次"
          prop="transferOutMedTechNum"
          sortable="custom"
          min-width="130px"
        />
        <el-table-column
          label="转出住院人次"
          prop="transferOutHosNum"
          sortable="custom"
          min-width="130px"
        />
        <el-table-column
          label="待审核人次"
          prop="waitAuditNum"
          sortable="custom"
          min-width="120px"
        />
        <el-table-column label="待接诊人次" prop="waitAdmNum" sortable="custom" min-width="120px" />
        <el-table-column
          label="被接诊总人次"
          prop="alreadyAdmNum"
          sortable="custom"
          min-width="130px"
        />
        <el-table-column label="关闭人次" prop="abortNum" sortable="custom" min-width="110px" />
        <el-table-column label="更新时间" prop="modDate" sortable="custom" min-width="220px" />
        <el-table-column label="所属集团" prop="orgName" min-width="180px" />
        <el-table-column label="操作" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" @click="comprehensiveExportExcel('DET', row.hosId)"
              >导出明细</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </ProList>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import dayjs from 'dayjs'
import { ProList } from 'anx-vue'
import { onQueryStatisticsAnaData, comprehensiveExportExcel } from '@/api/modules/statisticAnalysis'

export default {
  name: 'ComprehensiveAnalysis',
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
      resetParams: ['statisticsDate'],
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
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
  },
  // mounted() {
  //   if (this.$IS_ROOT_ADMIN && !this.queryParams.orgId) {
  //     return
  //   }
  //   let listenerParams = []
  //   if (this.$IS_ORI_ADMIN) {
  //     listenerParams = ['orgId', 'hosId']
  //   } else if (this.$IS_ORG_ADMIN) {
  //     listenerParams = ['orgId']
  //   }
  //   if (!listenerParams.length) {
  //     this.onInquire()
  //   } else {
  //     const time = setInterval(() => {
  //       let flag = true
  //       for (let i = 0; i < listenerParams.length; i++) {
  //         flag = flag && !!this.queryParams[listenerParams[i]]
  //       }
  //       if (flag) {
  //         clearInterval(time)
  //         this.onInquire()
  //       }
  //     }, 100)
  //   }
  // },
  methods: {
    async onInquire(sortType, sortDesc) {
      if (!this.queryParams.orgId) {
        this.$message.warning('请先选择集团')
        return
      }
      try {
        this.loading = true
        const res = await onQueryStatisticsAnaData({
          ...this.queryParams,
          statisticsDateS: this.queryParams.statisticsDate
            ? `${this.queryParams.statisticsDate[0]}:00` || ''
            : '',
          statisticsDateE: this.queryParams.statisticsDate
            ? `${this.queryParams.statisticsDate[1]}:59` || ''
            : '',
          ...this.pageParams,
          sortType: sortType || '',
          sortDesc: sortDesc || '',
        })
        console.log('onQueryStatisticsAnaData==', res)
        this.dataList = res.result || []
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
    async comprehensiveExportExcel(exportType, hosId) {
      if (!this.queryParams.orgId) {
        this.$message.warning('请先选择集团')
        return
      }
      try {
        let params = {}
        if (exportType === 'DET') {
          params = {
            hosId,
            exportType,
            operator: window.sessionStorage.getItem('headerLoginName'),
          }
        } else {
          params = {
            ...this.queryParams,
            exportType,
            operator: window.sessionStorage.getItem('headerLoginName'),
          }
          if (this.queryParams.statisticsDate) {
            params.statisticsDateS = `${this.queryParams.statisticsDate[0]}:00`
            params.statisticsDateE = `${this.queryParams.statisticsDate[1]}:59`
          }
        }
        this.exportLoading = Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)',
        })
        const res = await comprehensiveExportExcel(params)
        console.log('res', res)
        const fileName =
          exportType === 'DET'
            ? '转诊综合统计明细表' + Date.parse(new Date()) + '.xls'
            : '转诊综合统计表' + Date.parse(new Date()) + '.xls'
        console.log('res', res)
        this.exportLoading.close()
        // let link = document.createElement('a')
        // link.href = window.URL.createObjectURL(res.data)
        // link.download = fileName
        // link.click()
        // // 释放内存
        // window.URL.revokeObjectURL(link.href)

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
        downloadElement.setAttribute('download', fileName)
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
    handleSortChange({ column, prop, order }) {
      console.log('column', column)
      console.log('prop', prop)
      console.log('order', order)
      let sortDesc = ''
      const map = {
        transferOutAndInTotal: 'TRANS_ALL',
        transferOutClinicNum: 'TRANS_CLINIC',
        transferOutMedTechNum: 'TRANS_MED',
        transferOutHosNum: 'TRANS_HOS',
        waitAuditNum: 'WAIT_DEAL',
        waitAdmNum: 'WAIT_ADM',
        alreadyAdmNum: 'QUILT_ADM',
        abortNum: 'ABORT',
        modDate: 'UPDATE_TIME',
      }
      if (order === 'ascending') {
        sortDesc = 'ASC'
      } else if (order === 'descending') {
        sortDesc = 'DESC'
      }
      this.onInquire(map[prop], sortDesc)
    },
  },
}
</script>

<style lang="scss" scoped>
.comprehensiveAnalysis {
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
