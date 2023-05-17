import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ruleConfigTypeData: window.g.VUE_APP_ENVIRONMENT == 'product' ?
      [
        { value: "1", label: "一致性" },
        { value: "2", label: "整合性" },
        { value: "3", label: "完整性" },
        { value: "4", label: "及时性" }
      ] : [
        { value: "1", label: "一致性" },
        { value: "2", label: "合法性" },
        { value: "3", label: "完整性" },
        { value: "4", label: "时效性" },
      ],
    activeProjectId: '', //区域&机构质控当前 id
    rulePlanIdList: "", //区域质控指定方案集合
  },
  mutations: {
    SET_ACTIVEPROJECTID(state, data) {
      state.activeProjectId = data
    },
    SET_RULEPLANIDLIST(state, data) {
      state.rulePlanIdList = data
    }
  },
  getters: {
    ruleConfigType(state) {
      return (type) => state.ruleConfigTypeData.find(item => item.value == type)?.label
    },
    rulePlanIdList(state) {
      return () => state.rulePlanIdList;
    },
  },
  actions: {
    setMenuData({
      commit
    }, data) {
      commit("SET_MENUDATA", data);
    },
    setRulePlanIdList({
      commit
    }, data) {
      commit("SET_RULEPLANIDLIST", data);
    },
  },
  modules: {
  }
})
