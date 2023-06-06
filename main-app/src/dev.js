/*
 * @Author: Nic
 * @Date: 2022-12-06 14:54:12
 * @LastEditTime: 2023-03-13 15:37:52
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/main-app/src/dev.js
 */
import { changeMenuName } from './utils/utils'
import { useStore } from 'vuex'

// 是否是后台管理
export const isBackstage = () => {
  let flag
  flag = false
  // flag = true
  return flag
}

// 开发环境 修改系统名称（系统名称对应不同消息逻辑等）
export const systemName = () => {
  let name = ''
  // name = '医共体信息平台'
  // name = '鹰眼观谱科技慢病'
  // name = '鹰眼观谱科技会诊'
  // name = '鹰眼观谱科技转诊'
  // name = '阿克苏'
  // name = '慢病管理平台'
  name = '质量控制中心平台'
  // name = '双向转诊平台'
  // name = '慢病管理中心'
  // name = '多学科会诊平台'
  // name = '服务资源管理'
  // name = '双向转诊平台'
  // name = '黑龙江电子病历'
  return name
}

export const envConfig = () => {
  let url
  url = process.env.VUE_APP_BASE_API
  url = 'http://10.16.140.27:7001'
  return url
}

export const useSystemConfig = () => {
  const store = useStore()
  const loginLayoutState = reactive({
    // backstage default qiqihaer
    backgroundImage: 'default',
  })
  let appName = window.g.VUE_APP_BROWSER_TITLE
  if (process.env.NODE_ENV === 'development') {
    appName = systemName()
  }
  function initConfig(appName) {
    let appTitle = '慢病管理平台'
    let menuTitle = ''
    let hosName = ''
    // 是否显示菜单logo
    let isShowMenuLogo = true
    // 是否显示登录页logo
    let isShowLoginLogo = true
    // 是否执行登录消息方法及实时消息方法
    let isOpenMessageFunc = true
    // 是否显示消息图标
    let isShowMessage = true
    // 消息类型 会诊、慢病、转诊、活动
    let messageType = ''
    const map = {
      齐齐哈尔: () => {
        loginLayoutState.backgroundImage = 'qiqihaer'
        hosName = '齐齐哈尔'
        appTitle = '慢病管理中心'
        menuTitle = '慢病管理中心'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'DISE'
      },
      '鹰眼观谱科技-慢病管理平台': () => {
        hosName = '鹰眼观谱科技'
        loginLayoutState.backgroundImage = '鹰眼观谱科技'
        appTitle = '慢病管理平台'
        menuTitle = '慢病管理平台'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'DISE'
      },
      '鹰眼观谱科技-多学科会诊平台': () => {
        hosName = '鹰眼观谱科技'
        loginLayoutState.backgroundImage = '鹰眼观谱科技'
        appTitle = '多学科会诊平台'
        menuTitle = '多学科会诊平台'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'MDT'
      },
      '鹰眼观谱科技-双向转诊平台': () => {
        hosName = '鹰眼观谱科技'
        loginLayoutState.backgroundImage = '鹰眼观谱科技'
        appTitle = '双向转诊平台'
        menuTitle = '双向转诊平台'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'REF'
      },
      慢病管理平台: () => {
        appTitle = '慢病管理平台'
        menuTitle = '慢病管理平台'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'DISE'
      },
      多学科会诊平台: () => {
        appTitle = '多学科会诊平台'
        menuTitle = '多学科会诊平台'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'MDT'
      },
      双向转诊平台: () => {
        appTitle = '双向转诊平台'
        menuTitle = '双向转诊平台'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'REF'
      },
      服务资源管理: () => {
        // browserTitle = '服务资源管理'
        appTitle = '医共体信息平台'
        menuTitle = '医共体信息平台门户'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = false
        isShowMessage = false
      },
      质量控制中心平台: () => {
        appTitle = '质量控制中心平台'
        menuTitle = '质量控制中心平台'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = false
        isShowMessage = false
      },
      黑龙江电子病历: () => {
        hosName = '黑龙江'
        // browserTitle = '服务资源管理'
        appTitle = '电子病历信息平台'
        menuTitle = '黑龙江电子病历门户'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = false
        isShowMessage = false
      },
      阿克苏: () => {
        loginLayoutState.backgroundImage = 'akesu'
        hosName = '阿克苏'
        appTitle = '双向转诊平台'
        menuTitle = '双向转诊平台'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = true
        isShowMessage = true
        messageType = 'REF'
      },
      医共体信息平台: () => {
        appTitle = '医共体信息平台'
        menuTitle = '医共体信息平台'
        isShowMenuLogo = false
        isShowLoginLogo = false
        isOpenMessageFunc = false
        isShowMessage = false
      },
      后台管理: () => {
        appTitle = '后台管理'
        menuTitle = '后台管理'
        isShowMenuLogo = true
        isShowLoginLogo = true
        isOpenMessageFunc = false
        isShowMessage = false
      },
    }
    if (isDev()) {
      appName = '后台管理'
    }
    if (map[appName]) {
      map[appName]()
      //  存储到vuex
      store.dispatch('app/setAppTitle', appTitle)
      store.dispatch('app/setMenuTitle', menuTitle)
      store.dispatch('app/setIsShowMenuLogo', isShowMenuLogo)
      store.dispatch('app/setIsShowLoginLogo', isShowLoginLogo)
      store.dispatch('app/setIsOpenMessageFunc', isOpenMessageFunc)
      store.dispatch('app/setIsShowMessage', isShowMessage)
      store.dispatch('app/setMessageType', messageType)
      store.dispatch('app/setHosName', hosName)
      menuTitle = menuTitle === '' ? appTitle : menuTitle
      // browserTitle = browserTitle === '' ? appTitle : browserTitle
      // document.title = window.sessionStorage.getItem('browserTitle')
      // window.sessionStorage.setItem('browserTitle', browserTitle)
    }
  }

  function isDev() {
    if (process.env.NODE_ENV === 'development') {
      return isBackstage()
    }
    return window.g.VUE_APP_BUILD_ENV === 'backstage'
  }

  initConfig(appName)
  return { loginLayoutState }
}

export const isMenHu = () => {
  let flag = false

  // if (process.env.NODE_ENV === 'development') {
  //   flag = true
  // } 

  // else {
  //   console.log(`window.g.VUE_APP_ISHEILONGJIANG`, window.g.VUE_APP_ISHEILONGJIANG)
  //   flag = window.g.VUE_APP_ISHEILONGJIANG
  // }
  console.log(`是否门户登录`, flag)
  return flag
}

// 需求，黑龙江菜单名称自定义
// 判断 开发环境是不是 数据治理  生产环境是不是数据治理（在判断是不是黑龙江） true
// false 就保持不变
// 这个逻辑只用于菜单
export const isHei = () => {
  let flag = false
  if (process.env.NODE_ENV === 'development') {
    // flag = true
  } else {
    console.log(`window.g.VUE_APP_ISHEILONGJIANG`, window.g.VUE_APP_ISHEILONGJIANG)
    flag = window.g.VUE_APP_ISHEILONGJIANG
  }
  console.log(`是否是黑龙江环境`, flag)
  return flag
}

// 返回服务资源-黑龙江环境菜单
export const menuHei = (menus) => {
  let list = {
    '/app-serverResourceManage/serviceResource/resourceCatalog': '数据目录',
    '/app-serverResourceManage/serviceResource/serviceManage': '数据管理',
    '/app-serverResourceManage/serviceResource/serviceEmpowerMenu': '数据授权',
    '/app-serverResourceManage/serviceResource/serviceEmpower': '数据授权',
    '/app-serverResourceManage/serviceResource/visitlog': '数据日志',
    '/app-serverResourceManage/finResource/finOverView': '数据统计',
    '/app-serverResourceManage/collectMonitor/cmOverview': '数据统计',
    '/app-healthFile/residentCenter': '患者列表',
  }
  return changeMenuName(menus, list)
}
