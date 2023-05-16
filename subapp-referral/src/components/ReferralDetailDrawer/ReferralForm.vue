<template>
  <div class="referral-form">
    患者{{ referralDetail.name }}已于{{ admissionsInfo.admApplyDate }}成功转诊至{{ admissionsInfo.inHosName }}-{{ admissionsInfo.admDeptName }}
  </div>
</template>

<script>
export default {
  props: {
    referralDetail: Object,
    admissionsInfo: Object
  }
}
</script>

<style>
.referral-form {
  background: #f5f5f5;
  margin-bottom: 20px;
  padding: 5px 0 5px 8px;
}
</style>
