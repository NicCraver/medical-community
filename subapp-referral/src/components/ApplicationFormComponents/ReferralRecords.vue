<template>
  <div class="ReferralRecords">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <el-select v-model="queryParams.referralType" placeholder="转诊类型" clearable>
          <el-option label="上转" value="A"></el-option>
          <el-option label="下转" value="B"></el-option>
        </el-select>
        <el-select v-model="queryParams.temp" placeholder="转诊状态" clearable>
          <el-option label="待处理" value="0"></el-option>
          <el-option label="待接诊" value="1"></el-option>
          <el-option label="接诊完成" value="3"></el-option>
          <el-option label="转诊完成" value="4"></el-option>
          <el-option label="已关闭" value="33"></el-option>
        </el-select>
        <el-date-picker type="daterange" value-format="yyyy-MM-dd" start-placeholder="申请开始日期" end-placeholder="申请结束日期"
          range-separator="至" v-model="applyDate" clearable style="width: 350px" />
      </template>
      <template #actions>
        <el-button type="primary" @click="onInquire()">搜索</el-button>
        <el-button @click="resetQueryParams">重置</el-button>
      </template>

      <div class="empty" v-if="isEmpty">
        <el-empty :image-size="200" description="暂无转诊记录～"></el-empty>
      </div>
      <el-table v-else ref="singleTable" v-adaptive="{ bottomOffset: 65 }" height="0" :data="tableData" border
        v-loading="loading" row-key="id">
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="转诊状态" prop="statusDesc" width="80" /> -->
        <el-table-column label="转诊状态" width="100">
          <template slot-scope="scope">
            <div style="display: flex; align-items: center">
              <div>
                {{
                    scope.row.applyStatus === '0' || scope.row.applyStatus === '1' || scope.row.applyStatus === '2'
                      ? '待处理'
                      : scope.row.applyStatus === '3'
                        ? '待接诊'
                        : scope.row.applyStatus === '4'
                          ? '接诊完成'
                          : scope.row.applyStatus === '5'
                            ? '转诊完成'
                            : '已关闭'
                }}
              </div>
              <el-tooltip placement="top">
                <div slot="content">
                  <div v-if="scope.row.applyStatus === '0'">
                    <div>退回人： <span v-html="scope.row.auditUserName"></span></div>
                    <div>退回原因：{{ scope.row.returnReason }}</div>
                  </div>
                  <div v-if="scope.row.waitOtherStatus === 'GB'">
                    <div>撤回人： <span v-html="scope.row.goBackUserName"></span></div>
                    <div>撤回原因：{{ scope.row.goBackReason }}</div>
                  </div>
                  <div v-if="scope.row.waitOtherStatus === 'RE'">
                    <div>恢复人： <span v-html="scope.row.recoverUserName"></span></div>
                  </div>
                  <div v-if="scope.row.applyStatus === '6'">
                    <div>关闭人： <span v-html="scope.row.modUserName"></span></div>
                    <div>关闭原因：{{ scope.row.abortReason }}</div>
                  </div>
                </div>
                <IconSvg v-if="
                  scope.row.applyStatus === '0' ||
                  scope.row.waitOtherStatus === 'GB' ||
                  scope.row.applyStatus === '6'
                " iconClass="hint" width="14" style="margin: 0 0 0 5px; cursor: pointer;" />
                <i v-if="scope.row.waitOtherStatus === 'RE'" class="el-icon el-icon-warning-outline"
                  style="color: #27B148; margin-left: 5px"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="当前状态时间" prop="modDate" width="180" />
        <el-table-column label="转诊类型" prop="caseNo" width="80">
          <template slot-scope="{ row }">
            <span v-if="row.referralType === 'A'">上转</span>
            <span v-else>下转</span>
          </template>
        </el-table-column>
        <el-table-column label="门诊/住院号" prop="caseNo" width="130" />
        <el-table-column label="姓名" prop="patName" width="130" />
        <el-table-column label="性别" prop="sexDesc" width="50" />
        <el-table-column label="年龄" prop="refAge" width="70" />
        <el-table-column label="联系电话" prop="phoneNo" width="130" />
        <el-table-column label="转出机构" prop="outHosName" width="180" />
        <el-table-column label="转出科室" prop="outDeptName" width="260" />
        <el-table-column label="转诊医生" prop="applyDrName" width="130" />
        <el-table-column label="申请转诊日期" prop="applyDate" width="200" />
        <el-table-column label="提交时间" prop="submitDate" width="200" />
        <el-table-column label="转入机构" prop="inHosName" width="180" />
        <el-table-column label="转入科室" prop="inDeptName" width="200">
          <template slot-scope="{ row }">
            {{ row.applyStatus === '5' ? row.admDeptName : row.inDeptName }}
          </template>
        </el-table-column>
        <el-table-column label="接诊医生" prop="admReceiveDrName" width="130" />
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="{ row }">
            <el-button type="text" @click="fnExamine(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ProList>
    <ReferralDetailDrawer :visible.sync="referralDetailDrawerVis" :referralId="referralId"></ReferralDetailDrawer>
  </div>
</template>

<script>
import { ProList, ProLayout } from 'anx-vue'
import GroupSelect from '@/components/GroupAndHospital/GroupSelect'
import { onQueryPatients, onInitPatQueryParam, getReferralRecordInfo } from '@/api/modules/patientCenter'
import ReferralDetailDrawer from '@/components/ReferralDetailDrawer'
export default {
  components: { ProLayout, ProList, GroupSelect, ReferralDetailDrawer },
  data () {
    return {
      referralId: '',
      referralDetailDrawerVis: false,
      isEmpty: false,
      loading: false,
      tableData: [],
      queryParams: {},
      total: 0,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
      },
      applyDate: [],
      orgOrHosOptions: [],
      createUser: [],
    }
  },
  async created () {
    // this.queryParams.createUserId = sessionStorage.getItem('userId')
    this.queryParams.patId = this.$route.query.patId || ''
    this.onInitPatQueryParam()

    console.log('this.$route.query.hasData', this.$route.query.hasData)
    if (this.queryParams.patId) {
      this.onInquire()
    } else {
      this.isEmpty = true
    }
  },
  methods: {
    async onInquire () {
      if (!this.queryParams.patId) {
        this.isEmpty = true
        return
      }
      try {
        this.loading = true
        if (this.queryParams.temp === '') {
          this.$set(this.queryParams, 'referralStatus', '')
          this.$set(this.queryParams, 'status', '')
        }
        if (this.queryParams.temp === '0') {
          this.$set(this.queryParams, 'referralStatus', 0)
          this.$set(this.queryParams, 'status', '')
        }
        if (this.queryParams.temp === '1') {
          this.$set(this.queryParams, 'referralStatus', 1)
          this.$set(this.queryParams, 'status', '')
        }
        if (this.queryParams.temp === '3') {
          this.$set(this.queryParams, 'status', 3)
          this.$set(this.queryParams, 'referralStatus', '')
        }
        if (this.queryParams.temp === '4') {
          this.$set(this.queryParams, 'status', 4)
          this.$set(this.queryParams, 'referralStatus', '')
        }
        if (this.queryParams.temp === '33') {
          this.$set(this.queryParams, 'referralStatus', 3)
          this.$set(this.queryParams, 'status', '')
        }
        console.log('this.queryParams', this.queryParams)
        const res = await getReferralRecordInfo({
          ...this.queryParams,
          ...this.pageParams,
          applyDateS: this.applyDate ? (this.applyDate[0] ? this.applyDate[0] + ' 00:00:00' : '') : '',
          applyDateE: this.applyDate ? (this.applyDate[1] ? this.applyDate[1] + ' 23:59:59' : '') : '',
        })
        const { total, result } = res
        this.total = total
        result.forEach((el) => {
          for (let key in el) {
            if (!el[key]) {
              el[key] = '/'
            }
          }
        })
        this.tableData = result
        this.isEmpty = !result.length
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('error', error)
      }
    },
    // 查看
    fnExamine (row) {
      console.log('row', JSON.parse(JSON.stringify(row)))
      this.referralId = row.id
      this.referralDetailDrawerVis = true
    },
    fnReferral (row) {
      console.log('row', row)
    },
    fnTheStaging (row) {
      console.log('row', row)
    },
    async onInitPatQueryParam () {
      try {
        const res = await onInitPatQueryParam()
        this.createUser = res.result.createUser
        this.diagnoses = res.result.diagnoses
        this.nearOptUser = res.result.nearOptUser
      } catch (error) {
        console.error('error', error)
      }
    },
    // 新增转诊单
    addReferralForm () {
      this.$router.push({
        name: 'ReferralListDetail',
        query: {
          status: 'add',
        },
      })
    },
    // 重置
    resetQueryParams () {
      this.tableData = []
      this.queryParams = {}
      this.total = 0
      this.pageParams = {
        pageNum: 1,
        pageSize: 10,
      }
      this.applyDate = []
      this.queryParams.patId = this.$route.query.patId || ''
      this.onInquire()
    },
  },
}
</script>

<style lang="scss" scoped>
.ReferralRecords {
  margin: 10px;

  .empty {
    height: calc(100vh - 158px);
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

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
