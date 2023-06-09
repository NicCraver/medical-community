import Vue from 'vue'
import Element from './element'
import { Adaptive } from 'anx-vue'

import OrgHosSelect from '@/components/OrgHosSelect/OrgHosSelect.vue'

Vue.component(OrgHosSelect.name, OrgHosSelect)

// 注册组件
;[...Element.components].forEach((i) => Vue.use(i))

// 注册指令服务
;[...Element.serve, Adaptive].forEach((i) => Vue.use(i.directive))

// 注册挂载方法
Element.methods.forEach((i) => {
  Vue.prototype[`$${i.name}`] = i.method
})
