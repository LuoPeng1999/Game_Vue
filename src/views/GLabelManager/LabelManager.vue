<template>
  <div class="manage">
    <el-dialog title="导航修改" :visible.sync="show" width="60%" top="5vh">
      <div class="remark">
        *备注：标签名为必填项
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="_id" v-show="!form._id">
          <el-input v-model="form._id" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="标签名" prop="label">
          <el-input v-model="form.label" style="width:300px"></el-input>
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
        label: ""
      },
      rules: {
        label: [{ required: true, message: "请输入标签名", trigger: "blur" }]
      }
    }
  },
  methods: {
    getList() {
      this.config.loading = true
      this.$http.get("http://127.0.0.1:3000/gameLabel/getGameLabel").then(res => {
        this.tableData = res.data.data
        this.config.total = res.data.total
        this.config.loading = false
      })
    },
    editNavbar(row) {
      this.form._id = row._id
      this.form.label = row.label
      this.show = true
    },
    delNavbar(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var _id = row._id
          this.$http
            .post("http://127.0.0.1:3000/gameLabel/delGameLabel", {
              _id
            })
            .then(res => {
              this.getList()
              this.$message({
                type: "success",
                message: "删除成功"
              })
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    },
    submitForm(formName) {
      var that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post("http://127.0.0.1:3000/gameLabel/editGameLabel", this.form).then(res => {
            if (res.data.mate.status == 200) {
              this.$message.success(res.data.mate.message)
              that.getList()
              this.$refs["form"].resetFields()
              this.show = false
            } else {
              this.$message.error("修改游戏标签数据失败")
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
