<template>
  <table class="referral-table">
    <tr>
      <td class="width110">姓名：</td><td class="width100">{{ referralDetail.name }}</td>
      <td class="width110">性别：</td><td class="width100">{{ referralDetail.sexDesc }}</td>
      <td class="width110">门诊/住院：</td><td class="width120">{{ referralDetail.caseNo }}</td>
      <td class="width110">联系电话：</td><td class="width160">{{ referralDetail.phone }}</td>
      <td class="width100">医保类型：</td><td class="width160">{{ referralDetail.medicareTypeName }}</td>
    </tr>
    <tr>
      <td>身份证号：</td><td colspan="3">{{ referralDetail.idNo }}</td>
      <td>联系地址：</td><td colspan="5">{{ referralDetail.addressName }}</td>
    </tr>
    <tr>
      <td>转诊类型：</td><td>{{ referralDetail.referralType === 'A' ? '上转' : '下转' }}</td>
      <td>申请转诊日期：</td><td>{{ referralDetail.applyDate }}</td>
      <td>转出机构：</td><td>{{ referralDetail.outHosName }}</td>
      <td>转出科室：</td><td>{{ referralDetail.outDeptName }}</td>
      <td>转诊医生：</td><td>{{ referralDetail.applyDrName }}</td>
    </tr>
    <!-- <tr>
      <td>转诊目标：</td><td colspan="9">{{ referralDetail.referralGoal }}</td>
    </tr> -->
    <tr>
      <td>诊断：</td><td colspan="9">{{ referralDetail.diagnosis }}</td>
    </tr>
    <tr>
      <td>现病史：</td><td colspan="9">{{ referralDetail.hpi }}</td>
    </tr>
    <tr>
      <td>既往史：</td><td colspan="9">{{ referralDetail.pastHistory }}</td>
    </tr>
    <tr>
      <td>治疗经过：</td><td  colspan="9">{{ referralDetail.treatment }}</td>
    </tr>
    <tr>
      <td>治疗方案：</td><td  colspan="9">{{ referralDetail.curePlan }}</td>
    </tr>
    <tr>
      <td>注意事项：</td><td  colspan="9">{{ referralDetail.notice }}</td>
    </tr>
    <tr>
      <td>转入机构：</td><td colspan="3">{{ referralDetail.inHosName }}</td>
      <td>转入科室：</td><td colspan="3">{{ referralDetail.inDeptName }}</td>
      <td>接诊医生：</td><td>{{ referralDetail.receiveDrName }}</td>
    </tr>
    <tr>
      <td colspan="10" class="right" v-html="`操作人：${referralDetail.createAllName}  提交时间：${referralDetail.submitDate}`"></td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    referralDetail: Object
  }
}
</script>

<style lang="scss" scoped>
@import './referral-table.scss';
</style>
