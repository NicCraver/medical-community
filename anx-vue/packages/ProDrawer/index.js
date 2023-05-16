import ProDrawer from "./src/ProDrawer";

ProDrawer.install = function (Vue) {
  Vue.component(ProDrawer.name, ProDrawer);
};

export default ProDrawer;
