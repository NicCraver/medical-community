<template>
  <a-drawer
    :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0)' }"
    class="theDrawer"
    placement="right"
    :closable="false"
    v-model:visible="props.newsState.newsVisible"
  >
    <section class="ReferralNewsDrawer">
      <header class="header">通知列表</header>
      <main class="main">
        <a-tabs v-model:activeKey="activeKey" style="height: 100%">
          <a-tab-pane key="1" :tab="tabTitle">
            <div class="content">
              <section
                class="list"
                v-for="(v, index) in showMessageList"
                :key="index"
              >
                <div class="list-left">待办</div>
                <div class="list-main">
                  <div class="date">{{ v.createTime }}</div>
                  <div class="text">{{ v.msg }}</div>
                </div>
                <a class="list-right" @click="goPage(v)">去处理</a>
              </section>
              <div class="page">
                <a-pagination
                  v-model:current="pageParams.pageNum"
                  :defaultPageSize="pageParams.pageSize"
                  @change="changePageParams"
                  :total="total"
                  size="small"
                  :showSizeChanger="false"
                />
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </main>
      <footer class="footer">
        <div style="margin-right: 10px" @click="goAllPage('checkList')">
          查看全部待审核任务
        </div>
        <div style="margin-left: 10px" @click="goAllPage('clinicRoom')">
          查看待开始预会诊任务
        </div>
      </footer>
    </section>
  </a-drawer>
</template>

<script setup>
import { getMdtSysMessageInfoList } from "@/api/modules/mdtMessage";
import store from "@/store/index";
import microApp, { getActiveApps } from "@micro-zoe/micro-app";
const props = defineProps({
  newsState: {
    type: Object,
  },
});
const emit = defineEmits(["changeNewsVisible"]);

const activeKey = ref("1");

const newsMessageList = ref([]);
const showMessageList = ref([]);

const pageParams = reactive({
  pageNum: 1,
  pageSize: 8,
});
const total = ref(0);
const tabTitle = computed(() => {
  if (!newsMessageList.value.length) {
    return "待办（0）";
  } else {
    return `待办（${total.value}）`;
  }
});

watch(
  () => props.newsState,
  (newValue, oldValue) => {
    pageParams.pageNum = 1;
    getQueryReferralMessage();
  },
  { deep: true }
);

// 判断是否显示红点
const getQueryReferralMessage = async () => {
  try {
    const res = await getMdtSysMessageInfoList();
    console.log("MDT消息列表：", res.result);
    const arr = res?.result || [];
    total.value = res?.total || 0;
    newsMessageList.value = arr;
    changePageParams(pageParams.pageNum);
  } catch (error) {
    console.error("error", error);
  }
};

let appName = "app-mdt";
let routerData = {
  basePath: "/app-mdt",
  routeType: "query",
  replace: false,
};

const goPage = (row) => {
  console.log("row", JSON.parse(JSON.stringify(row)));
  let path =
    row?.url?.indexOf("/app-mdt") > -1
      ? row?.url?.split("/app-mdt")[1]
      : row?.url;
  if (isSamePath(row.url)) {
    routerData.replace = true;
  }
  if (row.type === "A") {
    microApp.setData(appName, {
      ...routerData,
      path,
      query: {
        tabName: "Wait",
        searchValue: row.patientName,
      },
    });
  } else if (row.type === "B" || row.type === "C") {
    microApp.setData(appName, {
      ...routerData,
      path,
      query: {
        type: "1",
        mrState: "prepare",
      },
    });
  } else if (row.type === "D") {
    microApp.setData(appName, {
      ...routerData,
      path,
      query: {
        tabName: "waitDealList",
        consultStatus: "2",
        name: row.patientName,
      },
    });
  } else if (row.type === "E") {
    microApp.setData(appName, {
      ...routerData,
      path,
      query: {
        tabName: "waitClinicList",
        name: row.patientName,
      },
    });
  } else if (row.type === "F") {
    microApp.setData(appName, {
      ...routerData,
      path,
      query: {
        type: "1",
        mrState: "done",
      },
    });
  } else if (row.type === "G") {
    microApp.setData(appName, {
      ...routerData,
      path,
      query: {
        type: "2",
        mrState: "done",
      },
    });
  } else if (row.type === "O") {
    microApp.setData(appName, {
      ...routerData,
      path,
      query: {
        mrId: row.mrId,
      },
    });
  }
  emit("changeNewsVisible");
};
const goAllPage = (val) => {
  if (val === "clinicRoom") {
    microApp.setData(appName, {
      ...routerData,
      path: "/clinicRoom",
      query: {
        type: "1",
      },
    });
  } else {
    microApp.setData(appName, {
      ...routerData,
      path: "/checkList",
      query: {
        tabName: "Wait",
      },
    });
  }
  emit("changeNewsVisible");
};

const changePageParams = (pageNum) => {
  let start = (pageNum - 1) * pageParams.pageSize;
  let end = start + pageParams.pageSize;
  showMessageList.value = newsMessageList.value.slice(start, end);
};

const isSamePath = (path) => {
  let str = window.location.pathname;
  if (str === path) {
    return true;
  } else {
    return false;
  }
};
</script>

<style lang="less" scoped>
.ReferralNewsDrawer {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .header {
    color: rgba(48, 49, 51, 100);
    font-size: 16px;
    padding: 15px 15px 0 15px;
    text-align: center;
  }
  .main {
    flex: 1;
    height: 100%;
    overflow: auto;
    .content {
      height: 100%;
      // overflow-y: auto;
      overflow: hidden;
      padding-right: 15px;
      position: relative;
      .list {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .list-left {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          line-height: 35px;
          text-align: center;
          background-color: rgba(255, 169, 64, 100);
          color: rgba(255, 255, 255, 100);
          margin-right: 10px;
        }
        .list-main {
          flex: 1;
          height: 100%;
          .date {
            color: rgba(117, 117, 117, 100);
            font-size: 12px;
          }
          .text {
            color: rgba(48, 49, 51, 100);
            font-size: 14px;
          }
        }
        .list-right {
          font-size: 14px;
          border-bottom: 1px solid #4469bd;
        }
      }
      .page {
        text-align: center;
        width: 100%;
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .footer {
    margin-left: 8px;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    color: rgba(117, 117, 117, 100);
    font-size: 12px;
    div {
      border-bottom: 1px solid #757575;
      cursor: pointer;
    }
  }
}
</style>

<style lang="less">
.theDrawer {
  .ant-drawer-content-wrapper {
    height: 300px;
    width: 378px;
    margin-top: 65px;
    border-radius: 8px;
    padding-right: 20px;
    box-shadow: none !important;
  }
  .ant-drawer-content {
    border-radius: 8px;
    height: 650px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.12);
  }
  .ant-drawer-body {
    flex-grow: 1;
    padding: 0 0 0 15px;
    overflow: auto;
    font-size: 14px;
    line-height: 1.5715;
    word-wrap: break-word;
  }
  .ant-tabs-content-holder {
    overflow: auto;
    height: 100%;
    box-sizing: border-box;
    .ant-tabs-content {
      height: 100%;
    }
  }
}
</style>
