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
                v-for="(v, index) in newsMessageList"
                :key="index"
              >
                <div class="list-left">待办</div>
                <div class="list-main">
                  <div class="date">{{ v.sendDate }}</div>
                  <div class="text">{{ v.listContent }}</div>
                </div>
                <a class="list-right" @click="goPage(v)">去处理</a>
              </section>
              <div class="page">
                <a-pagination
                  v-model:current="pageParams.pageNum"
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
        <div
          style="margin-right: 10px"
          v-if="props.newsState.hasAdmissionsList"
          @click="goAllPage('AdmissionsList')"
        >
          查看全部待接诊任务
        </div>
        <div
          style="margin-left: 10px"
          v-if="props.newsState.hasReviewList"
          @click="goAllPage('ReviewList')"
        >
          查看全部待审核任务
        </div>
      </footer>
    </section>
  </a-drawer>
</template>

<script setup>
import { onQueryReferralMessage } from "@/api/modules/referralMessage";
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
    if (newValue.newsVisible) {
      getQueryReferralMessage();
    }
  },
  { deep: true }
);
// 判断是否显示红点
const getQueryReferralMessage = async () => {
  try {
    const res = await onQueryReferralMessage({
      ...pageParams,
    });
    newsMessageList.value = res.result.records;
    total.value = res.result.total;
    if (res.result.records.length > 0) {
      store.dispatch("news/setDotFlag", true);
    } else {
      store.dispatch("news/setDotFlag", false);
    }
  } catch (error) {
    console.error("error", error);
  }
};

const goPage = (row) => {
  const message = JSON.parse(JSON.stringify(row));
  console.log("row", JSON.parse(JSON.stringify(row)));
  if (row.messageType === "A") {
    microApp.setData("app-referral", {
      basePath: "/app-referral",
      path: "/reviewList",
      referralInfo: message,
      name: "ReviewList",
    });
  } else if (row.messageType === "B") {
    microApp.setData("app-referral", {
      basePath: "/app-referral",
      path: "/admissionsListDetail",
      name: "AdmissionsListDetail",
      routeType: "query",
      queryField: {
        mode: "submit",
        referralId: message.applyId,
        admissionsId: message.admissionsId,
      },
      routeChangeType:
        window.location.pathname === "/app-referral/admissionsListDetail"
          ? "replace"
          : "",
    });
  }
  emit("changeNewsVisible");
};
const goAllPage = (val) => {
  if (val === "ReviewList") {
    console.log("审核列表");
    microApp.setData("app-referral", {
      basePath: "/app-referral",
      path: "/reviewList",
    });
  } else {
    window.sessionStorage.setItem("activeTab", "Wait");
    microApp.setData("app-referral", {
      basePath: "/app-referral",
      path: "/admissionsList",
    });
    console.log("接诊列表");
  }
  emit("changeNewsVisible");
};

const changePageParams = () => {
  getQueryReferralMessage();
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
