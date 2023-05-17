<!--
  @description 采集监控-基础配置-质控方案-机构名称查看
  @date 2022/03/22
-->
<template>
  <el-drawer size="40%" :visible.sync="isVisible" :before-close="close">
    <template #title>
      <div class="head">机构名称-查看</div>
    </template>

    <el-table ref="table" size="small" height="0" v-adaptive="{ bottomOffset: 160 }" :data="tableData" border>
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="机构名称" prop="name"></el-table-column>
    </el-table>
    <footer>
      <el-button size="small" @click="close">关闭</el-button>
    </footer>
  </el-drawer>
</template>

<script>
export default {
  props: {
    orgNameData: Array,
  },
  data() {
    return {
      isVisible: false,
      tableData: [],
    };
  },
  methods: {
    open(names) {
      this.tableData = names;
      this.isVisible = true;
    },
    close() {
      this.tableData = [];
      this.isVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-drawer__header {
  padding: 5px 10px 5px 0;
  margin-bottom: 0;
  border-bottom: 1px solid #e9e9e9;
  color: #303133;
}
.el-form {
  padding: 10px 10px 0 10px;
  .el-form-item {
    margin-bottom: 16px;
  }
}
.el-table {
  margin: 10px;
  width: 80%;
}
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  border-top: 1px solid #e9e9e9;
  .el-button {
    float: right;
    margin-top: 9px;
    margin-right: 10px;
  }
}
</style>