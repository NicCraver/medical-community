<template>
  <div class="process-step">
    <div class="step-item active-step">
      <div class="title">
        <div class="avatar">
          <i class="el-icon el-icon-success"></i>
        </div>
        <div class="text">提交完成</div>
      </div>
      <div class="desc">
        <p class="main">{{ referralDetail.createUserName }} {{ referralDetail.submitDate }}</p>
        <div class="supply" v-if="referralDetail.applyNum !== 1">第{{ referralDetail.applyNum }}次提交</div>
      </div>
    </div>
    <div class="step-item">
      <div class="title">
        <div class="avatar">2</div>
        <div class="text">审核完成</div>
      </div>
      <div class="desc">
        <p class="main">处理中，请等待</p>
      </div>
    </div>
    <div class="step-item">
      <div class="title">
        <div class="avatar">3</div>
        <div class="text">接诊完成</div>
      </div>
    </div>
    <div class="step-item">
      <div class="title">
        <div class="avatar">4</div>
        <div class="text">完成</div>
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
</style>
