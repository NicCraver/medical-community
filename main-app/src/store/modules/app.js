const app = {
  namespaced: true,
  state: {
    // 应用切换过渡
    appLoading: false,
    // 子路由跳转路径，用于左侧菜单渲染
    path: '',
    // 子应用名称
    appName: '',
    // 是否跨应用跳转
    isAcrossApplication: false,
    isShowMenuLogo: true,
    isShowLoginLogo: true,
    isOpenMessageFunc: true,
    isShowMessage: true,
    messageType: '', //DISE 慢病 REF 双转
    appTitle: '',
    menuTitle: '',
    hosName: '',
    menuData: null,
  },
  mutations: {
    setPathM: (state, data) => {
      state.path = data
    },
    setAppNameM: (state, data) => {
      state.appName = data
    },
    setIsAcrossApplicationM: (state, data) => {
      state.isAcrossApplication = data
    },
    setAppLoadingM: (state, data) => {
      state.appLoading = data
    },
    setIsShowMenuLogoM: (state, data) => {
      state.isShowMenuLogo = data
    },
    setIsShowLoginLogoM: (state, data) => {
      state.isShowLoginLogo = data
    },
    setIsOpenMessageFuncM: (state, data) => {
      state.isOpenMessageFunc = data
    },
    setIsShowMessageM: (state, data) => {
      state.isShowMessage = data
    },
    setAppTitleM: (state, data) => {
      state.appTitle = data
    },
    setMenuTitleM: (state, data) => {
      state.menuTitle = data
    },
    setMessageTypeM: (state, data) => {
      state.messageType = data
    },
    setHosNameM: (state, data) => {
      state.hosName = data
    },
    setMenuDataM: (state, data) => {
      state.menuData = data
    },
    setInitDataM: (state, data) => {
      // 应用切换过渡
      state.appLoading = false
      // 子路由跳转路径，用于左侧菜单渲染
      state.path = ''
      // 子应用名称
      state.appName = ''
      // 是否跨应用跳转
      state.isAcrossApplication = false
      state.isShowMenuLogo = true
      state.isShowLoginLogo = true
      state.isOpenMessageFunc = true
      state.isShowMessage = true
      state.messageType = '', //DISE 慢病 REF 双
        state.appTitle = ''
      state.menuTitle = ''
      state.hosName = ''
      state.menuData = null
    },
  },
  actions: {
    setPath({ commit }, data) {
      commit('setPathM', data)
    },
    setAppName({ commit }, data) {
      commit('setAppNameM', data)
    },
    setIsAcrossApplication({ commit }, data) {
      commit('setIsAcrossApplicationM', data)
    },
    setAppLoading({ commit }, data) {
      // console.log('data', data)
      commit('setAppLoadingM', data)
    },
    setIsShowMenuLogo({ commit }, data) {
      commit('setIsShowMenuLogoM', data)
    },
    setIsShowLoginLogo({ commit }, data) {
      commit('setIsShowLoginLogoM', data)
    },
    setIsOpenMessageFunc({ commit }, data) {
      commit('setIsOpenMessageFuncM', data)
    },
    setIsShowMessage({ commit }, data) {
      commit('setIsShowMessageM', data)
    },
    setAppTitle({ commit }, data) {
      commit('setAppTitleM', data)
    },
    setMenuTitle({ commit }, data) {
      commit('setMenuTitleM', data)
    },
    setMessageType({ commit }, data) {
      commit('setMessageTypeM', data)
    },
    setHosName({ commit }, data) {
      commit('setHosNameM', data)
    },
    setMenuData({ commit }, data) {
      commit('setMenuDataM', data)
    },
    setInitData({ commit }) {
      commit('setInitDataM', data)
    }
  },
  getters: {},
}

export default app
