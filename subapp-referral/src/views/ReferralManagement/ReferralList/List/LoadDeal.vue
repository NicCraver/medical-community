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
        :orgId="queryParams.orgId"
        :hosId="queryParams.outHosId"
      ></ReferralSelect> -->
      <el-select placeholder="转诊类型" v-model="queryParams.referralType" clearable>
        <el-option label="上转" value="A" />
        <el-option label="下转" value="B" />
      </el-select>
      <el-select placeholder="状态" v-model="queryParams.applyStatus" clearable>
        <el-option label="待审核" value="2" />
        <el-option label="待提交" value="1" />
        <el-option label="已退回" value="0" />
      </el-select>
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
        :hosId="queryParams.outHosId"
        :status="referralStatus"
        :deptId="outDeptId"
        :deptType="outDeptType"
        v-model="queryParams.applyDrId"
        :disabled="!queryParams.outDept"
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
    </template>
    <template #actions>
      <el-button type="primary" @click="onInquire('btn-search')">搜索</el-button>
      <el-button @click="resetQueryParams">重置</el-button>
    </template>
    <template #batchActions>
      <el-button type="primary" @click="pageToBatchAction('recall')">批量撤回</el-button>
      <el-button @click="pageToBatchAction('suspend')">批量关闭</el-button>
      <div class="alert" v-if="multipleSelection.length !== 0">
        <IconSvg iconClass="prompt" width="18" style="margin: 0 5px 0 5px" />
        <div style="margin: 0 5px 0 5px">已选择 {{ multipleSelection.length }}项</div>
        <el-button type="text" @click="clearFun" style="margin: 0 5px 0 5px"> 清空 </el-button>
      </div>
    </template>
    <el-table
      ref="singleTable"
      :data="referralList"
      border
      v-loading="loading"
      row-key="id"
      @selection-change="handleSelectionChange"
      v-adaptive="{ bottomOffset: 65 }"
      height="0"
      :empty-text="emptyText"
    >
      <el-table-column type="selection" width="40" :reserve-selection="true" />
      <el-table-column label="序号" type="index" width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 + (pageParams.pageNum - 1) * pageParams.pageSize }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="modDate" width="160" />
      <el-table-column label="姓名" prop="patName" width="120" />
      <el-table-column label="性别" prop="sexDesc" width="60" />
      <el-table-column label="年龄" prop="refAge" width="70" />
      <el-table-column label="身份证号" prop="idNo" width="190" />
      <el-table-column label="联系电话" prop="phoneNo" width="140" />
      <el-table-column label="门诊/住院号" prop="caseNo" width="120" />
      <el-table-column label="诊断" prop="icdName" width="150" show-overflow-tooltip />
      <el-table-column label="状态" prop="applyStatusDesc" width="90px">
        <template slot-scope="{ row }">
          {{ row.applyStatusDesc }}
          <el-tooltip
            effect="dark"
            placement="top-start"
            v-if="
              row.waitOtherStatus === 'RE' ||
              row.waitOtherStatus === 'GB' ||
              row.applyStatusDesc === '已退回'
            "
          >
            <div
              slot="content"
              v-if="row.waitOtherStatus === 'RE'"
              v-html="`恢复人：${row.recoverUserName}`"
            ></div>
            <div
              slot="content"
              v-if="row.waitOtherStatus === 'GB'"
              v-html="`撤回人：${row.goBackUserName}<br />撤回原因：${row.goBackReason}`"
            ></div>
            <div
              slot="content"
              v-if="row.applyStatusDesc === '已退回'"
              v-html="`退回人：${row.auditUserName}<br />退回原因：${row.returnReason}`"
            ></div>
            <i
              class="el-icon el-icon-warning-outline"
              :style="{ color: row.waitOtherStatus === 'RE' ? '#27B148' : '#4468BD' }"
            ></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="转诊类型" prop="referralTypeDesc" />
      <el-table-column label="转诊医生" prop="applyDrName" width="140"  show-overflow-tooltip/>
      <el-table-column label="转出科室" prop="outDeptName" width="140" />
      <el-table-column label="转出机构" prop="outHosName" width="140" />
      <el-table-column label="申请转诊日期" prop="applyDate" width="160" />
      <el-table-column label="提交时间" prop="submitDate" :resizable="false" width="160" />
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="{ row }">
          <!-- 已退回 "0";
          待提交 "1";
          待审核 "2";
          待接诊 "3";
          已接诊 "4";
          已完成 "5";
          已关闭 "6"; -->
          <el-button type="text" @click="pageToReferralDetail('examine', row)">查看</el-button>
          <el-button
            type="text"
            @click="pageToReferralDetail('edit', row)"
            v-if="row.applyStatus !== '2'"
            >编辑</el-button
          >
          <el-button
            type="text"
            @click="openActionDialog('recall', row)"
            v-if="row.applyStatus === '2'"
            >撤回</el-button
          >
          <el-button
            type="text"
            @click="openActionDialog('suspend', row)"
            v-if="row.applyStatus !== '2'"
            >关闭</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <ActionDialog
      :visible.sync="actionDialogVisable"
      :mode="actionMode"
      :referralId="referralId"
      @actionSuccss="resetQueryParams"
      :referralRow="referralRow"
    ></ActionDialog>
  </ProList>
</template>

<script>
import { ProList, IconSvg } from 'anx-vue'
import referralListMixin from './referralList.mixin'
import ActionDialog from '../ActionDialog'

export default {
  mixins: [referralListMixin],
  props: {
    referralInfo: Object,
  },
  data() {
    return {
      actionDialogVisable: false,
      actionMode: '',
      referralStatus: '0',
      referralId: '',
      referralRow: {},
    }
  },
  async mounted() {
    await this.$refs.orgRef.init()
    await this.$refs.hosRef.init()
    const referralInfo = this.$route.params.referralInfo
    if (referralInfo) {
      for (const key in referralInfo) {
        this.$set(this.queryParams, key, referralInfo[key])
      }
      this.onInquire()
      delete this.$route.params.referralInfo
    }
    const tempName = this.$route.params.name
    if (tempName) {
      this.$set(this.queryParams, 'searchValue', tempName)
      this.onInquire()
    }
    this.onInquire()
  },
  methods: {
    openActionDialog(mode, row) {
      this.referralId = row.id
      this.actionMode = mode
      this.actionDialogVisable = true
      this.referralRow = row
    },
    pageToBatchAction(mode) {
      const referralList = this.multipleSelection.filter((item) => {
        return mode === 'recall' ? item.applyStatus === '2' : item.applyStatus !== '2'
      })
      console.log('referralList', referralList)
      if (!referralList || !referralList.length) {
        const message = mode === 'recall' ? '请至少勾选一条可撤回数据' : '请至少勾选一条可关闭数据'
        this.$message.warning(message)
        return
      }
      if (this.multipleSelection.length - referralList.length > 0) {
        this.$message.warning(
          `${mode === 'recall' ? '仅支持撤回待审核记录' : '仅支持关闭已退回记录'}，取消勾选${
            this.multipleSelection.length - referralList.length
          }条`,
        )
      }

      this.$router.push({
        name: 'ReferralBatchAction',
        query: {
          mode,
        },
        params: {
          referralList,
        },
      })
    },
  },
  watch: {
    referralInfo(newVal) {
      this.$set(this.queryParams, 'applyStatus', newVal.applyStatus)
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
    ActionDialog,
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
