<template>
  <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
    <template #header>
      <el-input placeholder="患者姓名/手机号/门诊号" v-model="queryParams.searchValue" clearable />
      <ReferralSelect
        placeholder="转入机构"
        module="referralList"
        type="HOS_IN"
        :status="referralStatus"
        v-model="queryParams.inHosId"
        :orgId="queryParams.orgId"
        :hosId="queryParams.outHosId"
        :disabled="!queryParams.orgId"
      ></ReferralSelect>
      <ReferralSelect
        placeholder="转入科室"
        module="referralList"
        type="DEPT_IN"
        :status="referralStatus"
        v-model="queryParams.inDept"
        :hosId="queryParams.inHosId"
        :disabled="!queryParams.inHosId"
      ></ReferralSelect>
      <el-date-picker
        type="daterange"
        value-format="yyyy-MM-dd"
        start-placeholder="审核开始日期"
        end-placeholder="审核结束日期"
        range-separator="至"
        v-model="queryParams.auditDate"
        clearable
        style="width: 410px"
      />
      <OrgHosSelect ref="orgRef" v-model="queryParams.orgId" placeholder="集团"></OrgHosSelect>
      <OrgHosSelect
        ref="hosRef"
        v-model="queryParams.outHosId"
        :parentId="queryParams.orgId"
        placeholder="转出机构"
      ></OrgHosSelect>
      <!-- <ReferralSelect placeholder="集团" module="publicModule" type="ORG" status="Y" v-model="queryParams.orgId"></ReferralSelect>
      <ReferralSelect
        placeholder="转出机构"
        module="referralList"
        type="HOS_OUT"
        :status="referralStatus"
        v-model="queryParams.outHosId"
        :orgId="queryParams.orgId"
        :disabled="!queryParams.orgId"
      ></ReferralSelect> -->
      <ReferralSelect
        placeholder="转出科室"
        module="referralList"
        type="DEPT_OUT"
        :status="referralStatus"
        :hosId="queryParams.outHosId"
        v-model="queryParams.outDept"
        :disabled="!queryParams.outHosId"
      ></ReferralSelect>
      <ReferralSelect
        placeholder="转诊医生"
        module="referralList"
        type="DR"
        :status="referralStatus"
        :hosId="queryParams.outHosId"
        :deptId="outDeptId"
        :deptType="outDeptType"
        v-model="queryParams.applyDrId"
        :disabled="!queryParams.outDept"
      ></ReferralSelect>
      <el-date-picker
        type="daterange"
        value-format="yyyy-MM-dd"
        start-placeholder="申请转诊开始日期"
        end-placeholder="申请转诊结束日期"
        range-separator="至"
        v-model="queryParams.applyDate"
        clearable
        style="width: 410px"
      />
    </template>
    <template #actions>
      <el-button type="primary" @click="onInquire('btn-search')">搜索</el-button>
      <el-button @click="resetQueryParams">重置</el-button>
    </template>
    <el-table
      ref="singleTable"
      :data="referralList"
      border
      v-loading="loading"
      row-key="userId"
      v-adaptive="{ bottomOffset: 65 }"
      height="0"
      :empty-text="emptyText"
    >
      <el-table-column label="序号" type="index" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" prop="auditDate" width="160" />
      <el-table-column label="确认转入机构" prop="ackInHosName" width="170" />
      <el-table-column label="确认转入科室" prop="auditDeptName" width="170" />
      <el-table-column label="姓名" prop="patName" />
      <el-table-column label="性别" prop="sexDesc" width="70" />
      <el-table-column label="年龄" prop="refAge" width="70" />
      <el-table-column label="身份证号" prop="idNo" width="190" />
      <el-table-column label="联系电话" prop="phoneNo" width="160" />
      <el-table-column label="门诊/住院号" prop="caseNo" width="160" />
      <el-table-column label="诊断" prop="icdName" show-overflow-tooltip width="160" />
      <el-table-column label="转诊类型" prop="referralTypeDesc" />
      <el-table-column label="转诊医生" prop="applyDrName" />
      <el-table-column label="转出科室" prop="outDeptName" width="160" />
      <el-table-column label="转出机构" prop="outHosName" width="160" />
      <el-table-column label="申请转诊日期" prop="applyDate" width="140" />
      <el-table-column label="提交时间" prop="submitDate" :resizable="false" width="160" />
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="{ row }">
          <el-button type="text" @click="pageToReferralDetail('examine', row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </ProList>
</template>

<script>
import { ProList, IconSvg } from 'anx-vue'
import referralListMixin from './referralList.mixin'

export default {
  props: {
    referralInfo: Object,
  },
  mixins: [referralListMixin],
  data() {
    return {
      referralStatus: '1',
    }
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
  },
  watch: {
    referralInfo() {
      this.$set(this.queryParams, 'auditDate', referralInfo.auditDate)
      this.pageParams = {
        pageSize: 10,
        pageNum: 1,
      }
      this.onInquire()
    },
  },
  components: {
    ProList,
    IconSvg,
  },
}
</script>

<style lang="scss" scoped>
.ProList {
  border-radius: 2px;
  padding: 10px;
  background-color: #fff;
}
</style>
