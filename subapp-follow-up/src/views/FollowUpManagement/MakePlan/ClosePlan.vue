<template>
  <el-dialog title="关闭原因" :visible="visible" :before-close="closeDialog" top="35vh">
    <el-radio-group v-model="reasonCode">
      <el-radio v-for="item in planReasonList" :key="item.value" :label="item.value">
        {{ item.label }}
        <el-input v-model="otherMsg" v-if="item.value === '09' && reasonCode === '09'" style="width: 180px" />
      </el-radio>
    </el-radio-group>
    <span slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="shutDownPlan">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { shutDownPlan } from '@/api/modules/PatientCenter';
import { planReasonList } from '@/utils/data-map';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    planId: {
      type: String,
      default: '',
    },
    closeDialog: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      planReasonList: planReasonList,
      reasonCode: '03',
      otherMsg: '',
    };
  },
  methods: {
    async shutDownPlan() {
      try {
        const terminationReason = this.reasonCode === '09' ? this.otherMsg : planReasonList.find((item) => item.value === this.reasonCode).label;
        if (!terminationReason.trim()) {
          this.$message.error('请输入关闭计划原因');
          return;
        }
        const res = await shutDownPlan({
          planId: this.planId,
          terminationReasonCode: this.reasonCode,
          terminationReason: this.reasonCode === '09' ? this.otherMsg : terminationReason,
          terminationUserId: sessionStorage.getItem("userId"),
          terminationUserName: sessionStorage.getItem("loginName")
        });
        this.$emit('submit');
      } catch (err) {
        console.error(err);
      }
    },
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.reasonCode = '';
        this.otherMsg = '';
      }
    },
    reasonCode(newVal) {
      if (newVal !== '09') {
        this.otherMsg = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
