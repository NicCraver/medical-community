/*
 * @Author: Nic
 * @Date: 2022-12-06 14:54:12
 * @LastEditTime: 2023-03-13 15:37:52
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/main-app/src/dev.js
 */
import { changeMenuName } from './utils/utils'

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
  name = '慢病管理平台'
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
  // url = 'http://10.16.140.76:6001'
  // url = 'http://106.14.116.14:7001'
  // url = 'http://192.168.197.181:7001'
  // url = 'http://10.16.140.30:7001'
  // 测试环境 7000
  // url = 'http://124.196.7.86:7000'
  // 开发环境 7001
  // url = 'http://124.196.7.86:7001'
  // url = 'http://10.16.140.13:7000'
  // url = 'http://10.16.140.21:7000'
  return url
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
