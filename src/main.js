import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"

// 引入全局配置
import "./assets/scss/reset.scss"

// 引入ElementUI组件
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
Vue.use(ElementUI)

// 引入af-table-column组件 实现列宽自适应
import AFTableColumn from "af-table-column"
Vue.use(AFTableColumn)

// 把axios的配置文件挂载到vue的属性中
import http from "@/api/config"
Vue.prototype.$http = http

// 引入字体图标
import "font-awesome/css/font-awesome.min.css"

// 引入Mock
// import "./mock"

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  var userInfo = sessionStorage.getItem("userInfo")
  if (userInfo) {
    next()
  } else {
    if (to.path == "/login") {
      next()
    } else if (to.path == "/resetPassword") {
      next()
    } else {
      next("login")
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    store.commit("addMenu", router)
  }
}).$mount("#app")
