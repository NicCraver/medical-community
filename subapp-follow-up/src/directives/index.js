/*
 * @Author: Nic
 * @Date: 2023-02-20 09:14:15
 * @LastEditTime: 2023-02-20 09:18:58
 * @LastEditors: Nic
 * @Description: 自定义指令
 * @FilePath: /medical-community/subapp-chronic-disease/src/directives/index.js
 */
import permission from './permission'
// 自定义指令
const directives = {
  permission,
}
 
export default {
  install(Vue) {
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  },
}
