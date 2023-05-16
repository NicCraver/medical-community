<template>
  <div>
    <el-form disabled label-width="120px" v-if="auditInfo.auditStatus === '1'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="确认转诊日期：">
            <el-input v-model="auditInfo.auditApplyDate" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认接诊医生：">
            <el-input v-model="auditInfo.auditReceiveDrName" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="确认转入机构：">
            <el-input v-model="auditInfo.ackInHosName" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="确认转入科室：">
            <el-input v-model="auditInfo.auditDeptName" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注信息：">
            <el-input v-model="auditInfo.remarkDesc" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form disabled label-width="120px" v-else>
      <el-row>
        <el-col :span="12">
          <el-form-item label="退回时间：">
            <el-input v-model="auditInfo.auditDate" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退回人：">
            <el-input v-model="auditInfo.auditUserName" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="退回原因：">
            <el-input v-model="auditInfo.returnReason" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getAuditInfoById } from '@/api/modules/ReferralReview';

export default {
  props: {
    referralId: String
  },
  data() {
    return {
      auditInfo: {}
    }
  },
  mounted() {
    this.getAuditInfoById();
  },
  methods: {
    async getAuditInfoById() {
      try {
        const res = await getAuditInfoById({
          applyId: this.referralId
        });
        console.log('getAuditInfoById==', res)
        this.auditInfo = {
          ...res.result,
          auditUserName: res.result.auditUserName.replace(/&gt;/g, '>')
        };
      } catch(err) {
        console.error(err);
      }
    },
  },
  watch: {
    referralId() {
      this.getAuditInfoById();
    }
  }
}
</script>
