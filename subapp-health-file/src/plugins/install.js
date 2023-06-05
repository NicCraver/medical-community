import Vue from "vue";
import Element from "./element";
import "element-ui/lib/theme-chalk/index.css";
import adaptive from "./adaptive";

adaptive.directive = function(Vue) {
  // 绑定v-adaptive指令
  Vue.directive("adaptive", adaptive);
};

// 注册组件
[...Element.components].forEach((i) => Vue.use(i));

// 注册指令服务
[...Element.serve, adaptive].forEach((i) => Vue.use(i.directive));

// 注册挂载方法
Element.methods.forEach((i) => {
  Vue.prototype[`$${i.name}`] = i.method;
});
