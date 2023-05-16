<template>
  <el-dialog
    :title="mode === 'suspend' ? '关闭' : '撤回'"
    :visible="visible"
    class="action-dialog"
    :before-close="handleClose"
  >
    <div class="title">患者：{{ referralRow.patName || referralRow.name }} {{ referralRow.sexDesc }} {{ referralRow.age }}</div>
    <div class="reason-container">
      <el-form :model="noForm" :rules="noFormRules" ref="noFormRef" label-width="120px" class="form">
        <el-form-item :label="`${mode === 'suspend' ? '关闭' : '撤回'}原因:`" prop="reason">
          <el-input
            type="textarea"
            v-model="noForm.reason"
            :rows="3"
            show-word-limit
            maxlength="200"
            @input="handleInput"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="reason">
        <div>您可以选择以下原因</div>
        <div class="reasons">
          <div
            v-for="v in notReasons"
            @click="changeReasons(v)"
            :key="v.VALUE"
          >{{ v.LABLE }}</div>
        </div>
      </div>
    </div>
    <template #footer>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm"> 保存 </el-button>
      </template>
  </el-dialog>
</template>

<script>
import { batchGoBackReferralInfo, batchAbortRefInfo } from '@/api/modules/referralList';
import { getDictionary } from '@/api/modules/patientCenter';

export default {
  props: {
    visible: Boolean,
    mode: String,
    referralId: String,
    referralRow: Object
  },
  data() {
    return {
      noForm: {
        reason: ''
      },
      resultReason: {},
      lastReason: {},
      notReasons: [],
      noFormRules: {
        reason: [
          { required: true, message: '请输入原因', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    changeReasons(v) {
      if(!this.noForm.reason) {
        this.resultReason = v;
        this.noForm.reason = this.noForm.reason + v.LABLE + ';'
      } else {
        const label = this.noForm.reason + v.LABLE + ';'
        if (label.length <= 200) {
          this.resultReason = {
            LABLE: this.noForm.reason + v.LABLE + ';',
            VALUE: this.lastReason.VALUE
          }
          this.noForm.reason = this.noForm.reason + v.LABLE + ';'
        }
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleInput() {
      this.resultReason = {
        LABLE: this.noForm.reason,
        VALUE: this.lastReason.VALUE
      }
    },
    submitForm() {
      this.$refs.noFormRef.validate(async valid => {
        if(valid) {
          try {
            const res = this.mode === 'suspend' ? await batchAbortRefInfo({
              ids: [this.referralId],
              abortReason: this.resultReason.LABLE,
              abortReasonCode: this.resultReason.VALUE,
              modUserId: window.sessionStorage.getItem('userId'),
            }) : await batchGoBackReferralInfo({
              ids: [this.referralId],
              goBackReason: this.resultReason.LABLE,
              goBackReasonCode: this.resultReason.VALUE,
              modUserId: window.sessionStorage.getItem('userId'),
              goBackUserName: sessionStorage.getItem('headerLoginName')
            });
            console.log('submitForm==', res);
            const mes = this.mode === 'suspend' ? '关闭成功' : '撤回成功';
            this.$message.success(mes);
            this.handleClose();
            this.$emit('actionSuccss')
          } catch(err) {
            console.error(err);
          }
        }
      })
    },
    async getSuspendReasons() {
      try {
        const res = await getDictionary({
          code: this.mode === 'suspend' ? 'ABORT_REASON' : 'GOBACK_REASON'
        });
        console.log('关闭原因==', res);
        this.notReasons = res.result.slice(0, res.result.length - 1);
        this.lastReason = res.result[res.result.length - 1]
        console.log(this.lastReason)
      } catch(err) {
        console.error(err);
      }
    },
  },
  watch: {
    visible(newVal) {
      this.noForm.reason = '';
      if(newVal) {
        this.getSuspendReasons();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.action-dialog {
  .title {
    background-color: #F5F5F5;
    color: #101010;
    margin-bottom: 20px;
    padding: 5px;
  }
  .reasons {
    display: flex;
    flex-wrap: wrap;
    div {
      cursor: pointer;
      margin: 10px 10px 0 0;
      padding: 0 20px;
      height: 32px;
      line-height: 32px;
      background-color: rgba(245, 245, 245, 100);
      font-size: 14px;
      text-align: center;
    }
  }
}
</style>
