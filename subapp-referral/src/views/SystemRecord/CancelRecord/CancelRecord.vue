<template>
  <div class="CancelRecord">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>取消记录</template>
      <template #main>
        <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
          <template #header>
            <el-input
              placeholder="姓名/门诊号/联系电话/身份证号"
              v-model="queryParams.patName"
              style="width: 260px"
              clearable
            />
            <el-select placeholder="操作记录" v-model="queryParams.status" clearable>
              <el-option label="无需转诊" value="N" />
              <el-option label="取消转诊" value="C" />
            </el-select>
            <el-date-picker
              type="daterange"
              value-format="yyyy-MM-dd"
              start-placeholder="提示开始日期"
              end-placeholder="提示结束日期"
              range-separator="至"
              v-model="createDate"
              clearable
              style="width: 350px"
            />
            <OrgHosSelect
              ref="orgRef"
              v-model="queryParams.orgId"
              placeholder="集团"
            ></OrgHosSelect>
            <OrgHosSelect
              ref="hosRef"
              v-model="queryParams.hosId"
              :parentId="queryParams.orgId"
              placeholder="转出机构"
            ></OrgHosSelect>
          </template>
          <template #actions>
            <el-button type="primary" @click="onInquire()">搜索</el-button>
            <el-button @click="resetQueryParams">重置</el-button>
          </template>
          <el-table
            ref="singleTable"
            v-adaptive="{ bottomOffset: 60 }"
            height="0"
            :data="userList"
            border
            v-loading="loading"
            row-key="patId"
          >
            <el-table-column label="序号" type="index" width="50">
              <template slot-scope="scope">
                <span>{{ scope.row.seq }}</span>
              </template>
            </el-table-column>
            <el-table-column label="系统提示时间" prop="createDate" width="155" />
            <el-table-column label="操作记录" prop="optRecord" width="80" />
            <el-table-column label="状态" prop="statusDesc" width="120" />
            <el-table-column label="门诊号/住院号" prop="caseNo" width="150" />
            <el-table-column label="患者姓名" prop="patName" width="140" />
            <el-table-column label="性别" prop="sexDesc" width="50" show-overflow-tooltip />
            <el-table-column label="年龄" prop="refAge" width="80" />
            <el-table-column label="身份证号" prop="idNo" width="190" />
            <el-table-column label="联系电话" prop="phoneNo" width="240" show-overflow-tooltip />
            <el-table-column label="医疗机构" prop="hosName" width="100" />
            <el-table-column label="机构内编码" prop="warnDiagnosesCode" width="100" />
            <el-table-column label="机构内名称" prop="warnDiagnosesDesc" width="100" />
            <el-table-column label="门诊医生" prop="admDrUserName" width="100" />
            <el-table-column label="就诊时间" prop="admDate" width="155" />
          </el-table>
        </ProList>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProList, ProLayout } from 'anx-vue'
import { onQueryHisWarns } from '../../../api/modules/directoryList'
import { onQueryPatients, onInitPatQueryParam } from '../../../api/modules/patientCenter'
export default {
  components: { ProLayout, ProList },
  data() {
    return {
      status: 'Y',
      loading: false,
      userList: [],
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      modDate: [],
      createDate: [],
      createUser: [],
      diagnoses: [],
      nearOptUser: [],
      time: null,
      resetParams: ['patName', 'status'],
    }
  },
  async mounted() {
    // let CancelRecordQueryParams = window.sessionStorage.getItem('CancelRecordQueryParams')
    // this.queryParams = JSON.parse(CancelRecordQueryParams).queryParams
    // this.modDate = JSON.parse(CancelRecordQueryParams).modDate
    // this.createDate = JSON.parse(CancelRecordQueryParams).createDate
    // this.$set(this.pageParams, 'pageNum', JSON.parse(CancelRecordQueryParams).pageParams.pageNum)
    // this.$set(this.pageParams, 'pageSize', JSON.parse(CancelRecordQueryParams).pageParams.pageSize)
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
  },
  methods: {
    async onInquire() {
      try {
        this.loading = true
        console.log('this.queryParams', this.queryParams)
        const res = await onQueryHisWarns({
          ...this.queryParams,
          ...this.pageParams,
          createDateS: this.createDate
            ? this.createDate[0]
              ? this.createDate[0] + ' 00:00:00'
              : ''
            : '',
          createDateE: this.createDate
            ? this.createDate[1]
              ? this.createDate[1] + ' 23:59:59'
              : ''
            : '',
        })
        window.sessionStorage.setItem(
          'CancelRecordQueryParams',
          JSON.stringify({
            queryParams: this.queryParams,
            pageParams: this.pageParams,
            modDate: this.modDate,
            createDate: this.createDate,
          }),
        )
        const { total, records } = res.result
        if (records.length === 0 && this.pageParams.pageNum !== 1) {
          this.pageParams.pageNum = 1
          this.onInquire()
          return
        }
        this.total = total
        records.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.userList = records
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('error', error)
      }
    },
    // 查看
    fnExamine(row, status, hasData) {
      console.log('fnExamine', row)
      if (hasData) {
        this.$router.push({
          name: 'CancelRecordDetail',
          query: {
            status: status,
            referralId: row.referralId,
            activeComponent: 'ReferralRecords',
            patId: row.patId,
            hasData: hasData,
          },
        })
      } else {
        this.$router.push({
          name: 'CancelRecordDetail',
          query: {
            status: status,
            referralId: row.referralId,
            activeComponent: 'ReferralRecords',
            patId: row.patId,
          },
        })
      }
    },
    fnReferral(row, status) {
      console.log('row', row)
      this.$router.push({
        name: 'CancelRecordDetail',
        query: {
          status: status,
          referralId: row.referralId,
          patId: row.patId,
          btnStatus: row.btnStatus,
        },
      })
    },
    fnTheStaging(row) {
      console.log('row', row)
      this.$router.push({
        name: 'CancelRecordDetail',
        query: {
          status: 'temporaryStorage',
          referralId: row.referralId,
          patId: row.patId,
        },
      })
    },
    async onInitPatQueryParam() {
      try {
        const res = await onInitPatQueryParam()
        this.createUser = res.result.createUser
        this.diagnoses = []
        res.result.diagnoses.forEach((_) => {
          if (_) {
            this.diagnoses.push(_)
          }
        })
        this.nearOptUser = res.result.nearOptUser
        if (res.result.nearOptUser.find((_) => _.VALUE === sessionStorage.getItem('userId'))) {
          this.$set(this.queryParams, 'optUserId', sessionStorage.getItem('userId'))
        }
      } catch (error) {
        console.error('error', error)
      }
    },
    // 新增转诊单
    addReferralForm() {
      this.$router.push({
        name: 'CancelRecordDetail',
        query: {
          status: 'add',
        },
      })
    },
    // 重置
    async resetQueryParams() {
      this.queryParams = {}
      await this.$refs.orgRef.init()
      await this.$refs.hosRef.init()
      this.createDate = []
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.onInquire()
    },
  },
}
</script>

<style lang="scss" scoped>
.CancelRecord {
  ::v-deep .pro-table .query-conditions .actions {
    display: flex;
    margin-top: 10px !important;
  }
  ::v-deep.el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 15px !important;
  }
  ::v-deep.ProDialog .title:before {
    content: '';
    position: absolute;
    left: -15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }
  .ProList {
    border-radius: 2px;
    padding: 10px;
    background-color: #fff;
  }
  .alert {
    display: flex;
    align-items: center;
    border: 1px solid #446abd;
    background-color: #ebf1fd;
    flex: 1;
    margin-left: 10px;
  }
}
</style>
