/*
 * @Author: Nic
 * @Date: 2022-04-11 11:43:28
 * @LastEditTime: 2023-02-22 18:07:59
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/subapp-follow-up/src/utils/index.js
 */
export const getHttp = () => {
  let http = null
  if (window.__MICRO_APP_ENVIRONMENT__) {
    const masterDatas = window.microApp.getGlobalData()
    // console.log('masterDatas', masterDatas.async)
    http = masterDatas.async[1].content.default
    // console.log('http', http)
  }

  return http
}

export const getEncryptsm3 = () => {
  let temp = null
  if (window.__MICRO_APP_ENVIRONMENT__) {
    const masterDatas = window.microApp.getGlobalData()
    // console.log('masterDatas', masterDatas.async[2].content.encryptsm3)
    temp = masterDatas.async[2].content.encryptsm3
  }
  return temp
}

export const isPermission = (level) => {
  if (window.g.VUE_APP_PERMISSION >= level) {
    return true
  } else {
    console.log(`权限不足`)
    return false
  }
}
