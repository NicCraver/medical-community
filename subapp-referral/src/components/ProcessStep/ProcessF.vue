<template>
  <div class="process-step">
    <ProDialog
      title="退回记录"
      width="520px"
      :close-on-click-modal="false"
      top="30vh"
      v-bind="$attrs"
      :visible.sync="visible"
    >
      <el-form disabled label-width="90px">
        <el-form-item label="退回时间：">
          <el-input v-model="auditDetail.auditDate" />
        </el-form-item>
        <el-form-item label="退回人：">
          <el-input v-model="auditDetail.auditUserName" />
        </el-form-item>
        <el-form-item label="退回原因：">
          <el-input type="textarea" :rows="3" v-model="auditDetail.returnReason" />
        </el-form-item>
      </el-form>
    </ProDialog>
    <div class="step-item">
      <div class="title">
        <div class="avatar completed">1</div>
        <div class="text">提交完成</div>
      </div>
      <div class="desc">
        <p class="main">{{ referralDetail.createUserName }} {{ referralDetail.submitDate }}</p>
        <div class="supply" v-if="referralDetail.applyNum !== 1">第{{ referralDetail.applyNum }}次提交</div>
      </div>
    </div>
    <div class="step-item warning">
      <div class="title">
        <div class="avatar">
          <i class="icon el-icon-warning" style="color: #FFA940;font-size: 24px"></i>
        </div>
        <div class="text">审核退回</div>
      </div>
      <div class="desc">
        <p class="main">
          {{ auditDetail.auditUserNameDetail }}  {{ auditDetail.auditDate }}
          <span class="refuse-btn" @click="visible = true;">查看退回记录</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ProDialog } from "anx-vue";
import processMixin from './process.mixin';
import { getAuditInfoById } from '@/api/modules/ReferralReview';

export default {
  mixins: [processMixin],
  data() {
    return {
      auditDetail: {},
      visible: false
    }
  },
  mounted() {
    this.getAuditInfoById()
  },
  methods: {
    async getAuditInfoById() {
      try {
        const res = await getAuditInfoById({
          applyId: this.$route.query.referralId
        });
        console.log('getAuditInfoById==', res)
        this.auditDetail = {
          ...res.result,
          auditUserName: res.result.auditUserName.replace(/&gt;/g, '>')
        };

      } catch(err) {
        console.error(err);
      }
    },
  },
  components: {
    ProDialog
  },
}
</script>

<style lang="scss" scoped>
@import "./process.scss";
.process-step {
  width: 70%
}
</style>
