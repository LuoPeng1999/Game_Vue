export default {
  namespaced: true,
  state: {
    viewId: 1
  },
  mutations: {
    setViewId: (state, payload) => {
      state.viewId++
    }
  },
  getters: {
    getViewId: state => {
      return state.viewId
    }
  },
  actions: {
    setViewId: (context, payload) => {
      context.commit("setViewId", payload)
    }
  },
  modules: {}
}
