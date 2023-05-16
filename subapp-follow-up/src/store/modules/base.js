export default {
  namespaced: true,
  state: {
    patientList: [],
  },
  getters: {
    patientList: (state) => state.patientList,
  },
  mutations: {
    SET_PATIENTlIST(state, data) {
      state.patientList = data;
    },
  },
  actions: {
    setPatientList({ commit }, data) {
      commit("SET_PATIENTlIST", data);
    },
  },
};
