<template>
  <div
    class="singleSign"
    v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  ></div>
</template>
<script>
import {
  userLogin,
  getToken,
  getCurrentUser,
  beforeFact,
} from "api/login/index.js";
import { getDictCodesList, getDiaCodesList } from "@/utils/dictCodes.js";
import { getPrivacyConfig } from "api/infomationPlatform/healthRecord.js";

export default {
  name: "singleSign",
  data() {
    return {
      loading: false,
      loadingText: "数据加载中，请稍后",
    };
  },
  created() {
    // this.beforeFactFuc();
    this.singleSignFuc();
  },
  methods: {
    // 获取平台用户信息接口
    async singleSignFuc() {
      this.loading = true;
      try {
        let res = await getCurrentUser();
        console.log("单点登录认证-获取用户信息接口：", res);
        if (res.code === 0) {
          let loginDevice = res?.data?.userAcct;
          this.login(loginDevice);
        } else {
          this.loading = false;
          // this.$message.error(res.msg || "单点登录认证失败");
        }
      } catch (error) {
        this.loading = false;
        this.$message.error("数据加载失败");
      }
    },
    // 单点登录接口
    login(loginDevice) {
      this.loading = true;
      userLogin({
        loginType: "3",
        loginDevice,
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
              this.getPrivacyConfig();
              getDictCodesList();
              getDiaCodesList();
            });
            this.loadingText = "数据加载中";
            this.$message({
              message: "数据加载中",
              type: "success",
              showClose: true,
              duration: 2000,
              onClose: () => {
                this.$router.push({ path: "/ResidentCenter" });
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
    // 认证接口
    async beforeFactFuc() {
      this.loading = true;
      try {
        let res = await beforeFact({
          menuCodg: "xdzbl-02",
        });
        console.log("单点登录认证信息接口：", res);
        if (res.code === 0) {
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      } finally {
        await this.singleSignFuc();
      }
    },
    async getPrivacyConfig() {
      try {
        let res = await getPrivacyConfig();
        let result = res.result;
        result.illPrivacies = JSON.parse(result.illPrivacies);
        result.unSendMessageUsers = JSON.parse(result.unSendMessageUsers);
        this.$store.commit("base/SET_PRIVACY_CONFIG", result);
      } catch (error) {}
    },
  },
};
</script>
<style lang="less" scoped>
.singleSign {
  height: 100vh;
  background-color: #fff;
}
</style>
