<template>
  <div class="manage">
    <div class="remark">
      *备注：标签名、图标和导航等级为必填项，图标详细见<a href="https://element.eleme.cn/#/zh-CN/component/icon" target="_black">Element-ui图标</a
      >,比如用户图标el-icon-user，只需要输入user即可
    </div>
    <div class="manage-content">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签名" prop="label">
          <el-input v-model="form.label" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="路由路径">
          <el-input v-model="form.path" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="路由名称">
          <el-input v-model="form.name" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.url" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="导航等级" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择导航等级">
            <el-option label="顶级导航" class="isLevel" value="0"></el-option>
            <el-option
              v-for="(subNav, index) in navbarData"
              :key="index"
              :value="subNav.id"
              :label="subNav.label"
              :class="{ isLevel: subNav.pid == 0 }"
              :style="{ textIndent: 16 * (subNav.level - 1) + 'px' }"
            ></el-option>
          </el-select>
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
        name: "",
        path: "",
        label: "",
        pid: "",
        icon: "",
        url: ""
      },
      rules: {
        label: [{ required: true, message: "请输入标签名", trigger: "blur" }],
        icon: [{ required: true, message: "请输入图标代码", trigger: "blur" }],
        pid: [{ required: true, message: "请选择导航等级", trigger: "change" }]
      },
      navbarData: []
    }
  },
  methods: {
    getNavbar() {
      this.$http.get("http://127.0.0.1:3000/navbar/getNavbar").then(res => {
        var nav = []
        nav = res.data.data.map(item => {
          item.isShow = item.isShow ? "显示" : "隐藏"
          return item
        })
        this.navbarData = this.tree(nav, 0, 0, this.navbarData)
      })
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post("http://127.0.0.1:3000/navbar/insertNavbar", this.form).then(res => {
            if (res.data.mate.status == 200) {
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
                this.$message.success(res.data.mate.message)
                this.$store.dispatch("view/setViewId")
                this.$refs["form"].resetFields()
              })
            } else {
              this.$message.error("添加导航数据失败")
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
  created() {
    this.getNavbar()
  }
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
