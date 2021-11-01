export default {
  state: {
    isCollapse: false,
    currentMenu: null,
    menu: [],
    tabsList: [
      {
        path: "/",
        name: "home",
        label: "首页",
        icon: "home",
        mate: {
          keepAlive: true
        }
      }
    ]
  },
  mutations: {
    setMenu(state, val) {
      state.menu = val
    },
    clearMenu(state) {
      state.menu = []
    },
    clearTabsList(state) {
      state.tabsList = [
        {
          path: "/",
          name: "home",
          label: "首页",
          icon: "home",
          mate: {
            keepAlive: true
          }
        }
      ]
    },
    addMenu(state, router) {
      let currentMenu = [
        {
          path: "/",
          component: () => import("@/views/Main.vue"),
          children: []
        }
      ]
      state.menu.forEach(item => {
        if (item.children) {
          item.children = item.children.map(item => {
            item.component = () => import(`@/views/${item.url}`)
            // item.component = resolve => require([`@/views/${item.url}`], resolve)
            return item
          })
          currentMenu[0].children.push(...item.children)
        } else {
          item.component = () => import(`@/views/${item.url}`)
          // item.component = resolve => require([`@/views/${item.url}`], resolve)
          currentMenu[0].children.push(item)
        }
      })
      router.addRoutes(currentMenu)
    },
    selectMenu(state, val) {
      // if (val.name !== "home") {
      //   state.currentMenu = val
      //   let result = state.tabsList.findIndex(item => item.name === val.name)
      //   result === -1 ? state.tabsList.push(val) : ""
      // } else {
      //   state.currentMenu = null
      // }
      state.currentMenu = val
      let result = state.tabsList.findIndex(item => item.name === val.name)
      result === -1 ? state.tabsList.push(val) : ""
    },
    closeTab(state, val) {
      let result = state.tabsList.findIndex(item => item.name === val.name)
      state.tabsList.splice(result, 1)
    },
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {},
  modules: {}
}
