<template>
  <ProList class="ProList" :pageParams="pageParams" :total="total" :onInquire="onInquire">
    <template #header>
      <el-input placeholder="患者姓名/手机号/门诊号" v-model="queryParams.searchValue" clearable />
      <el-input placeholder="诊断" v-model="queryParams.icdName" clearable />
      <!-- <ReferralSelect
        placeholder="诊断"
        module="referralList"
        type="ICD"
        :status="referralStatus"
        v-model="queryParams.diagnoseCode"
      ></ReferralSelect> -->
      <el-select placeholder="关闭原因" v-model="queryParams.abortReasonCode" clearable>
        <el-option
          v-for="item in suspendReasons"
          :key="item.VALUE"
          :label="item.LABLE"
          :value="item.VALUE"
        />
      </el-select>
      <el-date-picker
        type="daterange"
        value-format="yyyy-MM-dd"
        start-placeholder="关闭开始日期"
        end-placeholder="关闭结束日期"
        range-separator="至"
        v-model="queryParams.abortDate"
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
      <!-- <ReferralSelect
        placeholder="集团"
        module="publicModule"
        type="ORG"
        status="Y"
        v-model="queryParams.orgId"
      ></ReferralSelect>
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
    <!-- <template #batchActions>
      <el-button @click="rebackReferral">批量恢复</el-button>
      <div class="alert" v-if="multipleSelection.length !== 0">
        <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
        <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
        <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
      </div>
    </template> -->
    <el-table
      ref="singleTable"
      :data="referralList"
      border
      v-loading="loading"
      row-key="id"
      v-adaptive="{ bottomOffset: 65 }"
      height="0"
      @selection-change="handleSelectionChange"
      :empty-text="emptyText"
    >
      <!-- <el-table-column
        type="selection"
        width="40"
        :reserve-selection="true"
        :selectable="(row) => row.status"
      /> -->
      <el-table-column label="序号" type="index" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关闭时间" prop="abortDate" width="160" />
      <el-table-column label="关闭原因" prop="abortReason" width="200px" show-overflow-tooltip />
      <el-table-column label="姓名" prop="patName" />
      <el-table-column label="性别" prop="sexDesc" width="60" />
      <el-table-column label="年龄" prop="refAge" width="70" />
      <el-table-column label="身份证号" prop="idNo" width="190" />
      <el-table-column label="联系电话" prop="phoneNo" width="160" />
      <el-table-column label="门诊/住院号" prop="caseNo" width="160" />
      <el-table-column label="诊断" prop="icdName" show-overflow-tooltip width="160" />
      <el-table-column label="转诊类型" prop="referralTypeDesc" />
      <el-table-column label="转诊医生" prop="applyDrName" width="160" />
      <el-table-column label="转出科室" prop="outDeptName" width="160" />
      <el-table-column label="申请转诊日期" prop="applyDate" width="160" />
      <el-table-column label="提交时间" prop="submitDate" :resizable="false" width="160" />
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="{ row }">
          <el-button type="text" @click="pageToReferralDetail('examine', row)">查看</el-button>
          <!-- <el-button type="text" @click="rebackReferral(row)">恢复</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </ProList>
</template>

<script>
import { ProList, IconSvg } from 'anx-vue'
import referralListMixin from './referralList.mixin'
import { batchRecoverRefInfo } from '@/api/modules/referralList'
import { getDictionary } from '@/api/modules/patientCenter'

export default {
  mixins: [referralListMixin],
  data() {
    return {
      referralStatus: '3',
      suspendReasons: [],
    }
  },
  async mounted() {
    await this.getSuspendReasons()
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    this.onInquire()
  },
  methods: {
    async getSuspendReasons() {
      try {
        const res = await getDictionary({
          code: 'ABORT_REASON',
        })
        console.log('关闭原因==', res)
        this.suspendReasons = res.result
      } catch (err) {
        console.error(err)
      }
    },
    rebackReferral(row) {
      if (!row.id) {
        if (!this.multipleSelection.length) {
          this.$message.warning('请至少选择一条需要恢复的数据')
          return
        }
      }
      this.$confirm('恢复后，请在待处理页面查看本条记录，确认要恢复吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const ids = row.id ? [row.id] : this.multipleSelection.map((item) => item.id)
        try {
          const res = await batchRecoverRefInfo({
            ids,
            recoverUserName: window.sessionStorage.getItem('loginName'),
          })
          this.$message.success('恢复成功')
          this.clearFun()
          this.onInquire()
        } catch (err) {
          console.error(err)
        }
      })
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
