<template>
  <div class="manage">
    <el-dialog title="游戏修改" :visible.sync="show" width="60%" top="5vh">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="_id" v-show="!form._id">
          <el-input v-model="form._id" style="width:600px"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch v-model="form.isShow"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="manage-header">
      <common-form inline :formLabel="formLabel" :form="searchForm">
        <el-button type="primary" @click="getList">搜索</el-button>
      </common-form>
    </div>
    <div class="manage-content">
      <common-table :tableData="tableData" :tableLabel="tableLabel" :config="config" @changePage="getList" @edit="editUser" @del="delUser"></common-table>
    </div>
  </div>
</template>

<script>
import CommonForm from "../../components/CommonForm"
import CommonTable from "../../components/CommonTable"
export default {
  components: {
    CommonForm,
    CommonTable
  },
  data() {
    return {
      searchForm: {
        keyword: ""
      },
      formLabel: [
        {
          model: "keyword",
          label: ""
        }
      ],
      tableData: [],
      tableLabel: [
        {
          prop: "username",
          label: "用户名"
        },
        {
          prop: "tel",
          label: "电话"
        },
        {
          prop: "email",
          label: "邮箱"
        },
        {
          prop: "createDate",
          label: "创建时间"
        },
        {
          prop: "lastLoginDate",
          label: "最后登录时间"
        },
        {
          prop: "lastLoginAddr",
          label: "上次登录地点"
        },
        {
          prop: "isAdmin",
          label: "身份"
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
        paginationShow: true,
        editBtnShow: true,
        delBtnShow: true
      },
      show: false,
      form: {
        _id: "",
        isShow: false
      }
    }
  },
  methods: {
    getList() {
      this.config.loading = true
      this.$http
        .get("http://127.0.0.1:3000/user/getUser", {
          params: {
            page: this.config.page,
            pageSize: this.config.pageSize,
            keyword: this.searchForm.keyword
          }
        })
        .then(res => {
          this.tableData = res.data.data.map(item => {
            item.isAdmin = item.isAdmin ? "管理员" : "观察者"
            item.isShow = item.isShow ? "显示" : "隐藏"
            return item
          })
          this.config.total = res.data.count
          this.config.loading = false
        })
    },
    editUser(row) {
      row.isShow = row.isShow == "显示" ? true : false
      this.form.isShow = row.isShow
      this.form._id = row._id
      this.show = true
    },
    delUser(row) {
      var that = this
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var _id = row._id
          this.$http.post("http://127.0.0.1:3000/user/delUser", {
            _id
          })
        })
        .then(res => {
          that.getList()
          this.$message({
            type: "success",
            message: "删除成功!"
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    confirm() {
      if (this.operateType === "edit") {
        this.$http.post("接口", this.operateForm).then(res => {
          console.log(res)
          this.isShow = false
          this.getList()
        })
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post("http://127.0.0.1:3000/user/editUser", this.form).then(res => {
            if (res.data.mate.status == 200) {
              this.$message({
                type: "success",
                message: res.data.mate.message
              })
              this.$refs["form"].resetFields()
              this.getList()
            } else {
              this.$message.error(res.data.mate.message)
            }
          })
        } else {
          this.$message.error("请确认所有游戏的属性值是否填写完整")
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
