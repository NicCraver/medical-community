import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dataTypeData: [
      { value: "S", label: "S-字符型" },
      { value: "L", label: "L-布尔型" },
      { value: "N", label: "N-数值型" },
      { value: "D", label: "D-日期型" },
      { value: "DT", label: "DT-日期时间型" },
      // { value: "BY", label: "BY-二进制 " },
    ], //数据类型下拉选项
    diseaseTypeData: [
      { value: '1', label: '高血压' },
      { value: '2', label: '糖尿病' },
      { value: '3', label: '结核病' },
    ], //门户-健康管理:慢病类型
    messageTypeData: [
      { value: '1', label: 'App推送' },
      { value: '2', label: '手机短信' },
      { value: '3', label: '邮件' },
    ],// 门户-消息:发送方式
    menuManageId: '', //菜单管理页面的系统id
    uploadUrl: window.g.VUE_APP_BASE_API + "/ygt-api/general/uploadPic", //图片上传接口
  },
  getters: {
    dataType(state) {
      return (type) => state.dataTypeData.find(item => item.value == type)?.label
    },
    diseaseType(state) {
      return (type) => state.diseaseTypeData.find(item => item.value == type)?.label
    },
    msgTitle(state) {
      return (v) => state.messageTypeData.find(item => item.value == v)?.label
    },
  },
  mutations: {
    menuManageIdChange(state, id) {
      state.menuManageId = id
    },
  },
  actions: {
  },
  modules: {
  }
})
