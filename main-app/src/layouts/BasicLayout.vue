<template>
  <pro-layout
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
    v-model:openKeys="state.openKeys"
    :menu-data="menuData"
    v-bind="proConfig"
  >
    <template #headerContentRender>
      <div class="headerContentRender">
        <div style="flex: 1 1 0%;display: flex;justify-content: space-between;">
          <div class="header-left">
            <div class="header-btn" @click="toggleCollapsed">
              <div v-if="state.collapsed">
                <MenuUnfoldOutlined style="font-size: 16px" />
              </div>
              <div v-else>
                <MenuFoldOutlined style="font-size: 16px" />
              </div>
            </div>
            <div>
              <a-breadcrumb>
                <a-breadcrumb-item
                  v-for="v in state.breadcrumbData"
                  :key="v.path"
                >
                  <a
                    v-if="v.meta.breadcrumb"
                    @click="menuGoPage(v)"
                    href="javascript:void(0);"
                    >{{ v.meta.title }}</a
                  >
                  <span v-else>{{ v.meta.title }}</span>
                </a-breadcrumb-item>
              </a-breadcrumb>
            </div>
          </div>
          <!-- 数据治理质控界面--专属的搜索框 -->
          <searchCom v-if="isShowSearchCom"/>
        </div>
        <TheHeader />
      </div>
    </template>
    <template #menuHeaderRender>
      <!-- <router-link :to="{ path: '/' }"> -->
      <!-- <img src="@/assets/logo.png" /> -->
      <!-- <img src="../assets/akesulogos.jpg" /> -->
      <div v-if="!state.collapsed">
        <img
          v-if="store.state.app.appName === '后台管理'"
          src="../assets/menuLogo.png"
          style="
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
            border: 0px solid rgba(187, 187, 187, 100);
            border-radius: 100%;
            padding: 0;
          "
        />
        <img
          v-if="store.state.app.hosName === '鹰眼观谱科技'"
          src="../assets/meunlogo2.png"
        />
        <img
          v-if="store.state.app.hosName === '阿克苏'"
          src="../assets/akesulogos.jpg"
        />
        <img
          v-if="store.state.app.hosName === '齐齐哈尔'"
          src="../assets/qiqihaer-logo.png"
        />
        <h1 v-if="!state.collapsed" style="margin-left: 5; text-align: center">
          {{ store.state.app.menuTitle }}
        </h1>
      </div>
      <!-- <div v-else>
        <h1>后台管理</h1>
      </div> -->
      <!-- <h1>后台管理</h1> -->
      <!-- </router-link> -->
    </template>
    <template #menuItemRender="{ item }">
      <a-menu-item
        v-if="!item.meta.isShow"
        @click="menuGoPage(item)"
        :key="item.path"
        :disabled="item.meta?.disabled"
        :danger="item.meta?.danger"
      >
        <template #icon>
          <IconFont v-if="item.meta.icon" :type="item.meta.icon" />
        </template>
        <div>
          <span class="ant-pro-menu-item">
            <span class="ant-pro-menu-item-title">{{ item.meta.title }}</span>
          </span>
        </div>
      </a-menu-item>
    </template>
    <div :class="spinning ? 'pro-layout-main' : 'pro-layout-main1'">
      <a-spin :spinning="spinning" size="large">
        <router-view v-slot="{ Component }">
          <transition name="zoom" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-spin>
    </div>
  </pro-layout>
</template>

<script setup>
import microApp, { getActiveApps } from "@micro-zoe/micro-app";
import { useStore } from "vuex";
import {
  createFromIconfontCN,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons-vue";
import "@/assets/abcIconFont";
import { Modal } from "ant-design-vue";

import TheHeader from "@/components/TheHeader/TheHeader.vue";
import searchCom from "@/components/TheHeader/searchCom.vue";
import SettingDrawer from "@/components/SettingDrawer";

import useIndex from "./index";
import { isBackstage, isHei } from "@/dev";

const build_env = computed(() => {
  if (process.env.NODE_ENV === "development") {
    return isBackstage();
  }
  return window.g.VUE_APP_BUILD_ENV === "backstage";
});

// icon
const IconFont = createFromIconfontCN({
  scriptUrl: "",
});

const store = useStore();
const router = useRouter();
const route = useRoute();

// loading
const spinning = ref(true);

// 滚动高度
const scrollbarHeight = ref(document.body.offsetHeight - 48 + "px");

const { treeFilter, fnDisposeChildPath, getBreadcrumbById } = useIndex();

// 监听应用间切换 loading 状态
watchEffect(() => {
  spinning.value = store.state.app.appLoading;
});

const menuDataKeys = ref([]);
menuDataKeys.value = JSON.parse(sessionStorage.getItem("menuDataKeys"));
const menuData = ref([]);
menuData.value = JSON.parse(sessionStorage.getItem("menuDataKeys"));

// 监听vuex app.path的变化，更改菜单激活状态和面包屑
watch(
  () => store.state.app.path,
  (newValue, oldValue) => {
    // console.log(`监听vuex app.path的变化`);
    // console.log('store.state.app.path=========', newValue)
    // console.log('store.state.app', store.state.app)

    menuDataKeys.value = JSON.parse(sessionStorage.getItem("menuDataKeys"));

    menuData.value = JSON.parse(sessionStorage.getItem("menuDataKeys"));
    treeFilter(menuData.value);
    if (!newValue) return;
    state.selectedKeys = [];
    state.openKeys = [];
    meunFindKeys(menuDataKeys.value, newValue);
    state.breadcrumbData = getBreadcrumbById(
      menuDataKeys.value,
      (node) => node.path === newValue
    );
    console.log(`state.breadcrumbData`,state.breadcrumbData)
    // console.log('store.state.app.isAcrossApplication', store.state.app.isAcrossApplication)
    // console.log('state', state)
    if (store.state.app.isAcrossApplication) {
      if (!getActiveApps().includes(store.state.app.appName)) {
        // 主应用跳转内部
        router.push(newValue);
      } else {
        microApp.setData(store.state.app.appName, {
          basePath: "/" + store.state.app.appName,
          path: fnDisposeChildPath(newValue),
        });
      }
      store.dispatch("app/setPath", "");
      store.dispatch("app/setIsAcrossApplication", false);
      store.dispatch("app/setAppName", "");
    }
    getSearchComStatus(newValue);
  }
);
const isShowSearchCom = ref(false);
const getSearchComStatus = (path) => {
  if (path.indexOf("areaQuality") > -1 || path.indexOf("institutionQuality") > -1) {
    isShowSearchCom.value = true;
    return;
  }
  isShowSearchCom.value = false;
}
// 菜单数据
const state = reactive({
  collapsed: false, // default collapsed
  openKeys: [], // defualt openKeys
  selectedKeys: [], // default selectedKeys
  breadcrumbData: [],
});

provide('state', { state })

// // 菜单备份数据
// const menuState = reactive({
//   collapsed: false, // default collapsed
//   openKeys: [], // defualt openKeys
//   selectedKeys: [], // default selectedKeys
//   breadcrumbData: [],
// })

// layout 配置
const proConfig = ref({
  layout: "side",
  fixedHeader: true,
  fixSiderbar: true,
  splitMenus: false,
  menuHeaderRender: undefined,
  footerRender: undefined,
  headerRender: undefined,
});

const isJump = ref(true);
const tempMenuData = reactive({
  openKeys: [],
  selectedKeys: [],
});

// watch(
//   () => state.selectedKeys,
//   (newValue, oldValue) => {
//     let str = window.location.pathname
//     console.log(`当前url`, str)
//     // console.log(`state.selectedKeys`, state.selectedKeys)
//     // console.log(`newValue`, newValue)
//     // console.log(`oldValue`, oldValue)
//     if (str === '/app-followup/AddEditorSurvey') {
//       isJump.value = false
//       console.log(`isJump.value`, isJump.value)
//       return
//     }
//     // tempMenuData.selectedKeys = oldValue
//     // console.log(`tempMenuData`, tempMenuData)
//   },
// )

onMounted(() => {
  if (isHei()) {
    state.collapsed = true;
    proConfig.value.menuHeaderRender = state.collapsed ? false : undefined;
  }
  treeFilter(menuData.value);
  let str = window.location.pathname;
  state.selectedKeys = [];
  state.openKeys = [];
  state.breadcrumbData = getBreadcrumbById(
    menuDataKeys.value,
    (node) => node.path === str
  );
  meunFindKeys(menuDataKeys.value, str);
  // console.log('state', state)
  getSearchComStatus(store.state.app.path);
});

// 菜单显示隐藏
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  proConfig.value.menuHeaderRender = state.collapsed ? false : undefined;
  // console.log(`store.state.app.hosName`, store.state.app.hosName);
  // if (
  //   store.state.app.hosName !== "后台管理" &&
  //   store.state.app.hosName !== "阿克苏" &&
  //   store.state.app.hosName !== "齐齐哈尔" &&
  //   store.state.app.hosName !== "鹰眼观谱科技"
  // ) {
  //   console.log(`22223333`, 22223333);
  //   proConfig.value.menuHeaderRender = state.collapsed ? false : undefined;
  // }
};

// 跳转方法
const menuGoPage = (item) => {
  let pathRouteData = JSON.parse(JSON.stringify(item));
  console.log("item", pathRouteData);
  if(pathRouteData.name != 'app-followup'){
    let flagPath = window.sessionStorage.getItem('tipFlag')  

    if(flagPath == 'true'){     
      Modal.confirm({
        title: '提示',
        okText: '确认',
        cancelText: '取消',
        content: '您有未保存的记录，确认要离开吗?',
        onOk() {
          window.sessionStorage.setItem('tipFlag', 'false'); 
          commonRoutePath(item)               
        },
        onCancel() {         
        
        },
      })
    }else{
      commonRoutePath(item)
    }
  }else{
    commonRoutePath(item)
  } 
};

function commonRoutePath(item) {
  const appName = item.meta.name;
  const path = item.path;
  state.selectedKeys = [];
  state.openKeys = [];
  state.breadcrumbData = getBreadcrumbById(
    menuDataKeys.value,
    (node) => node.path === path
  );
  meunFindKeys(menuDataKeys.value, path);
  if (!appName) {
    router.push(path);
    console.log("1111111111111", 1111111111111);
  } else {
    if (!getActiveApps().includes(appName)) {
      // 主应用跳转内部
      console.log("2222222222============", path);
      router.push(path);
    } else {
      console.log("3333333333333", 3333333333333);

      // 主应用通过下发data数据控制子应用跳转
      // console.log('fnDisposeChildPath(path)', fnDisposeChildPath(path))
      microApp.setData(appName, {
        basePath: "/" + appName,
        path: fnDisposeChildPath(path),
      });
      store.dispatch("app/setPath", "");
    }
  }
}

function meunFindKeys(list, activePath) {
  // console.log('list', list)
  // console.log('activePath', activePath.split('/')[1])
  // console.log('activePath', activePath)

  for (let i = 0; i < list.length; i++) {
    if (state.selectedKeys.length) {
      break;
    }
    if (list[i].path !== activePath) {
      // console.log(list[i].children && !list[i].children.find((item) => item.path === activePath))
      if (list[i].children && list[i].children.length) {
        // console.log('list[i] push', list[i].name || list[i].meta.name)
        // console.log('list[i] push2', list[i])
        if (
          activePath.split("/")[1] === list[i].name ||
          activePath.split("/")[1] === list[i].meta.name
        ) {
          // console.log('list[i].path', list[i].path)
          // console.log('22222222222', activePath.split('/')[1] === list[i].name)
          // console.log('33333333333', activePath.split('/')[1] === list[i].meta.name)
          state.openKeys.push(list[i].path);
        }
        // console.log('state.openKeys', state.openKeys)
        const res = list[i].children.find((item) => item.path === activePath);
        if (!res) {
          // console.log('11111111111', !res)
          meunFindKeys(list[i].children, activePath);
        } else {
          // console.log(' state.openKeys.concat(res.path)', state.openKeys.concat(res.path))
          state.selectedKeys = state.openKeys.concat(res.path);
        }
      } else if (i === list.length - 1) {
        if (state.openKeys.length) {
          if (state.openKeys.length > 2) {
            // console.log('222222222222', 222222222222)
            state.openKeys.pop();
          }
          // console.log('00000', 11111111)
          state.openKeys.pop();
          // console.log('state.openKeys', state.openKeys)
        } else {
          state.openKeys = [];
        }
      }
    } else {
      // console.log('999999999999', list[i].path)
      // state.openKeys = []
      state.selectedKeys = state.openKeys.concat(list[i].path);
    }
  }
  // 如果菜单为收缩状态，则openKeys为空
  if (state.collapsed) {
    state.openKeys = [];
  }
}
</script>
<style>
.boxtip{
  width:500px;
  height:400px;
  border:1px solid red;
}
.ant-pro-sider-logo {
  padding: 10px 16px;
}
.ant-pro-sider-logo h1 {
  margin: 0 0 0 8px;
  text-align: center;
}

.ant-pro-basicLayout-content {
  margin: 0;
  overflow: hidden;
}
.ant-pro-global-header {
  padding: 0 !important;
}
.ant-pro-global-header-collapsed-button {
  display: none !important;
}
.ant-pro-basicLayout-content {
  position: relative;
  margin: 0 !important;
}
.ant-pro-sider-links {
  display: none;
}
.ant-menu-sub {
  background: #00317a !important;
}
.ant-pro-sider {
  position: relative;
  background-color: #134796 !important;
  border-right: 0;
  box-shadow: 2px 0 8px #1d23290d;
  transition: all 0.2s;
  z-index: 100;
}
.ant-menu.ant-menu-dark {
  background-color: #134796 !important;
  z-index: 5000;
}
.ant-menu-vertical .ant-menu-item:not(:last-child),
.ant-menu-vertical-left .ant-menu-item:not(:last-child),
.ant-menu-vertical-right .ant-menu-item:not(:last-child),
.ant-menu-inline .ant-menu-item:not(:last-child) {
  margin: 0 !important;
  line-height: 48px !important;
  height: 48px !important;
}
.ant-menu-submenu-selected .ant-menu-submenu-title {
  margin: 0 !important;
  line-height: 48px !important;
  height: 48px !important;
}
.ant-menu-item {
  margin: 0 !important;
  height: 48px !important;
  line-height: 48px !important;
}
.ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: #446abd !important;
}
.ant-menu-item-icon {
  font-size: 20px !important;
}
</style>
<style lang="less" scoped>
.headerContentRender {
  display: flex;
  align-items: center;
  .header-left {
    display: flex;
    align-items: center;
    .header-btn {
      cursor: pointer;
      padding: 0 10px;
    }
  }
}
.pro-layout-main1 {
  background: #f5f5f5;
  height: calc(100vh - 48px);
  overflow: hidden;
}
.pro-layout-main {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  height: calc(100vh - 48px);
  overflow: hidden;
  // padding: 20px 0 20px 20px;
  // .pro-layout-main-content {
  // margin-right: 20px;
  // height: calc(100vh - 88px);
  // margin: 10px;
  // background: #fff;
  // margin: 0 !important;
  // overflow: auto;
  // }
}
</style>
