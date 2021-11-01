<template>
  <div class="bg">
    <div :class="[{ 'right-panel-active': isLogin }, 'container']">
      <!-- Register -->
      <div class="container__form container--signup">
        <div class="form" id="form1">
          <h2 class="form__title">Register</h2>
          <input type="text" placeholder="Username" class="input" v-model="registerForm.username" />
          <input type="tel" placeholder="Telephone" class="input" v-model="registerForm.telephone" />
          <input type="email" placeholder="Email" class="input" v-model="registerForm.email" />
          <input type="password" placeholder="Password" class="input" v-model="registerForm.password" />
          <button class="btn" @click="register">Register</button>
        </div>
      </div>

      <!-- Login -->
      <div class="container__form container--signin">
        <div class="form" id="form2">
          <h2 class="form__title">Login</h2>
          <input type="text" placeholder="Username" class="input" v-model="loginForm.username" />
          <input type="password" placeholder="Password" class="input" v-model="loginForm.password" />
          <div class="login_identify">
            <input type="text" placeholder="Code" v-model="code" />
            <div class="login_code" @click="refreshCode">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
          </div>
          <router-link tag="a" to="/resetPassword" class="link">Forgot your password?</router-link>
          <button class="btn" @click="login">Login</button>
        </div>
      </div>

      <!-- Overlay -->
      <div class="container__overlay">
        <div class="overlay">
          <div class="overlay__panel overlay--left">
            <button class="btn" id="Login" @click="isLogin = false">
              Login
            </button>
          </div>
          <div class="overlay__panel overlay--right">
            <button class="btn" id="Register" @click="isLogin = true">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SIdentify from "../../components/SIdentify"
export default {
  data() {
    return {
      isLogin: false,
      identifyCodes: "1234567890asdfghjklqwertyuiopzxcvbnm",
      identifyCode: "",
      code: "",
      loginForm: {
        username: "",
        password: ""
      },
      registerForm: {
        username: "",
        telephone: "",
        email: "",
        password: ""
      }
    }
  },
  components: {
    SIdentify
  },
  methods: {
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode() {
      this.identifyCode = ""
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    },
    login() {
      if (this.code == this.identifyCode) {
        this.$http.post("http://127.0.0.1:3000/address/getAddress").then(dateres => {
          if (dateres.status == 200) {
            this.loginForm.lastLoginAddr = dateres.data.content.address
            this.loginForm.lastLoginDate = this.getNowDate(new Date())
            this.$http.post("http://127.0.0.1:3000/user/login", this.loginForm).then(res => {
              if (res.data.mate.status === 200) {
                this.$message.success(res.data.mate.message)
                // 缓存登录用户信息
                this.$store.commit("setUserInfo", res.data.data)
                this.$http.get("http://127.0.0.1:3000/navbar/getNavbar").then(data => {
                  var navbarData = data.data.data
                  var nav = []
                  nav = this.tree(navbarData, 0, 0, nav)
                  nav = this.treejson(nav, 0)
                  nav.forEach(item => {
                    if (item.children.length == 0) {
                      delete item.children
                    }
                  })
                  // 缓存导航信息
                  this.$store.commit("setMenu", nav)
                  // 设置导航路由
                  this.$store.commit("addMenu", this.$router)
                  sessionStorage.setItem("userInfo", this.$store.state.user.userInfo)

                  // 销毁监听事件
                  window.removeEventListener("keyup", this.enterLogin, false)

                  // 成功则跳转页面
                  this.$router.push({ name: "home" })
                  this.refreshCode()
                  this.loginForm.username = ""
                  this.loginForm.password = ""
                  this.code = ""
                })
              } else {
                this.$message.warning(res.data.mate.message)
              }
            })
          } else {
            this.$message.warning("登录失败")
          }
        })
      } else {
        this.$message.warning("验证码输入错误")
      }
    },
    register() {
      this.$http.get("http://ip-api.com/json/?lang=zh-CN").then(dateres => {
        if (dateres.status == 200) {
          this.registerForm.lastLoginAddr = dateres.data.regionName + "省" + dateres.data.city
          this.registerForm.createDate = this.getNowDate(new Date())
          this.$http.post("http://127.0.0.1:3000/user/register", this.registerForm).then(res => {
            if (res.data.mate.status == 200) {
              this.$message({
                message: res.data.mate.message,
                type: "success"
              })
              this.registerForm.username = ""
              this.registerForm.telephone = ""
              this.registerForm.email = ""
              this.registerForm.password = ""
            } else {
              this.$message.error(res.data.mate.message)
            }
          })
        } else {
          this.$message.warning("登录失败")
        }
      })
    },
    getNowDate(date) {
      // 获取当前时间
      var newDate = new Date(date)
      var year = newDate.getFullYear()
      var month = newDate.getMonth() + 1
      month = month >= 10 ? month : "0" + month
      var day = newDate.getDate()
      day = day >= 10 ? day : "0" + day
      var hours = newDate.getHours()
      hours = hours >= 10 ? hours : "0" + hours
      var minutes = newDate.getMinutes()
      minutes = minutes >= 10 ? minutes : "0" + minutes
      var seconds = newDate.getSeconds()
      seconds = seconds >= 10 ? seconds : "0" + seconds
      return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
    },
    tree(data, pid = 0, level = 0, arr = []) {
      level++ //级别

      for (var i = 0; i < data.length; i++) {
        if (data[i].pid == pid && data[i].isShow) {
          data[i].level = level //级别
          arr.push(data[i])
          this.tree(data, data[i].id, level, arr)
        }
      }
      return arr
    },
    treejson(arr, pid = 0) {
      const temp = []
      for (const item of arr) {
        if (item.pid == pid && item.isShow) {
          item.children = this.treejson(arr, item.id)
          temp.push(item)
        }
      }
      return temp
    },
    enterLogin(e) {
      if (e.keyCode == 13) {
        this.login()
      }
    }
  },
  created() {
    this.refreshCode()
  },
  mounted() {
    window.addEventListener("keyup", this.enterLogin)
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/login";
</style>
