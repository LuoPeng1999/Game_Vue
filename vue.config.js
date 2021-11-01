module.exports = {
  // baseUrl: "/",
  devServer: {
    port: 3333,
    open: true
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/_variable.scss";` //引入全局变量
      }
    }
  }
}
