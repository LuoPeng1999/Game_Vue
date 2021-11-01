<template>
  <div class="manage">
    <div class="remark">
      *备注：标签名为必填项
    </div>
    <div class="manage-content">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签名" prop="label">
          <el-input v-model="form.label" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        label: ""
      },
      rules: {
        label: [{ required: true, message: "请输入标签名", trigger: "blur" }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.key = this.form.label
          this.$http.post("http://127.0.0.1:3000/gameLabel/insertGameLabel", this.form).then(res => {
            if (res.data.mate.status == 200) {
              this.$message({
                type: "success",
                message: res.data.mate.message
              })
            } else {
              this.$message.error(res.data.mate.message)
              return false
            }
          })
        } else {
          this.$message.error("请输入必填项")
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.isLevel {
  font-weight: bold;
}
.remark {
  color: red;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 30px;
  margin-left: 20px;
  margin-top: 30px;
}
</style>
