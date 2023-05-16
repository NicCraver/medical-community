<template>
  <div class="process-step-container">
    <component
      :is="processComponent"
      :referralDetail="referralDetail"
      :auditInfo="auditInfo"
      :admInfo="admInfo"
    />
  </div>
</template>

<script>
import Process0 from './Process0';
import ProcessA from './ProcessA';
import ProcessB from './ProcessB';
import ProcessC from './ProcessC';
import ProcessD from './ProcessD';
import ProcessE from './ProcessE';
import ProcessF from './ProcessF';
import ProcessG from './ProcessG';
import ProcessH from './ProcessH';
export default {
  props: {
    referralDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    status: {
      type: String
    }
  },
  data() {
    return {
      auditInfo: {},
      admInfo: {}
    }
  },
  computed: {
    processComponent() {
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

      // A 已退回编辑进来 或者已撤回即待提交（不区分查看还是编辑）
      if(this.referralDetail.applyStatus === '1' || (this.referralDetail.applyStatus === '0' && this.$route.query.status === 'edit')) {
        return 'ProcessA'
      }

      // 审批流中的B、C是这里的B
      if (this.referralDetail.applyStatus === '2') {
        return 'ProcessB'
      }

      // 审批流中的D
      if (this.referralDetail.applyStatus === '3') {
        return 'ProcessC'
      }

      // 审批流中的E
      if (this.referralDetail.applyStatus === '4') {
        return 'ProcessD'
      }

      // 审批流中的F
      if (this.referralDetail.applyStatus === '5') {
        return 'ProcessE'
      }

      // 审批流中的G
      if(this.referralDetail.applyStatus === '0' && this.$route.query.status === 'examine') {
        return 'ProcessF'
      }

      // 审批流中的H
      if(this.referralDetail.applyStatus === '6' && this.referralDetail.status === '5') {
        return 'ProcessG'
      }

      // 审批流中的I
      if(this.referralDetail.applyStatus === '6' && this.referralDetail.status === '0') {
        return 'ProcessH'
      }

      // 已暂存
      return 'Process0'
    }
  },
  mounted() {
    this.$EVENT_BUS.$on('auditInfoChange', auditInfo => {
      this.auditInfo = auditInfo
    });
    this.$EVENT_BUS.$on('admInfoChange', admInfo => {
      this.admInfo = admInfo
    })
  },
  beforeDestroy() {
    this.$EVENT_BUS.$off(['auditInfoChange', 'admInfoChange']);
  },
  components: {
    Process0,
    ProcessA,
    ProcessB,
    ProcessC,
    ProcessD,
    ProcessE,
    ProcessF,
    ProcessG,
    ProcessH,
  }
}
</script>

<style lang="scss" scoped>
.process-step-container {
  background-color: #fff;
  padding: 10px 50px;
  margin-bottom: 10px;
}
</style>
