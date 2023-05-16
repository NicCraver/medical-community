<template>
  <div class="searchCom" id="searchCom">
    <div class="search-btn" @click="showVisible">
      <img :src="require('@/assets/iconPark-search.svg')" />
      搜索
    </div>
    <a-drawer
      v-if="visible"
      v-model:visible="visible"
      class="custom-class"
      title="搜索"
      placement="top"
      height="180"
      getContainer="#searchCom"
      :style="wrapStyle"
    >
      <a-row :gutter="8">
        <a-col :flex="5">
          <a-select
            v-model:value="searchParams.groupId"
            placeholder="集团"
            disabled
            style="width: 100%"
          >
            <a-select-option
              v-for="(item, index) in groupList"
              :key="index"
              :value="item.id"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :flex="9">
          <a-select
            v-model:value="searchParams.orgIdList"
            placeholder="发布机构"
            mode="multiple"
            :maxTagCount="5"
            :disabled="isOriAdmin === 'true'"
            style="width: 100%"
          >
            <a-select-option
              v-for="(item, index) in hosList"
              :key="index"
              :value="item.id"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :flex="5">
          <a-input
            v-model:value="searchParams.name"
            placeholder="方案名称"
            style="width: 100%"
          />
        </a-col>
        <a-col :flex="5">
          <a-range-picker
            v-model:value="searchParams.queryTime"
            :placeholder="['发布开始日期', '发布结束日期']"
            valueFormat="YYYY-MM-DD"
            style="width: 100%"
          />
        </a-col>
        <a-col flex="70px">
          <a-button
            type="primary"
            style="margin-right: 10px"
            @click="goPage(0)"
          >
            搜索
          </a-button>
        </a-col>
        <a-col flex="70px">
          <a-button @click="resetFuc">重置</a-button>
        </a-col>
      </a-row>
      <a-button type="link" class="link-btn" @click="goPage(1)">
        <span style="text-decoration: underline">搜索结果</span>
      </a-button>
    </a-drawer>
  </div>
</template>

<script setup>
import microApp, { getActiveApps } from "@micro-zoe/micro-app";
import { router } from "@/router";
import store from "@/store/index";
import http from "@/api/index";
const getOrgNames = () =>
  http.get({
    url: `/ygt-user/org/getOrgTree`,
  });
let wrapStyle = reactive({});
let currentRole = reactive({});
let isOrgAdmin = ref("false");
let isOriAdmin = ref("false");
let groupList = reactive([]);
let hosList = reactive([]);
let visible = ref(false);
let searchParams = reactive({
  groupId: "",
  orgIdList: [],
  name: "",
  queryTime: [],
});
onMounted(() => {
  currentRole = JSON.parse(sessionStorage.getItem("currentRole"));
  searchParams.groupId = currentRole.orgId;
  isOrgAdmin.value = sessionStorage.getItem("isOrgAdmin");
  isOriAdmin.value = sessionStorage.getItem("isOriAdmin");
  if (isOriAdmin.value) {
    searchParams.orgIdList = [currentRole.hosId];
  }
  getOrgNamesFuc();
});
const showVisible = () => {
  visible.value = true;
  getMenuWidth();
};
// 查询机构
const getOrgNamesFuc = () => {
  getOrgNames().then(({ code, result }) => {
    if (code === 0) {
      if (isOriAdmin.value) {
        groupList = [
          {
            id: currentRole.orgId,
            label: currentRole.orgName,
          },
        ];
        hosList = result.treeData.map((item) => {
          return {
            parentId: currentRole.orgId,
            id: item.id,
            label: item.label,
          };
        });
      } else {
        handleOrgData(result.treeData);
      }
    }
  });
};

const handleOrgData = (list) => {
  groupList = list.map((item) => {
    let children = item.children.map((vv) => {
      return {
        parentId: item.id,
        id: vv.id,
        label: vv.label,
      };
    });
    hosList = hosList.concat(children);
    return {
      id: item.id,
      label: item.label,
    };
  });
  console.log("groupList:", groupList);
  console.log("hosList:", hosList);
};

// 搜索结果、搜索
const goPage = async (flag) => {
  visible.value = false;
  const locationPathname = window.location.pathname;
  let pathName = "";
  if (flag) {
    pathName = "searchRes";
  } else if (locationPathname.indexOf("areaQuality") > -1) {
    pathName = "areaQuality/overview";
  } else if (locationPathname.indexOf("institutionQuality") > -1) {
    pathName = "institutionQuality/overview";
  }
  let routerData = {
    basePath: "/app-serverResourceManage",
    routeType: "query",
    path: "/" + pathName,
    query: {
      orgIdList: searchParams.orgIdList.join(","),
      name: searchParams.name,
      queryTime: searchParams.queryTime?.length
        ? searchParams.queryTime.join(",")
        : "",
    },
  };
  let path = routerData.basePath + routerData.path;
  if (locationPathname === path) {
    routerData.replace = true;
  }
  if (isSameApp(routerData.basePath)) {
    microApp.setData("app-serverResourceManage", routerData);
  } else {
    // 跨应用
    router.push({
      path,
      query: searchParams,
      replace: routerData.replace,
    });
  }
  store.dispatch("app/setPath", path);
  resetFuc();
};
// 重置
const resetFuc = () => {
  let orgIdList = isOrgAdmin.value ? [] : searchParams.orgIdList;
  searchParams.orgIdList = orgIdList;
  searchParams.name = "";
  searchParams.queryTime = [];
};
// 获取左侧菜单的宽度
const getMenuWidth = () => {
  let antLayoutSider = document.getElementsByClassName(
    "headerContentRender"
  )[0];
  const rect = antLayoutSider.getBoundingClientRect(); // 获取元素的矩形对象
  const left = rect.left; // 获取元素距离左边可视窗口的距离
  console.log("菜单的宽度：", left);
  wrapStyle = {
    width: `calc(100% - ${left}px)`,
    "margin-left": `${left}px`,
  };
};
const isSameApp = (appName) => {
  let str = window.location.pathname;
  if (str.search(appName) != -1) {
    return true;
  } else {
    return false;
  }
};
</script>

<style lang="less" scoped>
.searchCom {
  display: flex;
  align-items: center;
  margin-right: 15px;
  .search-btn {
    width: 90px;
    height: 32px;
    line-height: 20px;
    border-radius: 16px;
    background-color: #f5f5f5;
    color: #919191;
    font-size: 14px;
    text-align: center;
    line-height: 32px;
    cursor: pointer;
  }
  .search-btn:hover {
    background-color: #ecf0f8;
    color: #446abd;
  }
  .link-btn {
    margin-top: 10px;
    text-decoration: underline;
  }
}
</style>
