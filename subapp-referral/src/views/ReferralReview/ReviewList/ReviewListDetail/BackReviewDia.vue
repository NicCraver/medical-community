<template>
  <div class="BackReviewDia">
    <ProDialog
      title="审核退回"
      width="520px"
      :before-close="handleResetClose"
      :close-on-click-modal="false"
      top="30vh"
      v-bind="$attrs"
      :visible="visible"
    >
    <div class="title">患者：{{ referralDetail.patName || referralDetail.name }} {{ referralDetail.sexDesc }} {{ referralDetail.age && referralDetail.age.indexOf('岁') > -1 ? referralDetail.age : `${referralDetail.age}岁` }}</div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="退回原因：" prop="reason" label-width="100px">
          <el-input
            type="textarea"
            v-model="form.reason"
            clearable
            maxlength="200"
            show-word-limit
            :rows="3"
            style="width: 100%"
            @input="handleInput"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="">
          <div class="reason-title">您可以选择以下原因</div>
          <el-row :gutter="10">
            <el-col
              :span="8"
              v-for="(item, index) in notReasons"
              :key="index"
            >
              <div class="reson-item" @click="changeReasons(item)">
                {{ item.LABLE }}
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleResetClose">取 消</el-button>
        <el-button type="primary" @click="submitForm()"> 确认退回 </el-button>
      </template>
    </ProDialog>
  </div>
</template>

<script>
import { ProList, ProDialog } from "anx-vue";
import { auditPassOrRefuse } from '@/api/modules/ReferralReview';
import { getDictionary } from '@/api/modules/patientCenter';

export default {
  name: "BackReviewDia",
  components: { ProList, ProDialog },
  props: {
    referralDetail: Object,
    visible: Boolean
  },
  data() {
    return {
      rules: {
        reason: [
          { required: true, message: "请输入退回原因", trigger: "blur" },
        ],
      },
      form: {
        reason: ''
      },
      lastReason: {},
      notReasons: [],
      resultReason: {}
    };
  },
  async created() {},
  methods: {
    changeReasons(v) {
      if(!this.form.reason) {
        this.resultReason = v;
        this.form.reason = this.form.reason + v.LABLE + ';'
      } else {
        const label = this.form.reason + v.LABLE + ';'
        if (label.length <= 200) {
          this.resultReason = {
            LABLE: this.form.reason + v.LABLE + ';',
            VALUE: this.lastReason.VALUE
          }
          this.form.reason = this.form.reason + v.LABLE + ';'
        }
      }
    },
    handleInput() {
      this.resultReason = {
        LABLE: this.form.reason,
        VALUE: this.lastReason.VALUE
      }
    },
    handleResetClose() {
      this.$emit('update:visible', false);
    },
    submitForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const res = await auditPassOrRefuse({
              auditId: this.referralDetail.auditId,
              auditType: '0',
              auditUserId: window.sessionStorage.getItem('userId'),
              auditUserName: window.sessionStorage.getItem('headerLoginName'),
              returnReason: this.resultReason.LABLE,
              returnReasonCode: this.resultReason.VALUE,
            });
            console.log('auditPassOrRefuse==', res);
            this.$message.success('审核退回成功');
            this.handleResetClose();
            this.$emit('reload');
          } catch(err) {
            console.error(err);
          }
        }
      });
    },
    async getReturnReasons() {
      try {
        const res = await getDictionary({
          code: 'RETURN_REASON'
        });
        console.log('退回原因==', res);
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
      this.form.reason = '';
      if(newVal) {
        console.log('this.referralDetail', this.referralDetail)
        this.getReturnReasons();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.BackReviewDia {
  .title {
    background-color: #F5F5F5;
    color: #101010;
    margin-bottom: 20px;
    padding: 5px;
  }
  ::v-deep.el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    padding: 15px !important;
  }
  ::v-deep.ProDialog .title:before {
    content: "";
    position: absolute;
    left: -15px;
    width: 4px;
    border-radius: 0 1px 1px 0;
    height: 20px;
    background-color: #134796;
  }
  .reason-title {
    margin-bottom: 10px;
    color: rgba(90, 90, 90, 100);
    font-size: 14px;
    font-family: SourceHanSansSC-regular;
  }
  .reson-item {
    height: 32px;
    line-height: 32px;
    background-color: rgba(245, 245, 245, 100);
    color: rgba(48, 49, 51, 100);
    font-size: 14px;
    text-align: center;
    font-family: Roboto;
    cursor: pointer;
    margin-bottom: 10px
  }
}
</style>
