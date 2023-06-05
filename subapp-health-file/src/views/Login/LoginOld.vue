<template>
  <div class="anx-login-wrapper">
    <div class="login-bg">
      <img src="../../assets/bg.png" alt="" />
    </div>
    <div class="login-conent">
      <div class="login-main">
        <div style="flex: 1">
          <div class="title">健康档案管理中心 , 登录</div>
          <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="anx-login-ruleForm">
              <el-form-item prop="account">
                <div class="anx-login-input">
                  <el-input type="text" v-model="ruleForm.account" placeholder="账号" @keyup.enter.native="submitForm('ruleForm')" />
                  <span class="span-clearable span-account" @click="clearable('account')">
                    <img src="@/assets/clearable.svg" alt="" />
                  </span>
                  <span class="span-line"></span>
                </div>
              </el-form-item>
              <el-form-item prop="password">
                <div class="anx-login-input">
                  <el-input :type="type" v-model="ruleForm.password" placeholder="密码" @keyup.enter.native="submitForm('ruleForm')" />
                  <span class="span-clearable" @click="clearable('password')">
                    <img src="@/assets/clearable.svg" alt="" />
                  </span>
                  <span v-if="type === 'password'" class="span-eye" @click="changeType('value')">
                    <img src="@/assets/close.svg" alt="" />
                  </span>
                  <span v-else class="span-eye" @click="changeType('password')">
                    <img src="@/assets/eye.svg" alt="" />
                  </span>
                  <span class="span-line"></span>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button class="anx-login-button" type="primary" @click="submitForm('ruleForm')">
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="login-footer">2021安想智慧医疗版权所有</div>
      </div>
    </div>
  </div>
</template>

<script>
import { userLogin, getToken } from "../../api/modules/login/index";
import { Storage } from "anx-core";
import { Notification } from "element-ui";
import { encryptsm3 } from "@/utils/utils.js";

export default {
  data() {
    return {
      type: "password",
      ruleForm: {
        account: "",
        password: "",
      },
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onLogin();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    onLogin() {
      let loginData = {
        loginName: this.ruleForm.account,
        pwd: encryptsm3(this.ruleForm.password),
        loginType: "1",
        // loginDevice: "xxxxxxxxxxx",
        // deviceType: "1",
        // bindDevice: "0",
      };
      console.log("loginData", loginData);
      userLogin(loginData)
        .then((res) => {
          if (res.code === 0) {
            sessionStorage.setItem("loginName", res.result.loginName);
            sessionStorage.setItem("userId", res.result.userId);
            //成功
            // 获取token
            getToken(res.result.userId).then((result) => {
              sessionStorage.setItem("token", result.result.token);
              sessionStorage.setItem("secretKey", result.result.secretKey);
              Notification({
                title: "成功",
                message: "验证成功，即将跳转到首页",
                type: "success",
              });
              // window?.location?.reload?.();
              this.$router.push({ path: "/infoPlatform" });
            });
          } else {
            this.$message({
              message: "用户名或密码错误",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeType(val) {
      this.type = val;
    },

    clearable(val) {
      this.ruleForm[val] = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.anx-login-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-bg {
    width: 60%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  // position: relative;
  // width: 100vw;
  // height: 100vh;
  // overflow: hidden;
  // &::before {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   margin-left: -0%;
  //   // background-image: url("../../assets/anx-login.png");
  //   background-image: url("../../assets/login1.jpg");
  //   // background-image: url("../../assets/login2.png");
  //   background-position: 100%;
  //   background-repeat: no-repeat;
  //   background-size: auto 100%;
  //   content: "";
  // }
  .login-conent {
    width: 50%;
    display: flex;
    justify-content: flex-end;
    height: 100vh;
    .login-main {
      display: flex;
      flex-direction: column;
      margin-right: 280px;
      margin-top: 300px;

      .title {
        font-size: 30px;
        font-weight: bold;
        color: #272727;
      }
      .anx-login-ruleForm {
        margin-top: 20px;
      }
      .anx-login-button {
        width: 306px;
        margin-top: 15px;
        color: #fff;
        background: #134a96 !important;
        border: 1px solid #134a96 !important;
        font-size: 18px;
      }
      .login-footer {
        text-align: center;
        flex-shrink: 0; /* Prevent Chrome, Opera, and Safari from letting these items shrink to smaller than their content's default minimum size. */
        padding: 20px;
      }
    }
    @media only screen and (max-width: 1920px) {
      // screen and 前两个可以省略。
      .login-main {
        margin-right: 350px;
      }
    }
    @media only screen and (max-width: 1680px) {
      // screen and 前两个可以省略。
      .login-main {
        margin-right: 240px;
      }
    }
    @media only screen and (max-width: 1440px) {
      // screen and 前两个可以省略。
      .login-main {
        margin-right: 200px;
      }
    }
    @media only screen and (max-width: 1350px) {
      // screen and 前两个可以省略。
      .login-main {
        margin-right: 180px;
      }
    }
    @media only screen and (max-width: 1280px) {
      // screen and 前两个可以省略。
      .login-main {
        margin-right: 150px;
      }
    }
  }
}
</style>
