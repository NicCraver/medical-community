<!--
  @description 转诊管理/接诊处理/已接诊
-->
<template>
  <div>
    <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
      <template #header>
        <el-input
          placeholder="患者姓名/手机号/门诊号"
          v-model="queryParams.searchValue"
          clearable
        />
        <ReferralSelect
          placeholder="转出机构"
          module="admissionsList"
          type="HOS_OUT"
          :status="admStatus"
          v-model="queryParams.outHosId"
          :orgId="queryParams.orgId"
          :hosId="queryParams.inHosId"
          :disabled="!queryParams.orgId"
        ></ReferralSelect>
        <ReferralSelect
          placeholder="转出科室"
          module="admissionsList"
          type="DEPT_OUT"
          :status="admStatus"
          :hosId="queryParams.outHosId"
          v-model="queryParams.outDept"
          :disabled="!queryParams.outHosId"
        ></ReferralSelect>
        <ReferralSelect
          placeholder="转诊医生"
          module="admissionsList"
          type="DR"
          :status="admStatus"
          :hosId="queryParams.outHosId"
          :deptId="outDeptId"
          :deptType="outDeptType"
          v-model="queryParams.applyDrId"
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
          v-model="queryParams.admHosId"
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
          module="admissionsList"
          type="HOS_IN"
          :status="admStatus"
          v-model="queryParams.admHosId"
          :orgId="queryParams.orgId"
          :disabled="!queryParams.orgId"
        ></ReferralSelect> -->
        <ReferralSelect
          placeholder="转入科室"
          module="admissionsList"
          type="DEPT_IN"
          :status="admStatus"
          v-model="queryParams.inDept"
          :hosId="queryParams.admHosId"
          :disabled="DEPT_IN_disabled"
        ></ReferralSelect>
        <ReferralSelect
          placeholder="接诊医生"
          module="admissionsList"
          type="REC"
          :status="admStatus"
          :hosId="queryParams.admHosId"
          :deptId="inDeptId"
          :deptType="inDeptType"
          v-model="queryParams.admReceiveDrId"
        ></ReferralSelect>
        <el-select placeholder="状态" v-model="queryParams.applyStatus" clearable>
          <el-option label="已完成" value="5" />
          <el-option label="已接诊" value="4" />
        </el-select>
        <el-date-picker
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="接诊开始日期"
          end-placeholder="接诊结束日期"
          range-separator="至"
          v-model="queryParams.admDate"
          clearable
          style="width: 410px"
        />
      </template>
      <template #actions>
        <el-button type="primary" @click="onInquire">搜索</el-button>
        <el-button @click="resetQueryParams">重置</el-button>
      </template>
      <el-table
        ref="singleTable"
        v-adaptive="{ bottomOffset: 70 }"
        height="0"
        :data="admissionsList"
        border
        v-loading="loading"
        :empty-text="emptyText"
      >
        <el-table-column label="序号" type="index" width="50">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="applyStatusDesc" width="80" />
        <el-table-column label="接诊时间" prop="admSubmitDate" width="160" />
        <el-table-column label="转入机构" prop="inHosName" width="150" />
        <el-table-column label="转入科室" prop="admDeptName" width="150" />
        <el-table-column label="接诊医生" prop="admReceiveDrName" width="80" />
        <el-table-column label="去向" prop="targetSourceName" width="80" />
        <el-table-column label="姓名" prop="patName" width="80" />
        <el-table-column label="性别" prop="sexDesc" width="50" />
        <el-table-column label="年龄" prop="refAge" width="80" />
        <el-table-column label="身份证号" prop="idNo" width="200" />
        <el-table-column label="联系电话" prop="phoneNo" width="130" />
        <el-table-column label="诊断" prop="icdName" width="120" show-overflow-tooltip />
        <el-table-column label="转诊类型" prop="referralTypeDesc" width="80" />
        <el-table-column label="转诊医生" prop="applyDrName" width="80" />
        <el-table-column label="转出科室" prop="outDeptName" width="100" />
        <el-table-column label="转出机构" prop="outHosName" width="150" />
        <el-table-column label="申请转诊日期" prop="applyDate" width="160" />
        <el-table-column label="提交时间" prop="submitDate" width="160" />
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="{ row }">
            <el-button type="text" @click="pageToAdmissionsListDetail('examine', row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </ProList>
  </div>
</template>

<script>
import { ProList } from 'anx-vue'
import admissionsListMixin from './admissionsList.mixin'

export default {
  components: { ProList },
  mixins: [admissionsListMixin],
  data() {
    return {
      admStatus: '1',
    }
  },
  methods: {
    // 查看
    showDetail(row) {},
  },
}
</script>

<style lang="scss" scoped>
.ProList {
  border-radius: 2px;
  padding: 10px;
  background-color: #fff;
  ::v-deep .batch-actions {
    margin-top: 0;
  }
}
</style>
