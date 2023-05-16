import { notification, Button } from 'ant-design-vue'
import { h } from 'vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import MessageVnode from './MessageVnode.vue'
import microApp, { getActiveApps } from '@micro-zoe/micro-app'
import { getLoginReferralMessage, onReadReferralMessage } from '@/api/modules/referralMessage'
import { messageUniversalMethod } from '../hooks/messageUniversalMethod'
import store from '@/store/index'

export const NotificationOptions = (message) => {
  console.log(`message`, message)
  if (store.state.app.messageType === 'REF') {
    refMessageFun(message)
  } else {
    console.log(`message`, message)
    messageUniversalMethod('realTimeMessage', message)
  }
}

function onCloseNotification(key, callback, message) {
  // console.log('onCloseNotification', key)
  callback(key, message)
}

const refMessageFun = (message) => {
  // console.log('message==================', JSON.parse(JSON.stringify(message)))
  const { content, messageType, patName, id } = message
  let title = content.split('：')[0]
  let msg = content.split('：')[1]
  let doctor = msg
  const key = new Date().getTime()
  const vnode = h('div', [
    h(MessageVnode, {
      patName,
      doctor,
      messageType,
    }),
  ])

  function onCloseCallback(key) {
    // console.log('onCloseCallback', key)
    if (messageType !== 'A' && messageType !== 'B') {
      onReadReferralMessage({ ids: [id] })
        .then((res) => {
          notification.close(key)
        })
        .catch((error) => {
          // console.error('error', error)
        })
    }
  }

  function callback(key, message) {
    const mes = JSON.parse(JSON.stringify(message))
    switch (messageType) {
      case 'A':
        // console.log('AAAAAAAAAAAAAA')
        microApp.setData('app-referral', {
          basePath: '/app-referral',
          path: '/reviewList',
          referralInfo: mes,
          name: 'ReviewList',
          routeType: 'params',
        })
        notification.close(key)
        break
      case 'B':
        // console.log('BBBBBBBBBBBBBB')
        // console.log(JSON.parse(JSON.stringify(message)))
        microApp.setData('app-referral', {
          basePath: '/app-referral',
          path: '/admissionsListDetail',
          name: 'AdmissionsListDetail',
          routeType: 'query',
          queryField: {
            mode: 'submit',
            referralId: mes.applyId,
            admissionsId: mes.admissionsId,
          },
          routeChangeType:
            window.location.pathname === '/app-referral/admissionsListDetail' ? 'replace' : '',
        })
        notification.close(key)
        break
      case 'C':
        onCloseCallback('C')
        microApp.setData('app-referral', {
          basePath: '/app-referral',
          path: '/referralListDetail',
          name: 'ReferralListDetail',
          routeType: 'query',
          queryField: {
            status: 'edit',
            referralId: message.applyId,
          },
        })
        notification.close(key)
        break
      case 'D':
        onCloseCallback('D')
        microApp.setData('app-referral', {
          basePath: '/app-referral',
          path: '/referralListDetail',
          name: 'ReferralListDetail',
          routeType: 'query',
          queryField: {
            status: 'examine',
            referralId: message.applyId,
          },
        })
        notification.close(key)
        break
      case 'E1':
        onCloseCallback('E1')
        microApp.setData('app-referral', {
          basePath: '/app-referral',
          path: '/referralListDetail',
          name: 'ReferralListDetail',
          routeType: 'query',
          queryField: {
            status: 'examine',
            referralId: message.applyId,
          },
        })
        notification.close(key)
        break
      case 'E2':
        onCloseCallback('E2')
        microApp.setData('app-referral', {
          basePath: '/app-referral',
          path: '/referralListDetail',
          name: 'ReferralListDetail',
          routeType: 'query',
          queryField: {
            status: 'examine',
            referralId: message.applyId,
          },
        })
        notification.close(key)
        break
      default:
        break
    }
  }
  setTimeout(() => {
    const btnMAp = {
      A: '去处理',
      B: '去处理',
      C: '查看退回',
      D: '查看通过',
      E1: '去查看',
      E2: '去查看',
    }
    notification.open({
      top: '55px',
      message: title,
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
            onClick: () => onCloseNotification(key, callback, message),
          },
          { default: () => btnMAp[message.messageType] },
        ),
      key,
      duration: 0,
      onClose: () => {
        onCloseNotification(key, onCloseCallback)
      },
    })
  }, 500)
}
