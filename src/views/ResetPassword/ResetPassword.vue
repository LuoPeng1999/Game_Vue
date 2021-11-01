<template>
  <div class="resetPassword">
    <div class="resetPassword-banner">
      <div class="resetPassword-header">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="身份验证"></el-step>
          <el-step title="密码重置"></el-step>
          <el-step title="重置完成"></el-step>
        </el-steps>
      </div>
      <div class="resetPassword-items">
        <div class="resetPassword-content" v-if="active == 0">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="邮箱" prop="mail" style="margin-top:40px">
              <el-input type="text" v-model="ruleForm.mail" placeholder="请输入邮箱" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱验证码" prop="mailCode" style="margin-top:40px">
              <div class="my-form-inline">
                <div class="my-form-item">
                  <el-input placeholder="请输入邮箱验证码" v-model="ruleForm.mailCode"></el-input>
                </div>
                <div class="my-form-item">
                  <button type="button" class="primary" :disabled="mailCodeFlag" @click="getVerifyCode">{{ mailCodeContent }}</button>
                </div>
              </div>
            </el-form-item>
            <el-form-item style="margin-top:40px">
              <el-button type="primary" @click="goLogin">返回登录</el-button>
              <el-button type="primary" @click="verifyCode">下一步</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="resetPassword-content" v-if="active == 1">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="密码" prop="password" style="margin-top:40px">
              <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword" style="margin-top:40px">
              <el-input type="password" v-model="ruleForm.repassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:40px">
              <el-button type="primary" @click="goLogin">返回登录</el-button>
              <el-button type="primary" @click="resetPassword">下一步</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="resetPassword-content" v-if="active == 2 || active == 3">
          <div class="resetPassword-success">
            <div class="success-item">
              <img class="setPasswordSuccess" src="../../assets/images/setPasswordSuccess.png" alt="密码重置成功" />
            </div>
            <div class="success-item">
              <el-button type="primary" @click="goLogin">返回登录</el-button>
              <p>密码重置成功！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validateMail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("邮箱不能为空"))
      }
      setTimeout(() => {
        if (!value) {
          callback(new Error("请输入邮箱"))
        } else {
          var mailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (!mailReg.test(value)) {
            callback(new Error("请输入正确的邮箱"))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var validateMailCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空"))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入验证码"))
        } else {
          callback()
        }
      }, 1000)
    }
    var validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"))
      } else {
        if (this.ruleForm.repassword !== "") {
          this.$refs.ruleForm.validateField("repassword")
        }
        callback()
      }
    }
    var validateRepassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"))
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"))
      } else {
        callback()
      }
    }
    return {
      active: 0,
      ruleForm: {
        mail: "",
        mailCode: "",
        password: "",
        repassword: "",
        oldPassword: ""
      },
      CodeId: 0,
      mailCodeContent: "发送验证码",
      mailCodeFlag: false,
      mailCodeTime: 300,
      mailCountFlag: true,
      rules: {
        mail: [{ validator: validateMail, trigger: "blur" }],
        mailCode: [{ validator: validateMailCode, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        repassword: [{ validator: validateRepassword, trigger: "blur" }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!")
        } else {
          console.log("error submit!!")
          return false
        }
      })
    },
    goLogin() {
      this.$router.push({ name: "login" })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getVerifyCode() {
      this.mailCodeFlag = true
      this.mailCodeContent = this.mailCodeTime + "s后重新发送"
      if (this.mailCountFlag) {
        this.mailCountFlag = false
        var obj = {
          params: {}
        }
        obj.email = this.ruleForm.mail
        this.$http.post("http://127.0.0.1:3000/user/sendMail", obj).then(res => {
          if (res.data.mate.status == 200) {
            this.CodeId = Number(res.data.id)
            this.$message({
              message: res.data.mate.message,
              type: "success"
            })
          } else {
            this.$message.error(res.data.mate.message)
          }
        })
      }
      let mailClock = window.setInterval(() => {
        this.mailCodeTime -= 1
        this.mailCodeContent = this.mailCodeTime + "s后重新发送"
        if (this.mailCodeTime < 0) {
          window.clearInterval(mailClock)
          this.mailCodeContent = "重新发送验证码"
          this.mailCodeTime = 300
          this.mailCodeFlag = false
          this.mailCountFlag = true
        }
      }, 1000)
    },
    verifyCode() {
      this.$http.post("http://127.0.0.1:3000/user/verifyCode", { id: this.CodeId, code: this.ruleForm.mailCode }).then(res => {
        if (res.data.mate.status == 200) {
          this.$message({
            message: res.data.mate.message,
            type: "success"
          })
          this.active = 1
        } else {
          this.$message.error(res.data.mate.message)
        }
      })
    },
    resetPassword() {
      var obj = {}
      obj.email = this.ruleForm.mail
      obj.password = this.ruleForm.password
      this.$http.post("http://127.0.0.1:3000/user/resetPassword", obj).then(res => {
        if (res.data.mate.status == 200) {
          this.active = 3
          this.$message({
            type: "success",
            message: res.data.mate.message
          })
        } else {
          this.$message.error(res.data.mate.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.resetPassword {
  width: 100%;
  height: 100%;
  background: url("../../assets/images/banner.jpg") no-repeat;
  background-size: 100% 100%;
  .resetPassword-banner {
    width: 800px;
    position: relative;
    left: 50%;
    top: 100px;
    margin-left: -400px;
    background-color: #ffffff;
    overflow: hidden;
    .resetPassword-header {
      width: 100%;
      margin-top: 20px;
      padding-bottom: 20px;
      border-bottom: 4px solid #ccc;
    }
    .resetPassword-items {
      width: 60%;
      height: 350px;
      margin: 0 auto;
      margin-top: 20px;
      .resetPassword-content {
        width: 100%;
        height: 280px;
        border-bottom: 3px solid #ccc;
        .my-form-inline {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .resetPassword-success {
          width: 100%;
          display: flex;
          .success-item {
            text-align: center;
            flex: auto;
            .setPasswordSuccess {
              width: 300px;
              display: inline-block;
            }
            & > p {
              margin-top: 20px;
              color: #67c23a;
              font-size: 18px;
              font-weight: bold;
            }
            & > .el-button {
              display: inline-block;
              margin-top: 100px;
            }
          }
        }
      }
    }
  }
}
.primary {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #409eff;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #409eff;
}
</style>
