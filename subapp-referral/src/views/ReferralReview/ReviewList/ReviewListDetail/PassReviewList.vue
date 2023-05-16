<template>
  <div class="PassReviewList">
    <ProList
      class="ProList"
      :pageParams="pageParams"
      :total="total"
      :onInquire="onInquire"
    >
      <template #header>
        <el-input
          placeholder="患者姓名/电话/门诊住院号"
          v-model="queryParams.searchValue"
          clearable
        />
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
          placeholder="通过人"
          module="referralReview"
          type="USER"
          :status="auditStatus"
          v-model="queryParams.auditUserId"
          :orgId="queryParams.orgId"
          :hosId="queryParams.inHosId"
        ></ReferralSelect>
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
        <!-- <ReferralSelect
          placeholder="集团"
          module="publicModule"
          type="ORG"
          status="Y"
          v-model="queryParams.orgId"
        ></ReferralSelect>
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
          v-model="queryParams.auditDeptId"
          :hosId="queryParams.inHosId"
          :disabled="!queryParams.inHosId"
        ></ReferralSelect>
        <ReferralSelect
          placeholder="接诊医生"
          module="referralReview"
          type="REC"
          :status="auditStatus"
          :hosId="queryParams.inHosId"
          :deptId="inDeptId"
          :deptType="inDeptType"
          v-model="queryParams.auditReceiveDrId"
        ></ReferralSelect>
        <el-date-picker
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="通过开始日期"
          end-placeholder="通过结束日期"
          range-separator="至"
          v-model="queryParams.auditDate"
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
            <span>{{
              scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize
            }}</span>
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
            </template>
            <template v-else-if="item.label === '接诊医生'">
              {{ row.status === '2' ? row.auditReceiveDrName : row.admReceiveDrName }}
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
import { ProList } from "anx-vue";
import reviewListMixin from './reviewList.mixin';

export default {
  name: "PassReviewList",
  components: { ProList },
  mixins: [reviewListMixin],
  data() {
    return {
      auditStatus: '1',
      tableColumns: [
        {
          label: "通过时间",
          prop: "auditDate",
          width: "140",
        },
        {
          label: "通过人",
          prop: "auditUserNameDetail",
          width: "120",
        },
        {
          label: "转诊类型",
          prop: "referralTypeDesc",
          width: "",
        },
        {
          label: "门诊/住院号",
          prop: "caseNo",
          width: "100",
        },
        {
          label: "姓名",
          prop: "patName",
          width: "180",
        },
        {
          label: "性别",
          prop: "sexDesc",
          width: "60",
        },
        {
          label: "年龄",
          prop: "refAge",
          width: "60",
        },
        {
          label: "联系电话",
          prop: "phoneNo",
          width: "120",
        },
        {
          label: "转出机构",
          prop: "outHosName",
          width: "180",
        },
        {
          label: "转出科室",
          prop: "outDeptName",
          width: "180",
        },
        {
          label: "转诊医生",
          prop: "applyDrName",
          width: "180",
        },
        {
          label: "申请转诊日期",
          prop: "applyDate",
          width: "120",
        },
        {
          label: "提交时间",
          prop: "submitDate",
          width: "180",
        },
        {
          label: "确认转入机构",
          prop: "ackInHosName",
          width: "180",
        },
        {
          label: "确认转入科室",
          prop: "auditDeptName",
          width: "180",
        },
        {
          label: "接诊医生",
          prop: "auditReceiveDrName",
          width: "180",
        },
        {
          label: "操作",
          prop: "oprate",
          width: "",
          fixed: "right",
        },
      ],
      loading: false,
    };
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
  },
};
</script>

<style lang="scss" scoped>
.PassReviewList {
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
