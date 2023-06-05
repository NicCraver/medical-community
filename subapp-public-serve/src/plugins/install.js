import Vue from 'vue'
import Element from './element'
// import { Adaptive } from 'anx-vue'
import Adaptive from "../components/Adaptive";
import OrgHosSelect from '@/components/OrgHosSelect/OrgHosSelect.vue'
import ActivityDictionary from "@/components/ActivityDictionary/index.vue";
import UniversalSelect from "@/components/UniversalSelect/index.vue";

Vue.component(OrgHosSelect.name, OrgHosSelect)
Vue.component(ActivityDictionary.name, ActivityDictionary)
Vue.component(UniversalSelect.name, UniversalSelect)

// 注册组件
;[...Element.components].forEach((i) => Vue.use(i))

// 注册指令服务
;[...Element.serve, Adaptive].forEach((i) => Vue.use(i.directive))

// 注册挂载方法
Element.methods.forEach((i) => {
  Vue.prototype[`$${i.name}`] = i.method
})
