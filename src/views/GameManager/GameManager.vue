<template>
  <div class="manage">
    <el-dialog title="游戏修改" :visible.sync="show" width="60%" top="5vh">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="_id" v-show="!form._id">
          <el-input v-model="form._id" style="width:600px"></el-input>
        </el-form-item>
        <el-form-item label="中文名称" prop="ChineseName">
          <el-input style="width:600px" v-model="form.ChineseName" @change="ChineseNameChange"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="EnglishName">
          <el-input style="width:600px" v-model="form.EnglishName"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input style="width:600px" v-model="form.author"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-input style="width:600px" v-model="form.classify"></el-input>
        </el-form-item>
        <el-form-item label="发布时间" prop="date">
          <el-date-picker v-model="form.date" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择日期时间"> </el-date-picker>
        </el-form-item>
        <el-form-item label="详情" prop="detail">
          <el-input style="width:600px" type="textarea" v-model="form.detail"></el-input>
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input style="width:600px" v-model="form.gameVideo"></el-input>
        </el-form-item>
        <el-form-item label="下载链接" prop="downloadUrl">
          <el-input style="width:600px" v-model="form.downloadUrl"></el-input>
        </el-form-item>
        <el-form-item label="赠品链接" prop="giftUrl">
          <el-input style="width:600px" v-model="form.giftUrl"></el-input>
        </el-form-item>
        <el-form-item label="激活码" prop="activationCode">
          <el-input style="width:600px" v-model="form.activationCode"></el-input>
        </el-form-item>
        <el-form-item label="游戏分类" prop="tag">
          <el-select v-model="form.tag" class="filter-item" filterable placeholder="选择游戏分类" multiple style="width: 311px; ">
            <el-option v-for="item in tags" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
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
      <common-table :tableData="tableData" :tableLabel="tableLabel" :config="config" @changePage="getList" @edit="editGame" @del="delGame"></common-table>
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
          prop: "date",
          label: "发布时间"
          // width: 150
        },
        {
          prop: "ChineseName",
          label: "游戏中文名"
          // width: 300
        },
        {
          prop: "EnglishName",
          label: "游戏英文名"
          // width: 300
        },
        {
          prop: "author",
          label: "作者"
        },
        {
          prop: "detail",
          label: "详情"
        },
        {
          prop: "gameVideo",
          label: "视频链接"
        },
        {
          prop: "classify",
          label: "分类"
          // width: 50
        },
        {
          prop: "downloadUrl",
          label: "下载链接"
          // width: 400
        },
        {
          prop: "giftUrl",
          label: "赠品链接"
          // width: 400
        },
        {
          prop: "activationCode",
          label: "激活码"
          // width: 75
        },
        {
          prop: "isShow",
          label: "是否显示"
          // width: 75
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
      form: {
        ChineseName: "",
        EnglishName: "",
        author: "",
        classify: "",
        date: "",
        detail: "",
        downloadUrl: "",
        gameVideo: "",
        giftUrl: "",
        activationCode: "",
        tag: [],
        _id: "",
        isShow: true
      },
      rules: {
        ChineseName: [{ required: true, message: "请输入中文名称", trigger: "blur" }],
        EnglishName: [{ required: true, message: "请输入英文名称", trigger: "blur" }],
        author: [{ required: true, message: "请输入作者", trigger: "blur" }],
        date: [
          {
            required: true,
            message: "请输入发布时间",
            trigger: "blur"
          }
        ],
        classify: [{ required: true, message: "请输入中文名称", trigger: "blur" }],
        detail: [{ required: true, message: "请输入详情", trigger: "blur" }],
        downloadUrl: [{ required: true, message: "请输入下载链接", trigger: "blur" }],
        gameVideo: [{ required: true, message: "请输入视频链接", trigger: "blur" }],
        giftUrl: [{ required: true, message: "请输入赠品链接", trigger: "blur" }],
        activationCode: [
          {
            required: true,
            message: "请输入激活码",
            trigger: "blur"
          }
        ],
        tag: [{ required: true, message: "请选择游戏标签", trigger: "blur" }]
      },
      tags: [],
      show: false
    }
  },
  methods: {
    getList() {
      this.config.loading = true
      this.$http
        .get("http://127.0.0.1:3000/game/getGame", {
          params: {
            keyword: this.searchForm.keyword,
            page: this.config.page,
            pageSize: this.config.pageSize
          }
        })
        .then(res => {
          this.tableData = res.data.data.map(item => {
            item.isShow = item.isShow ? "显示" : "隐藏"
            return item
          })
          this.config.total = res.data.total
          this.config.loading = false
        })
    },
    editGame(row) {
      row.isShow = row.isShow == "显示" ? true : false
      this.form.ChineseName = row.ChineseName
      this.form.EnglishName = row.EnglishName
      this.form.author = row.author
      this.form.classify = row.classify
      this.form.date = row.date
      this.form.detail = row.detail
      this.form.downloadUrl = row.downloadUrl
      this.form.gameVideo = row.gameVideo
      this.form.giftUrl = row.giftUrl
      this.form.activationCode = row.activationCode
      this.form.tag = row.tag
      this.form._id = row._id
      this.form.isShow = row.isShow
      this.show = true
    },
    delGame(row) {
      var that = this
      this.$confirm("此操作将永久删除该游戏, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var _id = row._id
          this.$http.post("http://127.0.0.1:3000/game/delGame", {
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
    ChineseNameChange() {
      let pinyin = require("js-pinyin")
      pinyin.setOptions({ checkPolyphone: false, charCase: 0 })

      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g")
      if (this.form.ChineseName != "") {
        if (reg.test(this.form.ChineseName)) {
          this.form.classify = pinyin.getCamelChars(this.form.ChineseName).substr(0, 1)
        } else {
          var classify = pinyin.getCamelChars(this.form.ChineseName).substr(0, 1)
          this.form.classify = classify.toUpperCase()
        }
      }
    },
    getGameLabel() {
      this.$http.get("http://127.0.0.1:3000/gameLabel/getGameLabel").then(res => {
        if (res.data.mate.status == 200) {
          this.tags = res.data.data
        }
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.gameVideo == "") {
            this.form.gameVideo = "敬请期待"
          }
          this.form.date = this.getNowDate(this.form.date)
          this.$http.post("http://127.0.0.1:3000/game/editGame", this.form).then(res => {
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
    },
    getNowDate(date) {
      // 获取当前时间
      var newDate = new Date(date)
      var year = newDate.getFullYear()
      var month = newDate.getMonth() + 1
      month = month >= 10 ? month : "0" + month
      var day = newDate.getDate()
      day = day >= 10 ? day : "0" + day
      var hours = newDate.getHours()
      hours = hours >= 10 ? hours : "0" + hours
      var minutes = newDate.getMinutes()
      minutes = minutes >= 10 ? minutes : "0" + minutes
      return year + "-" + month + "-" + day + " " + hours + ":" + minutes
    }
  },
  created() {
    this.getList()
    this.getGameLabel()
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/common";
</style>
