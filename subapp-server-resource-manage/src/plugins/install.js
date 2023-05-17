import Vue from 'vue'
import Element from './element'
// import Adaptive from "../components/Adaptive";
import { Adaptive } from 'anx-vue'
import ActivityDictionary from "@/components/ActivityDictionary/index.vue";
import UniversalSelect from "@/components/UniversalSelect/index.vue";

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

//引入字体图标
import "@/icon/iconfont/iconfont.css";
// 复制
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);
// 树形穿梭框
import TreeTransfer from "el-tree-transfer";
Vue.component('TreeTransfer', TreeTransfer)
// svg
import "@/icon/index.js";
// echart
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;
// dayjs
import dayjs from "dayjs";
const isToday = require('dayjs/plugin/isToday')
dayjs.extend(isToday)
Vue.prototype.dayjs = dayjs;
//codeTransform
import codeTransform from "@/directive/codeTransform.js";
Vue.use(codeTransform);