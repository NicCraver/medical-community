// 实现ElementUI的Dialog弹窗可以拖拽移动
import drag from './drag'

const install = function (Vue) {
  Vue.directive('el-drag-dialog', drag)
}

if (window.Vue) {
  window['el-drag-dialog'] = drag
  Vue.use(install);
}

drag.install = install
export default drag
