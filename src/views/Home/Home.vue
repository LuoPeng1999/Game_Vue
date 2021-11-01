<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8">
      <el-card shadow="hover">
        <div class="user">
          <img :src="userImg" alt="" />
          <div class="userinfo">
            <p class="name">{{ name }}</p>
            <p class="access">{{ access }}</p>
          </div>
        </div>
        <div class="login-info">
          <p>
            上次登录时间：<span>{{ lastLoginDate }}</span>
          </p>
          <p>
            上次登录地点：<span>{{ lastLoginAddr }}</span>
          </p>
        </div>
      </el-card>
      <el-card shadow="hover" style="height:522px;margin-top:20px"> </el-card>
    </el-col>
    <el-col :span="16">
      <el-card shadow="hover">
        <div style="height: 280px"></div>
      </el-card>
      <div class="graph">
        <el-card shadow="hover">
          <div style="height: 416px"></div>
        </el-card>
        <el-card shadow="hover">
          <div style="height: 416px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      lastLoginDate: "",
      lastLoginAddr: "",
      access: "",
      userImg: require("../../assets/images/user.jpg")
    }
  },
  methods: {
    formattDate(date) {
      var newDate = new Date(date)
      var year = newDate.getFullYear()
      var month = newDate.getMonth()
      month = month >= 10 ? month : "0" + month
      var day = newDate.getDate()
      day = day >= 10 ? day : "0" + day
      var minutes = newDate.getMinutes()
      minutes = minutes >= 10 ? minutes : "0" + minutes
      var hours = newDate.getHours()
      hours = hours >= 10 ? hours : "0" + hours
      var seconds = newDate.getSeconds()
      seconds = seconds >= 10 ? seconds : "0" + seconds
      return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
    }
  },
  mounted() {
    this.name = this.$store.state.user.userInfo.username
    this.lastLoginDate = this.$store.state.user.userInfo.lastLoginDate
    this.lastLoginAddr = this.$store.state.user.userInfo.lastLoginAddr
    this.access = this.$store.state.user.userInfo.isAdmin == 0 ? "超级管理员" : "普通管理员"
  }
}
</script>

<style lang="sass" scoped>
@import '~@/assets/scss/home';
</style>
