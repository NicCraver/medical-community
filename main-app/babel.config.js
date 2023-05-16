/*
 * @Author: Nic
 * @Date: 2022-04-11 10:46:00
 * @LastEditTime: 2023-03-13 15:49:30
 * @LastEditors: Nic
 * @Description: 
 * @FilePath: /medical-community/main-app/babel.config.js
 */
let transformRemoveConsolePlugin = [];
// if (process.env.NODE_ENV === 'production' && !process.env.VUE_APP_SHOW_LOG) {
//   transformRemoveConsolePlugin = [
//     ["transform-remove-console", {
//       "exclude": ["info"]
//     }]
//   ]
// };
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    // ...transformRemoveConsolePlugin
  ]
  // plugins: [['import', { libraryName: 'ant-design-vue', libraryDirectory: 'es', style: true }]],
}
