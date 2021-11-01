import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  // {
  //   path: "/",
  //   redirect: "/login"
  // },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login/Login.vue"),
    mate: {
      keepAlive: false
    }
  },
  {
    path: "/resetPassword",
    name: "resetPassword",
    component: () => import("@/views/ResetPassword/ResetPassword.vue"),
    mate: {
      keepAlive: false
    }
  },
  {
    path: "/refresh",
    name: "refresh",
    component: () => import("@/views/Refresh/Refresh.vue"),
    mate: {
      keepAlive: false
    }
  },
  {
    path: "/personalCenter",
    name: "personalCenter",
    component: () => import("@/views/PersonalCenter/PersonalCenter.vue"),
    mate: {
      keepAlive: false
    }
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
