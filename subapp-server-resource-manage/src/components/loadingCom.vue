<template>
  <!-- :visible.sync="isVisible" -->
  <el-dialog
    v-bind="$attrs"
    :close-on-click-modal="false"
    :show-close="false"
    top="45vh"
  >
    <div class="cont">
      <div
        class="loadingCls"
        v-loading="true"
        element-loading-spinner="el-icon-loading"
      ></div>
      <div class="textCls">{{ $attrs.text }}</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "loadingCom",
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.cont {
  height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .loadingCls {
    height: 20px;
    width: 20px;
    margin-right: 20px;
    ::v-deep .el-loading-spinner {
      top: 0;
      margin-top: 0;
    }
  }
}
::v-deep .el-dialog__header {
  padding: 0;
}
::v-deep .el-dialog__body {
  padding: 10px;
}
</style>