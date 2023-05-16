import {
  getLoginReferralMessage,
  onReadReferralMessage,
  onQueryPromoteForPage,
} from '@/api/modules/referralMessage'
import { followUpAlerts, followUpAlertsList, logout } from '@/api/modules/layout'
import { notification, Button } from 'ant-design-vue'
import { h } from 'vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import MessageVnode from '../components/MessageVnode.vue'
import microApp from '@micro-zoe/micro-app'
import dayjs from 'dayjs'
import { router } from '@/router'
import store from '@/store/index'

import { messageUniversalMethod } from './messageUniversalMethod'
// 登录消息提醒，会诊、转诊、慢病、活动
export const useLoginMessage = async () => {
  console.log(`store.state.app.messageType`, store.state.app.messageType)
  let messageType = store.state.app.messageType
  // activitylLoginMessage()
  // 慢病
  if (messageType === 'DISE') {
    useChronicDiseaseLoginMessage()
  }
  // 转诊
  if (messageType === 'REF') {
    referralLoginMessage()
  }
  // 活动 推送
  if (messageType === 'DISE' || 'MDT') {
    messageUniversalMethod()
  }
}

export const referralLoginMessage = async () => {
  try {
    const res = await getLoginReferralMessage()
    res.result.forEach((el, i) => {
      NotificationOptions(el.tot, el.drName, el.messageType, i, el.ids, el)
    })
    // const { content, messageType, patName } = message
  } catch (error) {
    // console.error('error', error)
  }
}

// 慢病登录消息
export const useChronicDiseaseLoginMessage = async () => {
  try {
    const res = await followUpAlerts({
      userId: sessionStorage.getItem('userId'),
    })

    // const res = {
    //   result: {
    //     msgA: 1,
    //     msgC: 1,
    //   },
    // }
    console.log(`useChronicDiseaseLoginMessage`, res)
    let msgAText = res.result.msgA
      ? `${sessionStorage.getItem('loginName')}医生您好，${dayjs(new Date()).format(
          'YYYY-MM-DD',
        )}有随访任务（${res.result.msgA}条）今日截止`
      : ''
    let msgBText = res.result.msgB
      ? `${sessionStorage.getItem('loginName')}医生您好，${dayjs(new Date()).format(
          'YYYY-MM-DD',
        )}可开始随访任务（${res.result.msgB}条）已生成`
      : ''
    let msgCText = res.result.msgC
      ? `${sessionStorage.getItem('loginName')}医生您好，${dayjs(new Date()).format(
          'YYYY-MM-DD',
        )}需补录超期随访任务（${res.result.msgC}条）`
      : ''
    if (msgAText) {
      console.log(`msgAText`, msgAText)
      ChronicDiseaseNotificationOptions('待办消息', msgAText, res.result.msgA, 'msgA')
    }
    if (msgBText) {
      console.log(`msgBText`, msgBText)
      ChronicDiseaseNotificationOptions('待办消息', msgBText, res.result.msgB, 'msgB')
    }
    if (msgCText) {
      console.log(`msgCText`, msgCText)
      ChronicDiseaseNotificationOptions('超期消息', msgCText, res.result.msgC, 'msgC')
    }
    // ChronicDiseaseNotificationOptions(
    //   msgAText,
    //   msgBText,
    //   msgCText,
    // )
    // res.result.forEach((el, i) => {
    //   NotificationOptions(el.tot, el.drName, el.messageType, i, el.ids, el)
    // })
    // const { content, messageType, patName } = message
  } catch (error) {
    // console.error('error', error)
  }
}

const ChronicDiseaseNotificationOptions = (type, msg, tot, msgType) => {
  const key = new Date().getTime() + msgType
  const onGoPage = () => {
    console.log(`onGoPage`)
    let params = ''
    if (msgType === 'msgA') {
      params = `followupStartTime=${dayjs(new Date()).format('YYYY-MM-DD')}&followupEndTime=${dayjs(
        new Date(),
      ).format('YYYY-MM-DD')}`
    } else if (msgType === 'msgB') {
      params = 'initCode=1'
    } else {
      params = 'overdueFlg=1'
      window.sessionStorage.setItem('systemCall', '3')
    }
    window.sessionStorage.setItem('isFirstFromOtherPage', true)
    window.sessionStorage.setItem('pageChangeType', 'first')
    window.sessionStorage.setItem('FollowUpListParams', JSON.stringify(params))
    console.log(`params`, params)
    router.push(`/app-followup/FollowUpList?${params}`)
    // microApp.setData('app-followup', {
    //   basePath: '/app-followup',
    //   path: '/FollowUpList',
    //   params,
    //   name: 'ReferralList',
    //   routeType: 'params',
    // })
    notification.close(key)
  }
  setTimeout(() => {
    notification.open({
      message: type,
      description: msg,
      key,
      icon: () =>
        h(ExclamationCircleFilled, {
          style: `color: ${type === '待办消息' ? '#FFA940' : '#FF4D4F'};`,
        }),
      btn: () =>
        h(
          Button,
          {
            type: 'primary',
            size: 'small',
            onClick: () => onGoPage(),
          },
          { default: () => '去处理' },
        ),
      duration: 0,
    })
  }, 500)
}

export const NotificationOptions = (tot, drName, messageType, i, ids, el) => {
  // console.log('messageType', messageType)
  const key = new Date().getTime() + i
  // console.log('key', key)
  const vnode = h('div', [
    h(MessageVnode, {
      isLogin: true,
      tot,
      doctor: drName,
      messageType,
    }),
  ])

  function onCloseCallback(key) {
    // console.log('onCloseCallback', key)
    if (messageType !== 'A' && messageType !== 'B') {
      onReadReferralMessage({ ids: ids })
        .then((res) => {
          notification.close(key)
        })
        .catch((error) => {
          // console.error('error', error)
        })
    }
  }

  function callback(key, ids) {
    switch (messageType) {
      case 'A':
        // console.log('AAAAAAAAAAA', key)
        // console.log('window.location.pathname', window.location.pathname)
        // if (window.location.pathname !== '/app-referral/reviewList') {
        microApp.setData('app-referral', { basePath: '/app-referral', path: '/reviewList' })
        // }
        notification.close(key)

        break
      case 'B':
        // console.log('BBBBBBBBBBBBB', key)
        // if (window.location.pathname !== '/app-referral/admissionsList') {
        microApp.setData('app-referral', { basePath: '/app-referral', path: '/admissionsList' })
        // }
        notification.close(key)

        break
      case 'C':
        // console.log('CCCCCCCCCCCCCC', key)
        onReadReferralMessage({ ids: ids })
          .then((res) => {
            microApp.setData('app-referral', {
              basePath: '/app-referral',
              path: '/referralList',
              referralInfo: {
                applyStatus: '0',
              },
              name: 'ReferralList',
              routeType: 'params',
            })
            notification.close(key)
          })
          .catch((error) => {
            // console.error('error', error)
          })

        break
      case 'D':
        // console.log('DDDDDDDDDDDDDD')
        window.sessionStorage.setItem('activeTab', 'LoadAdmissions')
        onReadReferralMessage({ ids: ids })
          .then((res) => {
            microApp.setData('app-referral', {
              basePath: '/app-referral',
              path: '/referralList',
              referralInfo: {
                // auditDate: [],
              },
              name: 'ReferralList',
              routeType: 'params',
            })
            notification.close(key)
          })
          .catch((error) => {
            // console.error('error', error)
          })
        break
      case 'E1':
        // console.log('E111111')
        window.sessionStorage.setItem('activeTab', 'LoadAdmissions')
        onReadReferralMessage({ ids: ids })
          .then((res) => {
            microApp.setData('app-referral', {
              basePath: '/app-referral',
              path: '/referralList',
              referralInfo: {},
              name: 'ReferralList',
              routeType: 'params',
            })
            notification.close(key)
          })
          .catch((error) => {
            // console.error('error', error)
          })
        break
      case 'E2':
        // console.log('E22222222')
        window.sessionStorage.setItem('activeTab', 'LoadDeal')
        onReadReferralMessage({ ids: ids })
          .then((res) => {
            microApp.setData('app-referral', {
              basePath: '/app-referral',
              path: '/referralList',
              referralInfo: {
                applyStatus: '2',
              },
              name: 'ReferralList',
              routeType: 'params',
            })
            notification.close(key)
          })
          .catch((error) => {
            // console.error('error', error)
          })
        break
      default:
        break
    }
  }
  setTimeout(() => {
    notification.open({
      top: '55px',
      message: messageType === 'A' || messageType === 'B' ? '待办消息' : '提醒',
      description: vnode,
      icon: h(ExclamationCircleFilled, {
        style: `color: ${messageType === 'A' || messageType === 'B' ? '#FFA940' : '#4468BD'};`,
      }),
      btn: () =>
        h(
          Button,
          {
            type: 'primary',
            size: 'small',
            onClick: () => onCloseNotification(key, ids, callback),
          },
          { default: () => (messageType === 'A' || messageType === 'B' ? '去处理' : '去查看') },
        ),
      key,
      duration: 0,
      onClose: () => {
        onCloseNotification(key, ids, onCloseCallback)
      },
    })
  }, 500)
}

function onCloseNotification(key, ids, callback) {
  // console.log('onCloseNotification', key, ids)
  callback(key, ids)
}

const activitylLoginMessage = async () => {
  try {
    const res = await onQueryPromoteForPage({})
    console.log(`res`, res.mesData)
    const openNotification = (item, i) => {
      const key = new Date().getTime() + i
      const messageType = '提醒'
      const iconColor = '#FFA940'
      const btnText = '去查看'
      // 关闭
      const ids = []
      // let a = [
      //   { tag: 'span', style: { color: '#FFA940' }, value: '我是p标签,' },
      //   { tag: 'span', style: { color: '#000' }, value: '我是p标签' },
      //   { tag: 'p', style: {}, value: '2020' },
      // ]
      let MessageVnode = []
      item.template.forEach((el) => {
        MessageVnode.push(h(el.tag, { style: el.style }, el.value))
      })
      const vnode = h('div', MessageVnode)
      notification.open({
        top: '55px',
        message: messageType,
        description: vnode,
        icon: h(ExclamationCircleFilled, {
          style: `color: ${iconColor};`,
        }),
        btn: () =>
          h(
            Button,
            {
              type: 'primary',
              size: 'small',
              onClick: () => test(),
            },
            { default: item.btnText },
          ),
        key,
        duration: 0,
        onClose: () => {
          onCloseNotification(key, ids, onCloseCallback)
        },
      })
    }
    if (res.result.length > 0) {
      res.result.forEach((el, index) => {
        console.log(`el`, el)
        openNotification(el.mesData, index)
      })
    }
    let data = [
      {
        basePath: '', // 微前端app name
        path: '', // path
        name: '', // 路由name
        params: {},
        routeType: '', //params 隐式传参 query url拼接
        messageType: '0', // 0提醒 1待办 2超期 啥的
        template: `<p>
        jdiasjdoi
        <span style="color: red"> dasdsa </span>
        dasdas
      </p>`, // html
        btnText: '去查看',
      },
    ]
    console.log(`data`, data)
  } catch (error) {
    console.error(`error`, error)
  }
}
