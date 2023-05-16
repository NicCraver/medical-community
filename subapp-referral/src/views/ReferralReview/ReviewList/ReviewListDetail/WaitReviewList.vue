<template>
  <div class="WaitReviewList">
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <el-input
          placeholder="患者姓名/电话/门诊住院号"
          v-model="queryParams.searchValue"
          clearable
        />
        <ReferralSelect
          ref="outHosRef"
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
          ref="outDeptRef"
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
        <!-- <ReferralSelect placeholder="集团" module="publicModule" type="ORG" status="Y" v-model="queryParams.orgId"></ReferralSelect>
        <ReferralSelect
          placeholder="转入机构"
          module="referralReview"
          type="HOS_IN"
          :status="auditStatus"
          v-model="queryParams.inHosId"
          :orgId="queryParams.orgId"
          :disabled="!queryParams.orgId"
        ></ReferralSelect> -->
        <ReferralSelect
          placeholder="转入科室"
          module="referralReview"
          type="DEPT_IN"
          :status="auditStatus"
          v-model="queryParams.inDept"
          :hosId="queryParams.inHosId"
          :disabled="!queryParams.inHosId"
        ></ReferralSelect>
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
        >
          <template slot-scope="{ row }">
            <template v-if="item.prop === 'oprate'">
              <el-button type="text" @click="openReferDetailDrawer(row)">查看</el-button>
              <el-button type="text" @click="onPass(row, row.id)">通过</el-button>
              <el-button type="text" @click="onBack(row, row.id)">退回</el-button>
            </template>
            <template v-else>
              {{ row[item.prop] }}
            </template>
          </template>
        </el-table-column>
      </el-table>
    </ProList>
    <BackReviewDia
      :visible.sync="passReviewDiaVis"
      :referralDetail="referralDetail"
      @reload="reload"
    ></BackReviewDia>
    <PassReviewDia
      :isReady.sync="isReady"
      :referralDetail="referralDetail"
      @reload="reload"
    ></PassReviewDia>
  </div>
</template>

<script>
import { ProList } from 'anx-vue'
import reviewListMixin from './reviewList.mixin'
import PassReviewDia from './PassReviewDia'
import BackReviewDia from './BackReviewDia'

export default {
  name: 'WaitReviewList',
  props: {
    referralInfo: Object,
  },
  components: {
    ProList,
    PassReviewDia,
    BackReviewDia,
  },
  mixins: [reviewListMixin],
  data() {
    return {
      auditStatus: '0',
      tableColumns: [
        {
          label: '申请转诊日期',
          prop: 'applyDate',
          width: '140',
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
          width: '220',
        },
        {
          label: '申请次数',
          prop: 'applyNum',
          width: '',
        },
        {
          label: '操作',
          prop: 'oprate',
          width: '180',
          fixed: 'right',
        },
      ],
      isReady: false,
      referralDetail: {},
      passReviewDiaVis: false,
    }
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    const referralInfo = this.$route.params.referralInfo
    if (referralInfo) {
      this.$set(this.queryParams, 'searchValue', referralInfo.caseNo)
      this.onInquire()
      this.openReferDetailDrawer(referralInfo)
      delete this.$route.params.referralInfo
    }
    this.onInquire()
  },
  methods: {
    onPass(row, auditId) {
      this.referralDetail = row
      console.log('this.referralDetail1111', this.referralDetail)
      if (auditId) {
        this.referralDetail.auditId = auditId
      }
      this.isReady = true
    },
    onBack(row, auditId) {
      this.referralDetail = row
      if (auditId) {
        this.referralDetail.auditId = auditId
      }
      this.passReviewDiaVis = true
    },
  },
  watch: {
    referralInfo: {
      // immediate: true,
      handler(newVal) {
        this.$set(this.queryParams, 'searchValue', newVal.caseNo)
        this.pageParams = {
          pageSize: 10,
          pageNum: 1,
        }
        this.onInquire()
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.WaitReviewList {
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
