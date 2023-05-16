/*
 * @Author: Nic
 * @Date: 2022-11-29 10:19:48
 * @LastEditTime: 2023-02-15 17:47:33
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/main-app/src/config.js
 */
// 开发环境地址
const config = {
  chronicDisease: 'http://localhost:7052',
  followup: 'http://localhost:7053',
  manageModule: 'http://localhost:7054',
  referral: 'http://localhost:7055',
  mdt: 'http://localhost:7056',
  healthFile: 'http://localhost:7057',
  activity: 'http://localhost:7058',
  serverResourceManage: 'http://localhost:7059',
  publicServe: 'http://localhost:7060',
  ygtPortal: 'http://localhost:7061',
  qcCenter: 'http://localhost:7062',
  // template: 'http://localhost:7056',
}
// 线上环境地址
if (process.env.NODE_ENV === 'production') {
  // 基座应用和子应用部署在同一个域名下，这里使用location.origin进行补全
  Object.keys(config).forEach((key) => {
    // config[key] = window.location.origin + process.env.BASE_URL
    config[key] = window.location.origin
    // config[key] = config[key]
    // console.group('线上环境地址')
    // console.log(`config`, config)
    // console.log(`key`, key)
    // console.groupEnd()
  })
}

export default config
