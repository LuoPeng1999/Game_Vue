<template>
  <div class="common-table">
    <el-table :data="tableData" height="90%" stripe v-loading="config.loading">
      <af-table-column label="序号" width="85">
        <template slot-scope="scope">
          <span>{{ (config.page - 1) * config.pageSize + scope.$index + 1 }}</span>
        </template>
      </af-table-column>
      <af-table-column show-overflow-tooltip v-for="item in tableLabel" :key="item.prop" :prop="item.prop" :label="item.label">
        <!-- <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row[item.prop] }}</span>
          <el-select></el-select>
        </template> -->
      </af-table-column>
      <af-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)" v-if="config.editBtnShow">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)" v-if="config.delBtnShow">删除</el-button>
        </template>
      </af-table-column>
    </el-table>
    <!-- <el-pagination class="pager" layout="prev, pager, next" :total="config.total" :current-page.sync="config.page" @current-change="changePage">
    </el-pagination> -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="changePage"
      :current-page.sync="config.page"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="config.total"
      :pager-count="config.pagerCount"
      background
      v-if="config.paginationShow"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    tableData: Array,
    tableLabel: Array,
    config: Object
  },
  methods: {
    handleEdit(row) {
      this.$emit("edit", row)
    },
    handleDelete(row) {
      this.$emit("del", row)
    },
    changePage(page) {
      this.$emit("changePage", page)
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.$emit("changePage", this.config)
    }
  }
}
</script>

<style lang="scss" scoped>
.common-table {
  height: calc(100% - 62px);
  background-color: #fff;
  position: relative;
  .pager {
    position: absolute;
    bottom: 0px;
    right: 20px;
  }
}
.el-pagination {
  margin-top: 20px;
}
</style>
