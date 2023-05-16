<template>
  <div class="account-info">
    <div class="title">登录信息</div>
    <div class="no-account" v-if="accountDetail.loginStatus === '0'">
      <i class="el-icon el-icon-document"></i>
      <span class="desc">该医务人员暂未创建账户，请联系高级管理人员~</span>
    </div>
    <div class="has-account" v-else-if="accountDetail.loginStatus === '1'">
      <div class="status">账号状态为：{{ accountDetail.status === 1 ? '已开启' : '已关闭' }}</div>
      <el-form label-width="80px" disabled>
        <el-form-item label="登录账号:">
          <el-input v-model="accountDetail.loginName" />
        </el-form-item>
        <el-form-item label="登录密码:" class="el-form-item">
          <el-input v-model="accountDetail.loginPwd">
            <span slot="suffix" :class="['reset', { disabled: $route.query.mode === 'check' }]" @click="onResetPassword">重置</span>
          </el-input>
          <el-tooltip effect="dark" content="点击重置将为您更新至系统初始密码，如需自定义请联系高级管理人员。" placement="top-start">
            <i class="el-icon el-icon-warning-outline"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="所属组织:">
          <el-input v-model="accountDetail.orgName" />
        </el-form-item>
        <el-form-item label="角色:">
          <el-input v-model="accountDetail.roleName" />
        </el-form-item>
        <el-form-item label="姓名:">
          <el-input v-model="accountDetail.name" />
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model="accountDetail.telephone" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getAccountManageById, onResetPassword } from '@/api/modules/systemAdmin';

export default {
  props: {
    doctorDetail: Object
  },
  data() {
    return {
      accountDetail: {}
    }
  },
  mounted() {
    this.getAccountManageById();
  },
  methods: {
    async getAccountManageById() {
      try {
        const res = await getAccountManageById({ userId: this.doctorDetail.userId });
        console.log('getAccountManageById==', res);
        this.accountDetail = {
          ...res.result,
          loginPwd: '****'
        };
      } catch(err) {
        console.error(err);
      }
    },
    async onResetPassword() {
      if (this.$route.query.mode === 'check') {
        return
      }
      try {
        const res = await onResetPassword({
          id: this.doctorDetail.userId,
          loginPwd: '1111'
        });
        console.log('onResetPassword==', res);
        this.$message.success('密码重置成功');
      } catch(err) {
        console.error(err);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.account-info {
  background: #fff;
  height: 100%;
  .title {
    position: relative;
    padding-left: 14px;
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
    height: 24px;
    &:before {
      content: ' ';
      position: absolute;
      display: inline-block;
      width: 3px;
      height: 16px;
      background-color: #134796;
      left: 0;
      top: 4px;
    }
  }
  .no-account {
    margin-top: 127px;
    justify-content: center;
    display: flex;
    align-items: center;
    .desc {
      font-size: 14px;
      margin-left: 3px;
    }
    .el-icon {
      font-size: 25px;
    }
  }
  .has-account {
    width: 365px;
    margin: 0 auto;
    .status {
      height: 40px;
      line-height: 40px;
      background-color: #F5F5F5;
      margin-bottom: 30px;
      margin-top: 5px;
    }
    .el-form-item {
      position: relative;
      .el-icon {
        position: absolute;
        right: -30px;
        font-size: 20px;
        color: #4468BD;
        top: 10px;
      }
      .reset {
        cursor: pointer;
        color: #134796;
        &.disabled {
          color: #919191;
          cursor: not-allowed
        }
      }
    }
  }
}
</style>
