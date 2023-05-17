<template>
  <div class="pro-table">
    <div class="query-conditions">
      <div class="header">
        <slot name="header"></slot>
      </div>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="batch-actions">
      <slot name="batchActions"></slot>
    </div>
    <main style="margin-top: 10px"></main>
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.pro-table {
  .query-conditions {
    display: flex;
    justify-content: space-between;
    .header {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      div {
        margin-right: 10px;
        margin-top: 10px;
      }
      .el-input {
        width: 200px;
      }
      .el-select {
        width: 200px;
      }
      .el-date-editor {
        width: 300px;
      }
    }
    .actions {
      display: flex;
      margin-top: 10px;
      .el-button {
        height: 32px;
      }
    }
  }
  .batch-actions {
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
}
</style>
