import Vue from 'vue'
import Element from './element'
import { Adaptive } from 'anx-vue'


  // 注册组件
  ;[...Element.components].forEach((i) => Vue.use(i))

  // 注册指令服务
  ;[...Element.serve, Adaptive].forEach((i) => Vue.use(i.directive))

// 注册挂载方法
Element.methods.forEach((i) => {
  Vue.prototype[`$${i.name}`] = i.method
})

// echart
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;
// 树形穿梭框
import TreeTransfer from "el-tree-transfer";
Vue.component('TreeTransfer', TreeTransfer)
// dayjs
import dayjs from "dayjs";
Vue.prototype.dayjs = dayjs;
// 日历组件
import VCalendar from "v-calendar";
Vue.use(VCalendar)
//字体图标
import "@/icon/iconfont/iconfont.css";