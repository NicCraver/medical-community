<template>
  <el-collapse v-model="referralTableCollapse">
    <el-collapse-item title="接诊信息：" name="admissionsTable" v-if="showAdmissionsTable">
      <AdmissionsTable></AdmissionsTable>
    </el-collapse-item>
    <el-collapse-item title="审核信息：" name="reviewTable" v-if="showReviewTable">
      <ReviewTable ref="reviewTable"></ReviewTable>
    </el-collapse-item>
    <el-collapse-item title="申请信息：" name="applyTable">
      <ApplyTable :referralDetail="referralDetail"></ApplyTable>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import AdmissionsTable from './AdmissionsTable';
import ReviewTable from './ReviewTable';
import ApplyTable from './ApplyTable';

export default {
  props: {
    referralDetail: Object
  },
  data() {
    return {
      referralTableCollapse: ['applyTable']
    }
  },
  computed: {
    /*
      applyStatus 当前状态

      已退回 "0";
      待提交 "1";
      待审核 "2";
      待接诊 "3";
      已接诊 "4";
      已完成 "5";
      已关闭 "6";

      status 上一次状态
      等待提交 "0";
      提交完成 "1";
      审核完成 "2";
      接诊完成 "3";
      完成 "4";
      审核退回 "5";
      已关闭 "6";
    */
    showAdmissionsTable() {
      return this.referralDetail.applyStatus === '4' || this.referralDetail.applyStatus === '5';
    },
    showReviewTable() {
      return this.showAdmissionsTable || this.referralDetail.applyStatus === '3' || (this.referralDetail.applyStatus === '6' && this.referralDetail.status === '5')
    }
  },
  components: {
    ReviewTable,
    ApplyTable,
    AdmissionsTable
  },

}
</script>

<style lang="scss" scoped>
.el-collapse-item {
  margin-top: 20px;
  ::v-deep.el-collapse-item__content {
    padding-top: 0;
    overflow-x: auto;
  }
}
</style>
