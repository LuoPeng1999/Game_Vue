<template>
  <div class="manage">
    <el-dialog title="导航修改" :visible.sync="show" width="60%" top="5vh">
      <div class="remark">
        *备注：标签名、图标和导航等级为必填项，图标详细见<a href="https://element.eleme.cn/#/zh-CN/component/icon" target="_black">Element-ui图标</a
        >,比如用户图标el-icon-user，只需要输入user即可
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="_id" v-show="!form._id">
          <el-input v-model="form._id" style="width:300px"></el-input>
        </el-form-item>
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
        <el-form-item label="是否显示">
          <el-switch v-model="form.isShow"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">立即修改</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="manage-content">
      <common-table :tableData="tableData" :tableLabel="tableLabel" :config="config" @changePage="getList" @edit="editNavbar" @del="delNavbar"></common-table>
    </div>
  </div>
</template>

<script>
import CommonTable from "../../components/CommonTable"
export default {
  components: {
    CommonTable
  },
  data() {
    return {
      tableData: [],
      tableLabel: [
        {
          prop: "label",
          label: "标签名"
        },
        {
          prop: "path",
          label: "路由路径"
        },
        {
          prop: "name",
          label: "路由名称"
        },
        {
          prop: "url",
          label: "路径",
          width: 300
        },
        {
          prop: "icon",
          label: "图标"
        },
        {
          prop: "isShow",
          label: "是否显示"
        }
      ],
      config: {
        page: 1,
        total: 30,
        pageSize: 5,
        pageSizes: [5, 10, 25, 50],
        pagerCount: 9,
        loading: false,
        paginationShow: false,
        editBtnShow: true,
        delBtnShow: true
      },
      show: false,
      form: {
        _id: "",
        name: "",
        path: "",
        label: "",
        pid: "",
        icon: "",
        url: "",
        isShow: true
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
    getList() {
      this.config.loading = true
      this.$http.get("http://127.0.0.1:3000/navbar/getNavbar").then(res => {
        this.tableData = res.data.data.map(item => {
          item.isShow = item.isShow ? "显示" : "隐藏"
          return item
        })
        this.navbarData = this.tree(this.tableData, 0, 0, this.navbarData)
        this.config.total = res.data.data.length
        this.config.loading = false
      })
    },
    editNavbar(row) {
      row.isShow = row.isShow == "显示" ? true : false
      this.form._id = row._id
      this.form.id = row.id
      this.form.name = row.name
      this.form.path = row.path
      this.form.label = row.label
      this.form.pid = row.pid == 0 ? row.pid.toString() : Number(row.pid)
      this.form.icon = row.icon
      this.form.url = row.url
      this.form.isShow = row.isShow
      this.show = true
    },
    delNavbar(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let _id = row._id
          this.$http
            .post("http://127.0.0.1:3000/navbar/delNavbar", {
              _id
            })
            .then(res => {
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
                  this.$store.dispatch("view/setViewId")
                  this.getList()
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  })
                })
              }
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
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
          this.$http.post("http://127.0.0.1:3000/navbar/editNavbar", this.form).then(res => {
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
                this.show = false
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
    this.getList()
  }
}
</script>

<style lang="sass" scoped>
@import '~@/assets/scss/common';
</style>
