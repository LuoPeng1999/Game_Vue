<template>
  <div>
    用户个人中心
    <button @click="goback">返回</button>
  </div>
</template>

<script>
export default {
  methods: {
    loadJs(url, callback) {
      var script = document.createElement("script")
      script.type = "text/javascript"
      if (typeof callback != "undefined") {
        if (script.readyState) {
          script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
              script.onreadystatechange = null
              callback()
            }
          }
        } else {
          script.onload = function() {
            callback()
          }
        }
      }
      script.src = url
      document.body.appendChild(script)
    },
    goback() {
      this.$router.push({ name: "home" })
    }
  },
  mounted() {
    // this.loadJs("https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js")
    // this.loadJs("https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget/autoload.js")
  }
}
</script>

<style lang="scss" scoped></style>
