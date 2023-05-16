import Vue from 'vue';
import App from './App.vue';
import AnxUi from '../packages/index';
// import upperFirst from "lodash/upperFirst";
// import camelCase from "lodash/camelCase";

Vue.config.productionTip = false;
Vue.use(AnxUi);
// // 挂载全局基础组件
// const requireComponent = require.context(
//   // 其组件目录的相对路径
//   "./components",
//   // 是否查询其子目录
//   true,
//   // 匹配基础组件文件名的正则表达式
//   /[A-Z]\w+\.(vue|js)$/
// );
// requireComponent.keys().forEach(fileName => {
//   // 获取组件配置
//   const componentConfig = requireComponent(fileName);
//   // 获取组件的 PascalCase 命名
//   const componentName = upperFirst(
//     camelCase(
//       // 获取和目录深度无关的文件名
//       fileName
//         .split("/")
//         .pop()
//         .replace(/\.\w+$/, "")
//     )
//   );
//   console.log("componentName", componentName);
//   // 全局注册组件
//   Vue.component(componentName, componentConfig.default || componentConfig);
// });

new Vue({
  render: h => h(App)
}).$mount('#app');
