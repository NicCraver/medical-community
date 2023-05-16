<template>
  <table class="referral-table">
    <tr>
      <td class="width110">去向：</td><td class="width100">{{ admissionsInfo.targetSourceName }}</td>
      <td class="width110">确认接诊时间：</td><td class="width210">{{ admissionsInfo.admApplyDate }}</td>
      <td class="width120">确认转入科室：</td><td class="width270">{{ admissionsInfo.admDeptName }}</td>
      <td class="width110">确认接诊医生：</td><td class="width160">{{ admissionsInfo.admReceiveDrName }}</td>
    </tr>
    <tr>
      <td class="width120">确认接诊机构：</td><td class="width270">{{ admissionsInfo.ackAdmHosName }}</td>
      <td>备注信息：</td><td colspan="7">{{ admissionsInfo.remarkDesc }}</td>
    </tr>
    <tr>
      <td colspan="8" class="right" v-html="`操作人：${ admissionsInfo.createUserName }  提交时间：${ admissionsInfo.admSubmitDate }`"></td>
    </tr>
  </table>
</template>

<script>
import { getAdmissionsInfoById } from '@/api/modules/admissions';
export default {
  data() {
    return {
      admissionsInfo: {}
    }
  },
  mounted() {
    this.getAdmissionsInfoById();
  },
  methods: {
    async getAdmissionsInfoById() {
      try {
        const res = await getAdmissionsInfoById({
          applyId: this.$route.query.referralId
        });
        console.log('getAdmissionsInfoById==', res);
        this.admissionsInfo = res.result;
        this.$EVENT_BUS.$emit('admInfoChange', this.admissionsInfo);
      } catch(err) {
        console.error(err);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './referral-table.scss';
</style>
