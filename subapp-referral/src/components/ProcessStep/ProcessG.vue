<template>
  <div class="process-step">
    <div class="step-item">
      <div class="title">
        <div class="avatar completed">1</div>
        <div class="text">提交完成</div>
      </div>
      <div class="desc">
        <p class="main">{{ referralDetail.createUserName }} {{ referralDetail.submitDate }}</p>
      </div>
    </div>
    <div class="step-item warning">
      <div class="title">
        <div class="avatar completed">2</div>
        <div class="text">审核退回</div>
      </div>
      <div class="desc">
        <p class="main">{{ auditInfo.auditUserNameDetail }}  {{ auditInfo.auditDate }}</p>
      </div>
    </div>
    <div class="step-item active-step">
      <div class="title">
        <div class="avatar">
          <i class="el-icon el-icon-error"></i>
        </div>
        <div class="text">
          已关闭
          <el-tooltip :content="`关闭原因：${referralDetail.abortReason}`" placement="top">
            <i class="el-icon el-icon-info"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="desc">
        <p class="main">{{ referralDetail.modUserName }} {{ referralDetail.abortDate }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import processMixin from './process.mixin';
export default {
  mixins: [processMixin]
}
</script>

<style lang="scss" scoped>
@import "./process.scss";
.process-step {
  width: 75%
}
</style>
