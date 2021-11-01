<template>
  <div id="app">
    <!-- <keep-alive> -->
    <router-view />
    <!-- </keep-alive> -->
  </div>
</template>

<script>
export default {
  created() {
    // console.log(JSON.stringify(this.$store.state))
    // // 获取store数据
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
      // 保留当前页面状态
      this.$store.commit("addMenu", this.$router)
    }
    // 监听浏览器刷新 存储store数据
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })
  }
}
</script>

<style lang="scss">
#app {
  height: 100vh;
}
</style>
