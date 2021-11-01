<template>
  <header>
    <div class="l-content">
      <el-button type="plain" icon="el-icon-menu" size="mini" @click="collapseMenu"></el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">
          {{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" size="mini">
        <span class="el-dropdown-link">
          <img :src="userImg" class="user" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="inPersonalCenter">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { mapState } from "vuex"
export default {
  data() {
    return {
      userImg: require("../assets/images/user.jpg")
    }
  },
  computed: {
    ...mapState({
      current: state => state.tab.currentMenu
    })
  },
  methods: {
    collapseMenu() {
      this.$store.commit("collapseMenu")
    },
    logOut() {
      this.$store.commit("clearMenu")
      this.$store.commit("clearTabsList")
      this.$store.commit("clearUserInfo")
      this.$router.push({ name: "login" })
      sessionStorage.removeItem("userInfo")
      sessionStorage.removeItem("store")
    },
    inPersonalCenter() {
      this.$router.push({ name: "personalCenter" })
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>

<style lang="scss">
.el-breadcrumb__item {
  &:last-child .el-breadcrumb__inner {
    color: #ffffff;
  }
  .el-breadcrumb__inner {
    color: #666666;
    font-weight: normal;
  }
}
</style>
