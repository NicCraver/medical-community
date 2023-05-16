<template>
  <div class="singleSignOn">
    <a-row
      type="flex"
      justify="center"
      align="middle"
      style="min-height: 100vh"
    >
      <a-col>
        <a-spin size="large" :spinning="spinning" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { notification, message } from "ant-design-vue";
import { CheckCircleFilled } from "@ant-design/icons-vue";
import { isBackstage, isHei, menuHei } from "@/dev";
import {
  getCurrentUser,
  userLogin,
  getToken,
  getLoginMenus,
  getLoginOrgRoles,
  generateKey,
} from "../../api/modules/login";
import { useLoginMessage } from "@/hooks/useLoginMessage";
import { useSystemConfig } from "../login/hooks";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const store = useStore();
const router = useRouter();
const route = useRoute();
const spinning = ref(false);
const userRoleRefId = ref(null);

// 判断环境是否为后台管理
const build_env = computed(() => {
  // 开发环境 - 以开发环境为准
  if (process.env.NODE_ENV === "development") {
    return isBackstage();
  }
  // 否则 判断VUE_APP_BUILD_ENV是否为后台管理
  return window.g.VUE_APP_BUILD_ENV === "backstage";
});

onMounted(() => {
  getGenerateKey();
  startTimer();
  useSystemConfig();
});
// 获取密文key
const getGenerateKey = async () => {
  try {
    const fpPromise = FingerprintJS.load();
    const fp = await fpPromise;
    const { visitorId } = await fp.get();
    // console.log(`visitorId`, visitorId)
    const res = await generateKey({ id: visitorId });
    const { key } = res.result;
    sessionStorage.setItem("ct", visitorId);
    sessionStorage.setItem("secretKey", key);
    singleSignFuc();
  } catch (error) {
    // console.log(`error`, error)
  }
};

const singleSignFuc = async () => {
  // console.log(`11111`, 11111)
  // let loginDevice = 'serve001'
  // onLogin(loginDevice)
  // return
  try {
    spinning.value = true;
    const res = await getCurrentUser();
    console.log("单点登录认证-获取用户信息接口：", res);
    let loginDevice = res?.data?.userAcct;
    onLogin(loginDevice);
  } catch (error) {
    spinning.value = false;
    console.error(`error`, error);
  }
};

// 登录 - 获取token - 获取菜单
const onLogin = async (loginDevice) => {
  try {
    spinning.value = true;
    const loginRes = await userLogin({
      loginType: "3",
      loginDevice: loginDevice,
    });
    if (loginRes.code === 0) {
      // 存储 角色id 用户id 用户名称
      sessionStorage.setItem("roleIds", loginRes.result.roleIds);
      sessionStorage.setItem("userId", loginRes.result.userId);
      sessionStorage.setItem("username", loginRes.result.loginName);
      await onGetLoginOrgRoles(loginRes.result.loginName);
      onGetToken(loginRes);
    } else {
      message.error(loginRes.data.desc);
    }
  } catch (error) {
    console.error(`error`, error);
    spinning.value = false;
  }
};

// 获取token
const onGetToken = async (loginRes) => {
  try {
    const tokenRes = await getToken({ userId: loginRes.result.userId });
    sessionStorage.setItem("token", tokenRes.result.token);
    // sessionStorage.setItem("secretKey", tokenRes.result.secretKey);
    onGetLoginMenus(loginRes);
  } catch (error) {
    console.error(`onGetToken - error`, error);
    spinning.value = false;
  }
};

// 获取角色信息
const onGetLoginOrgRoles = async (loginname) => {
  try {
    const res = await getLoginOrgRoles({ loginname });
    if (res.result.length > 0) {
      console.log(`res`, res);
      userRoleRefId.value = res.result[0].VALUE;
      console.log(`userRoleRefId.value`, userRoleRefId.value);
    } else {
      userRoleRefId.value = null;
    }
  } catch (error) {
    console.error(`error`, error);
  }
};

// 获取菜单、角色等信息
const onGetLoginMenus = async (loginRes) => {
  console.log(` userRoleRefId.value`, userRoleRefId.value);
  try {
    const menusRes = await getLoginMenus({
      userRoleRefId: userRoleRefId.value,
      appIds: [
        "c9981569b299440dac08fd1d76559dc8",
        "747daaf979f14c6bb332cfccb1b724cb",
        "7686eb68fe3b4242a5991e681f865d95",
        "8cc41399417548408d2c6b28c7213f4c",
      ],
    });
    console.log(`menusRes`, menusRes);
    if (menusRes.code === -1) {
      spinning.value = false;
      message.error(menusRes.desc);
      onLogout();
      return;
    }
    // 科室等信息
    let deptObject = {
      deptIds: menusRes.result.currentRole.deptIds,
      deptId: menusRes.result.currentRole.deptId,
      deptTypeAndDeptIds: menusRes.result.currentRole.deptTypeAndDeptIds,
      deptName: menusRes.result.currentRole.deptName,
      hosId: menusRes.result.currentRole.hosId,
      hosName: menusRes.result.currentRole.hosName,
      orgId: menusRes.result.currentRole.orgId,
      deptTelephone: menusRes.result.currentRole.deptTelephone,
    };

    sessionStorage.setItem("deptObject", JSON.stringify(deptObject));
    sessionStorage.setItem(
      "currentRole",
      JSON.stringify(menusRes.result.currentRole)
    );
    sessionStorage.setItem("allRoles", JSON.stringify(menusRes.result.roles));
    sessionStorage.setItem("orgId", menusRes.result.currentRole.orgId);

    // 判断是否为管理员、集团、机构
    if (menusRes.result.currentRole.authType === "9999") {
      sessionStorage.setItem("isRootAdmin", true);
    } else if (
      menusRes.result.currentRole.authType ===
      "3fad093759674f539d5910a29b45ae4c"
    ) {
      sessionStorage.setItem("isOrgAdmin", true);
    } else if (
      menusRes.result.currentRole.authType ===
      "12e1c7ef650f44ae9ca08fe17ea81c7f"
    ) {
      sessionStorage.setItem("isOriAdmin", true);
    }
    //组装header医生名称
    sessionStorage.setItem(
      "headerLoginName",
      `${loginRes.result.name}${
        menusRes.result.currentRole.deptName
          ? "-" + menusRes.result.currentRole.deptName
          : ""
      }${
        menusRes.result.currentRole.hosName
          ? "-" + menusRes.result.currentRole.hosName
          : ""
      }`
    );
    sessionStorage.setItem("loginName", loginRes.result.name);
    // 完成后跳转到首页
    getApplicationData(
      menusRes.result.currentRole.menus,
      menusRes.result.currentRole.basePage
    );
  } catch (error) {
    console.error(`onGetLoginMenus - error`, error);
    spinning.value = false;
    message.error(error.desc);
    onLogout();
  }
};

// 保存菜单数据及跳转首页
const getApplicationData = (menus, basePage) => {
  let tempMeuns = menus;
  console.log(`getApplicationData`);
  // 判断是否是 数据治理-黑龙江环境
  if (isHei()) {
    tempMeuns = menuHei(menus);
  }
  // 保存菜单数据
  sessionStorage.setItem("menuDataKeys", JSON.stringify(tempMeuns));
  setTimeout(() => {
    spinning.value = false;
    // notification['success']({
    //   message: '成功',
    //   description: '验证成功，即将跳转到首页',
    //   icon: h(CheckCircleFilled, { style: 'color: #72C140' }),
    //   duration: 2,
    //   top: '55px',
    // })

    // 判断系统是否有登录消息的逻辑
    if (store.state.app.isOpenMessageFunc) {
      useLoginMessage();
    }
    // 设置系统消息类型
    // setSystemMessageType(menus)

    if (build_env.value) {
      router.push("/app-manageModule/organAdmin");
    } else if (route.name === "singleSign") {
      // ehr
      router.push("/app-healthFile/residentCenterInfo");
    } else {
      // 如果没有basePage 则获取菜单数据第一项
      router.push(basePage || tempMeuns[0].path);
    }
  }, 500);
};

let timer = null;
const startTimer = () => {
  timer = setInterval(() => {
    // 定时4分钟刷新这个方法
    getGenerateKey();
  }, 240000);
};

const stopTimer = () => {
  clearInterval(timer);
  timer = null;
};

onUnmounted(() => {
  stopTimer();
});
</script>

<style lang="less" scoped>
.singleSignOn {
  // text-align: center;
  // height: 100vh;
  // margin: auto 0;
}
</style>
