<!-- 
  @description 顶部
  @date 2022/1/6
 -->
<template>
  <div class="basic-header">
    <div class="title-collapse" v-if="isCollapse">
      <!-- <el-image
        :src="require('@/assets/anx-logo.png')"
        v-if="proEnv !== 'heilongjiang'"
      ></el-image> -->
      <el-image
        :src="require('@/assets/akesu-logo.png')"
        v-if="proEnv === '阿克苏'"
      ></el-image>
    </div>
    <div class="title" v-else>
      <!-- <el-image
        :src="require('@/assets/anx-logo.png')"
        v-if="proEnv !== 'heilongjiang'"
      ></el-image> -->
      <el-image
        :src="require('@/assets/akesu-logo.png')"
        v-if="proEnv === '阿克苏'"
      ></el-image>
      <span class="title-info">
        {{ proEnv === "heilongjiang" ? "黑龙江电子病历" : "健康档案共享调阅" }}
      </span>
    </div>
    <div class="header" :class="{ 'header-collapse': isCollapse }">
      <el-button type="text" class="collapse" :class="getBtnClass" @click="collapseChange"></el-button>
      <slot name="breadcrumb"></slot>
      <el-dropdown @command="handleCommand" class="fr">
        <span class="el-dropdown-link">
          <!-- <i class="iconfont icon-reddit-circle-fill pic"></i> -->
          <img src="@/assets/man.png" alt="" style="width: 24px; height: 24px; margin-right: 12px" />
          欢迎 {{ username }}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { userLogout } from "api/login/index.js";

export default {
  name: "BasicHeader",
  props: {},
  data() {
    return {
      isCollapse: false, //菜单是否折叠
      username: "",
      userId: "",
    };
  },
  computed: {
    getBtnClass() {
      return this.isCollapse ? "iconfont icon-indent" : "iconfont icon-outdent";
    },
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  mounted() {
    this.username = sessionStorage.getItem("loginName") || "";
    this.userId = sessionStorage.getItem("userId");
    if (!this.username && this.proEnv !== "heilongjiang") {
      this.$confirm("获取用户信息失败，请重新登录", "提示", {
        showCancelButton: false,
        type: "warning",
      })
        .then(() => {
          this.$router.push("/");
        })
        .catch(() => {});
    }
  },
  methods: {
    // 菜单折叠/展开
    collapseChange() {
      this.isCollapse = !this.isCollapse;
      this.$emit("collapseChange", this.isCollapse);
    },
    // 退出登录
    handleCommand(command) {
      userLogout(this.userId).then((res) => {
        this.$router.push("/");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("secretKey");
        sessionStorage.removeItem("loginName");
        sessionStorage.removeItem("userId");
      });
    },
  },
};
</script>

<style src="@/assets/css/infomationPlatform.css" scoped></style>
<style lang="scss" scoped>
.basic-header {
  height: 50px;
  line-height: 50px;
}
.title,
.title-collapse {
  float: left;
  height: 100%;
  background-color: #134796;
  color: #fff;
}
.title {
  width: 210px;
  transition: width 0.3s ease-in-out;
  padding-left: 16px;
  display: flex;
  align-items: center;
  .title-info {
    font-size: 16px;
    font-weight: 700;
    margin-left: 10px;
  }
  .el-image {
    // margin-right: 10px;
  }
}
.title-collapse {
  width: 64px;
  transition: width 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    font-size: 16px;
    font-weight: 700;
  }
}
.title .el-image,
.title-collapse .el-image {
  width: 28px;
  height: 28px;
  // margin: 11px 10px 11px 16px;
  vertical-align: middle;
}
.header {
  float: right;
  width: calc(100% - 210px);
  height: 100%;
  border-bottom: 2px solid #dfe4eb;
  padding: 0 16px;
  transition: width 0.3s ease-in-out;
  .collapse {
    font-size: 20px;
    margin-right: 16px;
    line-height: 50px;
  }
  i.pic {
    margin-right: 3px;
    font-size: 20px;
    color: #000;
  }
}
.header-collapse {
  width: calc(100% - 64px);
}

.el-dropdown {
  height: 50px;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>