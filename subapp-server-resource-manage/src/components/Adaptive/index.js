import Adaptive from "./src/index";

Adaptive.directive = function (Vue) {
  // 绑定v-adaptive指令
  Vue.directive("adaptive", Adaptive);
};

export default Adaptive;
