<!-- 
  @description 医共体信息平台门户
  @date 2022/1/6
 -->
<template>
  <div class="info-platform">
    <basic-header @collapseChange="collapseChange">
      <template v-slot:breadcrumb>
        <el-breadcrumb>
          <el-breadcrumb-item v-for="(item, index) in breadData" :key="index">
            <!-- <i v-if="item.icon" :class="item.icon"></i> -->
            <span class="breadCont" :class="{ isIconPad: item.icon }">
              {{ item.label }}
              <el-image v-if="item.icon" :src="require('@/assets/mdTimerB.png')" class="timerImageB"></el-image>
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </basic-header>
    <div class="menu">
      <el-scrollbar>
        <el-menu background-color="#134796" text-color="rgba(255, 255, 255, .65)" active-text-color="#fff" :default-active="defaultActive" :collapse="isCollapse">
          <!-- 健康档案共享调阅 -->
          <el-submenu index="healthRecord">
            <template slot="title">
              <!-- <i class="iconfont icon-shop"></i> -->
              <el-image :src="require('@/assets/mdTimerW.png')" class="timerImageW"></el-image>
              <span slot="title">
                {{
                  proEnv === "heilongjiang"
                    ? "黑龙江电子病历"
                    : "健康档案共享调阅"
                }}
              </span>
            </template>
            <el-menu-item index="residentCenter" @click="menuClick('healthRecord/residentCenter')">{{
                proEnv === "heilongjiang" ? "患者中心" : "居民中心"
              }}</el-menu-item>
            <el-submenu index="systemConfig">
              <template slot="title">系统配置</template>
              <el-menu-item index="moduleConfig" @click="menuClick('healthRecord/moduleConfig')">模块配置</el-menu-item>
              <el-menu-item index="privacyConfig" @click="menuClick('healthRecord/privacyConfig')">隐私配置</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-scrollbar>
    </div>
    <section class="main" :class="{ 'main-collapse': isCollapse }">
      <header>
        {{ menuName }}
      </header>
      <router-view :key="uuid"></router-view>
    </section>
  </div>
</template>

<script>
import BasicHeader from "./BasicHeader";
import { v4 as uuidv4 } from "uuid";
import { getPrivacyConfig } from "api/infomationPlatform/healthRecord.js";

export default {
  components: {
    BasicHeader,
  },
  data() {
    return {
      defaultActive: "residentCenter",
      isCollapse: false, //是否折叠菜单
      menuName: "",
      breadData: [{ icon: true, label: "" }, { label: "" }], //顶部面包屑内容
    };
  },
  computed: {
    uuid() {
      return uuidv4();
    },
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  mounted() {
    let path = this.$route.path.substr(1);
    this.getTitle(path.substr(path.indexOf("/") + 1));
    this.defaultActive = this.$route.name;
    // 隐私配置
    getPrivacyConfig().then((res) => {
      let result = res.result;
      result.illPrivacies = JSON.parse(result.illPrivacies);
      result.unSendMessageUsers = JSON.parse(result.unSendMessageUsers);
      this.$store.commit("base/SET_PRIVACY_CONFIG", result);
    });
  },
  methods: {
    //左侧菜单点击事件
    menuClick(path) {
      this.$router.push("/infoPlatform/" + path);
      this.getTitle(path);
    },
    // 左侧菜单折叠/展开
    collapseChange(val) {
      this.isCollapse = val;
    },
    getTitle(path) {
      let titleName =
        this.proEnv === "heilongjiang" ? "黑龙江电子病历" : "健康档案共享调阅";
      switch (path) {
        case "healthRecord/residentCenter":
          this.menuName =
            this.proEnv === "heilongjiang" ? "患者列表" : "居民列表";
          this.breadData = [
            { icon: true, label: titleName },
            { label: this.proEnv === "heilongjiang" ? "患者中心" : "居民中心" },
          ];
          break;
        case "healthRecord/moduleConfig":
          this.menuName = "模块列表";
          this.breadData = [
            { icon: true, label: titleName },
            { label: "系统配置" },
            { label: "模块配置" },
          ];
          break;
        case "healthRecord/privacyConfig":
          this.menuName = "隐私配置";
          this.breadData = [
            { icon: true, label: titleName },
            { label: "系统配置" },
            { label: "隐私配置" },
          ];
          break;
      }
    },
  },
};
</script>

<style src="@/assets/css/infomationPlatform.css" scoped></style>
<style lang="scss" scoped>
.info-platform {
  height: 100vh;
  .breadCont {
    position: relative;
    .timerImageB {
      position: absolute;
      height: 18px;
      width: 18px;
      left: 0px;
      top: 1px;
    }
  }
  .breadCont.isIconPad {
    padding-left: 26px;
  }
  .timerImageW {
    margin-right: 8px;
    ::v-deep .el-image__inner {
      vertical-align: middle;
    }
  }
}
.basic-header .el-breadcrumb {
  display: inline-block;
  .iconfont {
    font-size: 14px;
  }
}
.menu {
  float: left;
  height: calc(100% - 50px);
  background: #134796;
  .el-menu {
    height: 100%;
    border: none;
    .iconfont {
      color: #fff;
    }
    .el-menu-item.is-active {
      background-color: #00317a !important;
    }
    &:not(.el-menu--collapse) {
      width: 210px;
    }
  }
}
.main {
  float: right;
  width: calc(100% - 210px);
  height: calc(100% - 50px);
  background-color: #f5f5f5;
  header {
    height: 50px;
    line-height: 50px;
    padding: 0 16px;
    font-size: 18px;
    font-weight: 700;
    background-color: #fff;
    color: #303133;
  }
}
.main-collapse {
  width: calc(100% - 64px);
}
</style>