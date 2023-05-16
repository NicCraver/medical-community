<template>
  <div class="BackReviewList">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <el-input placeholder="患者姓名/门诊住院号" v-model="queryParams.searchValue" clearable />
        <ReferralSelect
          placeholder="转出机构"
          module="referralReview"
          type="HOS_OUT"
          :status="auditStatus"
          v-model="queryParams.outHosId"
          :orgId="queryParams.orgId"
          :hosId="queryParams.inHosId"
          :disabled="!queryParams.orgId"
        ></ReferralSelect>
        <ReferralSelect
          placeholder="转出科室"
          module="referralReview"
          type="DEPT_OUT"
          :status="auditStatus"
          :hosId="queryParams.outHosId"
          v-model="queryParams.outDept"
          :disabled="!queryParams.outHosId"
        ></ReferralSelect>
        <el-select placeholder="转诊类型" v-model="queryParams.referralType" clearable>
          <el-option label="上转" value="A" />
          <el-option label="下转" value="B" />
        </el-select>
        <ReferralSelect
          placeholder="退回人"
          module="referralReview"
          type="USER"
          :status="auditStatus"
          v-model="queryParams.auditUserId"
          :orgId="queryParams.orgId"
          :hosId="queryParams.inHosId"
        ></ReferralSelect>
        <el-select placeholder="退回原因" v-model="queryParams.returnReasonCode" clearable>
          <el-option
            v-for="item in returnReasons"
            :key="item.VALUE"
            :label="item.LABLE"
            :value="item.VALUE"
          />
        </el-select>
        <el-date-picker
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="申请开始日期"
          end-placeholder="申请结束日期"
          range-separator="至"
          v-model="queryParams.applyDate"
          clearable
          style="width: 410px"
        />
        <OrgHosSelect ref="orgRef" v-model="queryParams.orgId" placeholder="集团"></OrgHosSelect>
        <OrgHosSelect
          ref="hosRef"
          v-model="queryParams.inHosId"
          :parentId="queryParams.orgId"
          placeholder="转入机构"
        ></OrgHosSelect>
        <ReferralSelect
          placeholder="转入科室"
          module="referralReview"
          type="DEPT_IN"
          :status="auditStatus"
          v-model="queryParams.inDept"
          :hosId="queryParams.inHosId"
          :disabled="!queryParams.inHosId"
        ></ReferralSelect>
        <el-date-picker
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="退回开始日期"
          end-placeholder="退回结束日期"
          range-separator="至"
          v-model="queryParams.auditReturnDate"
          clearable
          style="width: 410px"
        />
      </template>
      <template #actions>
        <el-button type="primary" @click="onInquire">搜索</el-button>
        <el-button @click="resetQueryParams">重置</el-button>
      </template>
      <template #batchActions></template>
      <el-table
        ref="singleTable"
        v-adaptive="{ bottomOffset: 60 }"
        height="0"
        :data="reviewList"
        border
        v-loading="loading"
        row-key="id"
        :empty-text="emptyText"
      >
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableColumns"
          :key="index"
          :label="item.label"
          :min-width="item.width"
          :fixed="item.fixed"
          :show-overflow-tooltip="item.showOverflowTooltip"
        >
          <template slot-scope="{ row }">
            <template v-if="item.prop === 'oprate'">
              <el-button type="text" @click="openReferDetailDrawer(row)">查看</el-button>
            </template>
            <template v-else>
              {{ row[item.prop] }}
            </template>
          </template>
        </el-table-column>
      </el-table>
    </ProList>
  </div>
</template>

<script>
import { ProList } from 'anx-vue'
import { getAuditListInfo } from '@/api/modules/ReferralReview.js'
import reviewListMixin from './reviewList.mixin'
import { getDictionary } from '@/api/modules/patientCenter'

export default {
  name: 'BackReviewList',
  components: { ProList },
  mixins: [reviewListMixin],
  data() {
    return {
      auditStatus: '2',
      returnReasons: [],
      tableColumns: [
        {
          label: '退回时间',
          prop: 'auditDate',
          width: '220',
        },
        {
          label: '退回人',
          prop: 'auditUserNameDetail',
          width: '120',
        },
        {
          label: '退回原因',
          prop: 'returnReason',
          width: '200px',
          showOverflowTooltip: true,
        },
        {
          label: '转诊类型',
          prop: 'referralTypeDesc',
          width: '',
        },
        {
          label: '门诊/住院号',
          prop: 'caseNo',
          width: '100',
        },
        {
          label: '姓名',
          prop: 'patName',
          width: '140',
        },
        {
          label: '性别',
          prop: 'sexDesc',
          width: '60',
        },
        {
          label: '年龄',
          prop: 'refAge',
          width: '60',
        },
        {
          label: '联系电话',
          prop: 'phoneNo',
          width: '120',
        },
        {
          label: '转出机构',
          prop: 'outHosName',
          width: '180',
        },
        {
          label: '转出科室',
          prop: 'outDeptName',
          width: '140',
        },
        {
          label: '转诊医生',
          prop: 'applyDrName',
          width: '180',
        },
        {
          label: '申请转诊日期',
          prop: 'applyDate',
          width: '180',
        },
        {
          label: '提交时间',
          prop: 'submitDate',
          width: '180',
        },
        {
          label: '转入机构',
          prop: 'inHosName',
          width: '180',
        },
        {
          label: '转入科室',
          prop: 'inDeptName',
          width: '200',
        },
        {
          label: '操作',
          prop: 'oprate',
          width: '',
          fixed: 'right',
        },
      ],
    }
  },
  async mounted() {
    await this.getReturnReasons()
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
  },
  methods: {
    async getReturnReasons() {
      try {
        const res = await getDictionary({
          code: 'RETURN_REASON',
        })
        console.log('退回原因==', res)
        this.returnReasons = res.result
      } catch (err) {
        console.error(err)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.BackReviewList {
  ::v-deep .batch-actions {
    margin-top: 0;
  }
  .ProList {
    border-radius: 2px;
    padding: 10px;
    background-color: #fff;
  }
}
</style>
