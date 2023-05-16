<template>
  <div class="ReferralList">
    <ProLayout mainBgColor="#F5F5F5" padding="0">
      <template #title>{{ mode === 'suspend' ? '批量关闭' : '批量撤回'}}</template>
      <template #main>
        <el-table
          ref="singleTable"
          :data="referralList"
          border
          v-loading="loading"
          v-adaptive="{ bottomOffset: 320 }" :height="height"
        >
          <el-table-column label="姓名" prop="patName" />
          <el-table-column label="性别" prop="sexDesc"/>
          <el-table-column label="年龄" prop="age" />
          <el-table-column label="身份证号" prop="idNo" />
          <el-table-column label="联系电话" prop="phoneNo" />
          <el-table-column label="门诊/住院号" prop="caseNo" />
          <el-table-column label="诊断" prop="icdName" />
          <el-table-column label="状态" prop="applyStatusDesc" />
          <el-table-column label="转诊类型" prop="referralTypeDesc" />
          <el-table-column label="转诊医生" prop="applyDrName" />
          <el-table-column label="转出科室" prop="outDeptName" />
          <el-table-column label="申请转诊日期" prop="applyDate" />
          <el-table-column label="提交时间" prop="submitDate" />
        </el-table>
        <div class="reason-container">
          <div class="center">
            <el-form :model="noForm" :rules="noFormRules" ref="noFormRef" label-width="120px" class="form">
              <el-form-item :label="`${mode === 'suspend' ? '关闭' : '撤回'}原因:`" prop="reason">
                <el-input
                  type="textarea"
                  v-model="noForm.reason"
                  show-word-limit
                  :rows="3"
                  maxlength="200"
                  @input="handleInput"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="reason">
              <div>您可以选择以下原因</div>
              <div class="reasons">
                <div v-for="v in notReasons" @click="changeReasons(v)">
                  {{ v.LABLE }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button @click="$router.go(-1)">取 消</el-button>
          <el-button type="primary" @click="submitForm"> 确 定 </el-button>
        </div>
      </template>
    </ProLayout>
  </div>
</template>

<script>
import { ProLayout } from 'anx-vue';
import { batchGoBackReferralInfo, batchAbortRefInfo } from '@/api/modules/referralList';
import { getDictionary } from '@/api/modules/patientCenter';

export default {
  data() {
    return {
      mode: '',
      height: window.innerHeight - 140 - 500,
      loading: false,
      referralList: [],
      noForm: {
        reason: ''
      },
      notReasons: [],
      noFormRules: {
        reason: [
          { required: true, message: '请输入原因', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.mode = this.$route.query.mode;
    this.referralList = this.$route.params.referralList;
    this.getSuspendReasons();
  },
  methods: {
    async submitForm() {
      try {
        const ids = this.referralList.map(item => item.id);
        const res = this.mode === 'suspend' ? await batchAbortRefInfo({
          ids,
          abortReason: this.resultReason.LABLE,
          abortReasonCode: this.resultReason.VALUE,
          modUserId: window.sessionStorage.getItem('userId'),
        }) : await batchGoBackReferralInfo({
          ids,
          goBackReason: this.resultReason.LABLE,
          goBackReasonCode: this.resultReason.VALUE,
          modUserId: window.sessionStorage.getItem('userId'),
          goBackUserName: window.sessionStorage.getItem('loginName')
        });
        console.log('submitForm==', res);
        const mes = this.mode === 'suspend' ? '批量关闭成功' : '批量撤回成功';
        this.$message.success(mes);
        this.$router.go(-1);
      } catch(err) {
        console.error(err);
      }
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
    handleInput() {
      this.resultReason = {
        LABLE: this.noForm.reason,
        VALUE: this.lastReason.VALUE
      }
    },
  },
  components: {
    ProLayout
  }
}
</script>

<style lang="scss" scoped>
.ReferralList {
  .reason-container {
    margin-top: 35px;
    background: #fff;
    padding: 20px 0;
    .center {
      width: 470px;
      margin: 0 auto;
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
  .footer {
    padding: 15px 30px 15px 0;
    background: #fff;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    bottom: 0;
    left: 208px;
    right: 0;
  }
}
</style>
