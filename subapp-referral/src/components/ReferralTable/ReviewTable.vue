<template>
  <div>
    <table class="referral-table" v-if="auditInfo.auditStatus === '1'">
      <tr>
        <td class="width100">确认转诊日期：</td><td class="width100">{{ auditInfo.auditApplyDate }}</td>
        <td class="width100">确认转入机构：</td><td class="width100">{{ auditInfo.ackInHosName }}</td>
        <td class="width100">确认转入科室：</td><td class="width210">{{ auditInfo.auditDeptName }}</td>
        <td class="width100">确认接诊医生：</td><td class="width100">{{ auditInfo.auditReceiveDrName }}</td>
        <td class="width100">审核结果：</td><td class="width100 passed">通过</td>
      </tr>
      <tr>
        <td>备注信息：</td><td colspan="9">{{ auditInfo.remarkDesc }}</td>
      </tr>
      <tr>
        <td colspan="10" class="right" v-html="`操作人：${ auditInfo.auditUserName }    提交时间：${ auditInfo.auditDate }`"></td>
      </tr>
    </table>
    <table class="referral-table" v-else>
      <tr>
        <td style="width: 110px">审核结果：</td><td class="refuse">退回</td>
      </tr>
      <tr>
        <td>退回原因：</td><td>{{ auditInfo.returnReason }}</td>
      </tr>
      <tr>
        <td colspan="2" class="right" v-html="`操作人：${ auditInfo.auditUserName }    提交时间：${ auditInfo.auditDate }`"></td>
      </tr>
    </table>
  </div>
</template>

<script>
import { getAuditInfoById } from '@/api/modules/ReferralReview';

export default {
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
          applyId: this.$route.query.referralId
        });
        console.log('getAuditInfoById==', res)
        // auditStatus === '1' 通过
        this.auditInfo = res.result;
        this.$EVENT_BUS.$emit('auditInfoChange', this.auditInfo);
      } catch(err) {
        console.error(err);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import './referral-table.scss';
.refuse {
  color: #FFA940;
}
.passed {
  color: #4468BD;
}
</style>
