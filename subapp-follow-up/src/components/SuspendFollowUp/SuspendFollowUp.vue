<template>
  <el-dialog title="中止随访任务原因" :visible="visible" :before-close="closeDialog">
    <el-radio-group v-model="suspendReasonCode" @change="handleRadioChange">
      <el-radio
        v-for="item in suspendReasons"
        :key="item.value"
        :label="item.value"
        :disabled="!suspendReasonCode"
      >
      {{ item.label }}
      <el-input
        v-model="otherReason"
        v-if="item.value === '09' && suspendReasonCode === '09'"
      />
    </el-radio>
    </el-radio-group>
    <div style="margin: 10px 0;">
      <el-checkbox v-model="checked" @change="handleCheckboxChange">中止该随访计划所有待办任务并关闭该随访计划</el-checkbox>
      <span v-if="checked">
        <el-select v-model="planReasonCode">
          <el-option
            v-for="item in planReasonList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input style="width: 200px;margin-left: 20px;" v-if="planReasonCode === '09'" v-model="planOtherReason" />
      </span>
    </div>

    <div class="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="terminationFollowUp">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { terminationFollowUp } from '@/api/modules/PatientCenter';
import { suspendReasons, planReasonList } from '@/utils/data-map';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    closeDialog: {
      type: Function,
      default: () => {}
    },
    suspendFollowParams: {
      type: Object,
      default() {
        return  {}
      }
    }
  },
  data() {
    return {
      suspendReasonCode: '1',
      suspendReasons: suspendReasons,
      otherReason: '',
      checked: false,
      planReasonCode: '03',
      planReasonList: planReasonList,
      planOtherReason: ''
    }
  },
  methods: {
    handleRadioChange(val) {
      if (val === '4' ) {
        this.inputDisabled = false;
      } else  {
        this.inputDisabled = true;
        this.otherReason = '';
      }
    },
    async terminationFollowUp() {
      try {
        let terminationReason = '';
        let terminationReasonCode = '';
        if (this.checked) {
          terminationReason = this.planReasonCode === '09' ? this.planOtherReason : this.planReasonList.find(item => item.value === this.planReasonCode).label;
          terminationReasonCode = this.planReasonCode;
        } else {
          terminationReason = this.suspendReasonCode === '09' ? this.otherReason : this.suspendReasons.find(item => item.value === this.suspendReasonCode).label;
          terminationReasonCode = this.suspendReasonCode;
        }
        if (!terminationReason.trim()) {
          this.$message.error('请输入中止原因');
          return;
        }
        const res = await terminationFollowUp({
          followupId: this.suspendFollowParams.followupId,
          allTermination: this.checked ? '1' : '0',
          terminationReasonCode: terminationReasonCode,
          terminationReason: terminationReason,
          planId: this.suspendFollowParams.planId,
          terminationUserId: sessionStorage.getItem("userId"),
          terminationUserName: sessionStorage.getItem("loginName")
        });
        if (res.code === 0) {
          this.$message.success("随访中止成功");
          this.closeDialog();
          this.$emit('terminationFollowUpSuccess');
        }
      } catch(error) {
        console.error(error);
      }
    },
    handleCheckboxChange() {
      if (this.checked) {
        this.suspendReasonCode = '';
      } else {
        this.suspendReasonCode = '01';
      }
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.suspendReasonCode =  '01';
        this.otherReason = '';
        this.checked = false;
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.footer {
  border-top: 1px solid #ccc;
  text-align: right;
  padding-top: 20px;
}
</style>

<style scoped>
>>> .el-input__inner{
  width: 200px;
  height: 24px;
}

>>> .el-select .el-input__inner{
  width: 120px;
  height: 24px;
  margin-left: 10px;
}

</style>
