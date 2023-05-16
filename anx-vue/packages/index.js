import ProList from './ProList'
import ProLayout from './ProLayout'
import ProMenuLayout from './ProMenuLayout'
import IconSvg from './IconSvg'
import Adaptive from './Adaptive'
import ProTable from './ProTable'
import PatientInfoCard from './PatientInfoCard'
import ProDrawer from './ProDrawer'
import ProDialog from './ProDialog'
// import FollowUpDetail from './FollowUpDetail';

const components = [ProList, ProLayout, ProMenuLayout, IconSvg, PatientInfoCard, ProDrawer, ProDialog]

// 组件集合，用于遍历
// console.log(...components)

// 定义 install 方法
const install = function (Vue) {
  if (install.installed) return
  // 遍历注册全局组件
  components.map((component) => Vue.component(component.name, component))
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export {
  install, // 导出的对象必须具备一个 install 方法
  ProList,
  ProLayout,
  IconSvg,
  Adaptive,
  ProTable,
  PatientInfoCard,
  // FollowUpDetail,
  ProMenuLayout,
  ProDrawer,
  ProDialog,
}

export default {
  install, // 导出的对象必须具备一个 install 方法
  ProList,
  ProLayout,
  IconSvg,
  Adaptive,
  ProTable,
  PatientInfoCard,
  // FollowUpDetail,
  ProMenuLayout,
  ProDrawer,
  ProDialog,
}
