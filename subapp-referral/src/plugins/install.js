import Vue from 'vue'
import Element from './element'
import { Adaptive } from 'anx-vue'

import ReferralSelect from '@/components/ReferralSelect/index.vue'
import OrgHosSelect from '@/components/OrgHosSelect/OrgHosSelect.vue'

import Print from 'vue-print-nb'
// Global instruction
Vue.use(Print)

// 注册组件
;[...Element.components].forEach((i) => Vue.use(i))

// 注册指令服务
;[...Element.serve, Adaptive].forEach((i) => Vue.use(i.directive))

// 注册挂载方法
Element.methods.forEach((i) => {
  Vue.prototype[`$${i.name}`] = i.method
})

Vue.component(ReferralSelect.name, ReferralSelect)
Vue.component(OrgHosSelect.name, OrgHosSelect)
