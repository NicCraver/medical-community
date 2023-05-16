import { h } from 'vue'
import { notification, Button } from 'ant-design-vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import { onQueryPromoteForPage } from '@/api/modules/referralMessage'
import microApp, { getActiveApps } from '@micro-zoe/micro-app'
import { router } from '@/router'
import store from '@/store/index'
import http from '@/api/index'
import { forbiddenMsgTip } from "@/api/modules/layout";
// 消息弹出通用方法
export const messageUniversalMethod = async (type, data) => {
  console.log(`data`, data)
  // 登录消息
  if (type === 'loginMessage') {
    try {
      const res = await onQueryPromoteForPage({})
      if (res.result.length > 0) {
        res.result.forEach((el, index) => {
          console.log(`el`, el)
          openNotification(el.mesData, index)
        })
      }
    } catch (error) {
      console.error(`error`, error)
    }
  } else {
    if (data) {
      const isShowTimelyMsg = sessionStorage.getItem("isShowTimelyMsg") || false;
      if (!isShowTimelyMsg && data?.mesData?.basePath === "/app-followup") {
        // 随访列表通知开关关闭，不显示实时提醒消息
        return;
      }
      openNotification(data.mesData, data.id)
    }
  }
}

// 弹出消息方法
const openNotification = (item, i) => {
  const key = new Date().getTime() + i
  const messageType = '提醒'
  const iconColor = '#FFA940'
  const btnText = '去查看'
  // 关闭
  const ids = []
  // let template = [
  //   { tag: 'span', style: { color: '#FFA940' }, value: '我是p标签,' },
  //   { tag: 'span', style: { color: '#000' }, value: '我是p标签' },
  //   { tag: 'p', style: {}, value: '2020' },
  // ]
  let MessageVnode = []
  item.template.forEach((el) => {
    MessageVnode.push(h(el.tag, { style: el.style }, el.value))
  })
  const vnode = h('div', MessageVnode)
  let buttondOM = [];
  const buttondOM1 = [
    h(
      Button,
      {
        type: "primary",
        size: "small",
        style: "margin-right: 10px",
        onClick: () => goPage(item, key),
      },
      { default: () => item.btnText }
    ),
  ];
  const buttondOM2 = [
    h(
      Button,
      {
        type: "primary",
        size: "small",
        onClick: () => NotificationFuc(item, key),
      },
      { default: () => "今日不再提醒" }
    ),
  ];
  if (item.type === "A3" || item.type === "C3") {
    buttondOM = buttondOM1.concat(buttondOM2);
  } else {
    buttondOM = buttondOM1;
  }
  notification.open({
    top: '55px',
    message: messageType,
    description: vnode,
    icon: h(ExclamationCircleFilled, {
      style: `color: ${iconColor};`,
    }),
    btn: () => h("div", buttondOM),
    key,
    duration: 0,
    onClose: () => onCloseNotification(item, key)
  })
}

const goPage = (item, key) => {
  console.log(`item`, item)
  let routeData = {}
  let path = item.basePath + item.path
  routeData = {
    path: path,
  }
  routeData[item.routeType === 'query' ? 'query' : 'params'] = item.params
  let temp = {
    basePath: item.basePath,
    path: item.path,
    routeType: item.routeType,
    name: item.name,
    replace: false,
  }
  temp[item.routeType === 'query' ? 'query' : 'params'] = item.params

  if (!isSameApp(item.basePath)) {
    console.log(`跨应用跳转------------`)
    // 跨应用跳转
    router.push(routeData)
  } else {
    console.log(`应用内部跳转--------------`, temp)
    if (isSamePath(item.basePath + item.path)) {
      temp.replace = true
    }
    microApp.setData(item.basePath, temp)
  }
  store.dispatch('app/setPath', path)
  // 关闭弹窗
  onCloseNotification(item, key)
}
const NotificationFuc = async (item, key) => {
  // 不在提醒接口
  await forbiddenMsgTip({
    doctorId: sessionStorage.getItem('userId'),
    type: item.type
  });
  notification.close(key);
};
const onCloseNotification = (item, key) => {
  console.group('onCloseNotification')
  console.log(`key`, key)
  console.log(`item`, item)
  // TODO 关闭时调用接口等逻辑
  // fun()
  if (item.basePath === "/app-mdt" && (item?.type === "C" || item?.type === "D")) {
    http.post({
      url: `/ygt-mdt${item.way}`,
      params: { applyIdArr: item.applyIdArr, type: item.type },
    })
  }
  console.groupEnd()

  notification.close(key)
}

const onCloseApi = async () => {
  console.log(`是否调用关闭接口`)
}

const isSameApp = (appName) => {
  let str = window.location.pathname
  if (str.search(appName) != -1) {
    return true
  } else {
    return false
  }
}
const isSamePath = (path) => {
  let str = window.location.pathname
  console.log(`path`, path)
  if (str === path) {
    return true
  } else {
    return false
  }
}
