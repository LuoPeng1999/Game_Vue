var Mock = require("mockjs")
import homeApi from "./home"
import LoginApi from "./permission"

// 设置200-2000（单位：ms）延时
Mock.setup({
  timeout: "200-2000"
})

// 首页相关
// 拦截的是 /home/getData
Mock.mock(/\/home\/getData/, "get", homeApi.getHomeData)
Mock.mock(/\/api\/permission\/getMenu/, "post", LoginApi.getMenu)
