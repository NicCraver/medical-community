<template>
  <a-drawer
    :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0)' }"
    class="theDrawer"
    placement="right"
    :closable="false"
    v-model:visible="props.newsState.newsVisible"
  >
    <section class="ReferralNewsDrawer">
      <header class="header">
        通知列表
        <div class="switchCls">
          <a-switch v-model:checked="checked" size="small" @change="SwithChange" />
          
          <a-tooltip class="infoCls">
            <template #title>开启实时提醒：开启后我们将对您今日可处理的任务进行整点提醒</template>
            <info-circle-outlined />
          </a-tooltip>
        </div>
      </header>
      <main class="main">
        <a-tabs v-model:activeKey="activeKey" style="height: 100%">
          <a-tab-pane key="1" :tab="tabTitle">
            <div class="content">
              <section
                class="list"
                v-for="(v, index) in messageList"
                :key="index"
              >
                <div
                  class="list-left"
                  :class="v.state === 'false' ? 'list-left-c' : v.msgType === 'C' ? 'list-left-a' : 'list-left-b'"
                >
                  {{ v.msgType === "C" ? "超期" : "待办" }}
                </div>
                <div class="list-main">
                  <div class="date">{{ v?.remindDate }}</div>
                  <div class="text">{{ v?.title }}</div>
                  <div class="tips">{{ v?.subTitle }}</div>
                </div>
                <a class="list-right" v-show="v.state !== 'false'" @click="goPage(v)">去处理</a>
              </section>
            </div>
          </a-tab-pane>
        </a-tabs>
      </main>
      <footer class="footer">
        <div
          style="margin-right: 10px"
          v-if="props.newsState.hasFollowUpList"
          @click="goAllPage()"
        >
          查看所有随访待办
        </div>
      </footer>
    </section>
  </a-drawer>
</template>

<script setup>
import {
  followUpAlerts,
  followUpAlertsList,
  logout,
} from "@/api/modules/layout";
import microApp, { getActiveApps } from "@micro-zoe/micro-app";
import store from "@/store/index";
import { InfoCircleOutlined} from '@ant-design/icons-vue';

const props = defineProps({
  newsState: {
    type: Object,
  },
});

watch(
  () => props.newsState.newsVisible,
  (val, old) => {    
    if(val) getFollowUpAlertsList();
  }
)

const checked = ref(false)
const activeKey = ref("1");
const messageList = ref(null);
const tabTitle = computed(() => {
  if (!messageList.value.length) {
    return "待办（0）";
  } else {
    return `待办（${messageList.value.length}）`;
  }
});
onMounted(() => {
  checked.value = sessionStorage.getItem("isShowTimelyMsg") || false;
  getFollowUpAlertsList();
});

const getFollowUpAlertsList = async () => {
  try {
    const res = await followUpAlertsList({
      terminalCode: "PC",
      userId: window.sessionStorage.getItem("userId"),
    });
    console.log(`res`, res);
    messageList.value = res.result.map((item) => {
      if (item.msgType === "A") {
        return {
          ...item,
          title: `${item.name}患者今日为随访截止日，请注意`,
          subTitle: `请在${item.nextFollowTime.split(" ")[0]}日前完成`,
        };
      } else if (item.msgType === "B") {
        return {
          ...item,
          title: `${item.name}患者可开始录入`,
          subTitle: `请在${item.nextFollowTime.split(" ")[0]}日前完成`,
        };
      } else if (item.msgType === "C") {
        return {
          ...item,
          title: `${item.name}患者随访任务已超期，请补录`,
          subTitle: `已超期${item.beyondDay}天`,
        };
      }
    });
    console.log("messageList:", messageList.value);
  } catch (error) {}
};

import { useRouter } from "vue-router";
const emit = defineEmits(["changeNewsVisible"]);
const router = useRouter();
const goPage = (message) => {
  emit("changeNewsVisible");
  window.sessionStorage.setItem("isFirstFromOtherPage", true);
  if (!message) {
    router.push(`/app-followup/FollowUpList?time=${Date.now()}`);
    return;
  }
  window.sessionStorage.setItem("followupId", message.followupId);
  let routerData = {
    basePath: "/app-followup",
    routeType: "query",
  };
  if (message.msgType === "C") {
    if (isSameApp("app-followup")) {
      routerData.path = "/FollowUpList";
      routerData.query = {
        overdueFlg: 1,
        time: Date.now(),
      };
      if (isSamePath(routerData.basePath + routerData.path)) {
        routerData.replace = true;
      }
      microApp.setData("app-followup", routerData);
      store.dispatch("app/setPath", routerData.path);
    } else {
      router.push(`/app-followup/FollowUpList?overdueFlg=1&time=${Date.now()}`);
    }
  } else {
    if (isSameApp("app-followup")) {
      routerData.path = "/FollowUpList";
      routerData.query = {
        time: Date.now(),
      };
      if (isSamePath(routerData.basePath + routerData.path)) {
        routerData.replace = true;
      }
      microApp.setData("app-followup", routerData);
      store.dispatch("app/setPath", routerData.path);
    } else {
      router.push(`/app-followup/FollowUpList?time=${Date.now()}`);
    }
  }
};

const goAllPage = () => {
  router.push(`/app-followup/FollowUpList`);
  emit("changeNewsVisible");
};
const SwithChange = (val) => {
  sessionStorage.setItem("isShowTimelyMsg", val);
}
const isSameApp = (appName) => {
  let str = window.location.pathname;
  if (str.search(appName) != -1) {
    return true;
  } else {
    return false;
  }
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
    position: relative;
    .switchCls {
      position: absolute;
      right: 10px;
      top: 15px;
      display: flex;
      align-items: center;
      .infoCls {
        margin-left: 5px;
      }
    }
  }
  .main {
    flex: 1;
    height: 100%;
    overflow: auto;
    .content {
      height: 100%;
      overflow-y: auto;
      // overflow: hidden;
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
        .list-left-a {
          background-color: #ff4d4f;
        }
        .list-left-b {
          background-color: rgba(255, 169, 64, 100);
        }
        .list-left-c {
          background-color: #B8BCC5;
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
          .tips {
            font-size: 12px;
            color: rgba(117, 117, 117, 100);
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
