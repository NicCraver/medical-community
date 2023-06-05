<!-- 
  @description 登录页面
  @date 2021/8/12
 -->
<template>
  <div class="login">
    <el-image
      :src="require('img/login/bg.png')"
      fit="cover"
      class="image-outters"
    >
    </el-image>
    <!-- <el-image
      v-if="proEnv !== 'heilongjiang'"
      class="image-inners"
      :src="require('/login/logo.png')"
    ></el-image> -->
    <section>
      <el-image
        v-if="proEnv === '阿克苏'"
        class="el-image"
        :src="require('@/assets/akesu-l-logo.png')"
      ></el-image>
      <div class="form">
        <h1>医共体信息平台</h1>
        <p class="welcom">欢迎使用</p>
        <el-form
          ref="form"
          :model="loginData"
          label-width="0"
          @submit.native.prevent
          v-loading="loading"
        >
          <el-form-item>
            <el-input
              v-model="loginData.user"
              placeholder="手机号/邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="loginData.password"
              placeholder="登录密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="fr"
              @click="login"
              native-type="submit"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- 安想 -->
      <p class="info" v-if="proEnv !== 'heilongjiang'">
        Copyright © 智慧医疗版权所有
      </p>
    </section>
  </div>
</template>

<script>
import { userLogin, getToken } from "api/login/index.js";
import { encryptsm3 } from "@/utils/utils.js";
import { getDictCodesList, getDiaCodesList } from "@/utils/dictCodes.js";

export default {
  name: "Login",
  data() {
    return {
      //登录信息
      loginData: {
        user: "",
        password: "",
      },
      loading: false,
    };
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  created() {},
  methods: {
    login() {
      this.loading = true;
      userLogin({
        loginType: "1",
        loginName: this.loginData.user,
        pwd: encryptsm3(this.loginData.password),
      })
        .then((res) => {
          if (res.code == 0) {
            //成功
            sessionStorage.setItem("userId", res.result.userId);
            sessionStorage.setItem("loginName", res.result.loginName);
            // 获取token
            getToken(res.result.userId).then((result) => {
              sessionStorage.setItem("token", result.result.token);
              sessionStorage.setItem("secretKey", result.result.secretKey);
              getDictCodesList();
              getDiaCodesList();
            });
            // 提示
            this.$message({
              message: "验证成功，即将跳转到首页",
              type: "success",
              showClose: true,
              duration: 2000,
              onClose: () => {
                this.$router.push({ path: "/infoPlatform" });
                this.loading = false;
              },
            });
          } else {
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  height: 100vh;
  position: relative;
  .image-inners {
    position: absolute;
    top: 20%;
    left: calc(20% - 105px);
    width: 210px;
    // height: 112px;
  }
}

.image-outters {
  float: left;
  width: 40%;
  height: 100%;
}

section {
  position: relative;
  float: left;
  width: 60%;
  height: 100%;
  .el-image {
    position: relative;
    top: 15%;
    left: 20%;
    width: 300px;
  }
  .form {
    position: absolute;
    top: 30%;
    left: 20%;
    h1 {
      font-size: 30px;
    }
    .welcom {
      margin-top: 10px;
      margin-bottom: 30px;
      font-size: 14px;
    }
    .el-form {
      width: 300px;
    }
  }
  .info {
    position: absolute;
    left: 20%;
    bottom: 30px;
    font-size: 12px;
    color: #aaa;
  }
}
</style>