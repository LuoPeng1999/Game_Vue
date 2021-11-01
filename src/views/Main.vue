<template>
  <el-container style="height:100%">
    <el-aside width="auto"><common-aside :key="viewId"></common-aside></el-aside>
    <el-container>
      <el-header><common-header></common-header></el-header>
      <common-tab></common-tab>
      <el-main>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonHeader from "../components/CommonHeader"
import CommonAside from "../components/CommonAside"
import CommonTab from "../components/CommonTab"
import { mapGetters } from "vuex"
export default {
  components: {
    CommonHeader,
    CommonAside,
    CommonTab
  },
  computed: {
    ...mapGetters({
      viewId: "view/getViewId"
    })
  },
  mounted() {
    if (this.$store.state.tab.tabsList.length == 1) {
      this.$router.push({ name: "home" })
    } else {
      this.$router.push({ name: this.$store.state.tab.currentMenu.name })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #333;
}
.el-main {
  padding-top: 0;
}
</style>
