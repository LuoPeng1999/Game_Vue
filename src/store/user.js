export default {
  state: {
    token: "",
    userInfo: {}
  },
  mutations: {
    setUserInfo(state, val) {
      state.userInfo = val
    },
    clearUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {},
  modules: {}
}
