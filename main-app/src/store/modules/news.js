const app = {
  namespaced: true,
  state: {
    // 是否显示红点
    dotFlag: false,
  },
  mutations: {
    setDotFlagM: (state, data) => {
      state.dotFlag = data
    },
  },
  actions: {
    setDotFlag({ commit }, data) {
      commit('setDotFlagM', data)
    },
  },
  getters: {},
}

export default app
