<template>
  <div class="manage">
    <div class="manage-content">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
    </div>
  </div>
</template>

<script>
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
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
        isShow: false
      },
      rules: {
        ChineseName: [{ required: true, message: "请输入中文名称", trigger: "blur" }],
        EnglishName: [{ required: true, message: "请输入英文名称", trigger: "blur" }],
        author: [{ required: true, message: "请输入作者", trigger: "blur" }],
        date: [
          {
            type: "date",
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
      tags: []
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
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
          this.$http.post("http://127.0.0.1:3000/game/insertGame", this.form).then(res => {
            if (res.data.mate.status == 200) {
              this.$message({
                type: "success",
                message: res.data.mate.message
              })
              this.$refs["form"].resetFields()
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
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getGameLabel()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="scss" scoped>
.w {
  width: 1200px;
  margin: 0 auto;
}
</style>
