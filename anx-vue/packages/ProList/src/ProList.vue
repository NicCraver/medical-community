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
    <main style="margin-top: 20px">
      <slot></slot>
    </main>
    
    <Pagination
      v-if="pageParams"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage1"
      :page-sizes="[10, 20, 50, 100, 200]"
      :page-size="pageParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      ref="pagination"
    >
    </Pagination>
  </div>
</template>

<script>
import { Pagination } from "element-ui";
export default {
  components: {
    Pagination,
  },
  name: "ProList",
  data() {
    return {
      currentPage: 1
    }
  },
  props: {
    pageParams: {
      type: Object,
    },
    total: {
      type: Number,
    },
    onInquire: {
      type: Function,
    },
  },
  methods: {
    // 分页 pageNum
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.onInquire();
    },
    // 分页 pageSize
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.pageParams.pageNum = 1;
      this.onInquire();
    },
  },
  watch: {
    'pageParams.pageNum'(newVal) {
      this.$refs.pagination.internalCurrentPage = newVal;
    }
  }
};
</script>

<style lang="scss" scoped>
.pro-table {
  .query-conditions {
    display: flex;
    justify-content: space-between;
    .header {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      align-items: center;
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
      margin-top: 14px;
      .el-button {
        height: 32px;
      }
      .el-button--default {
        border-color: #446abd;
        color: #5a6477 !important;
      }
    }
  }
  .batch-actions {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
}
</style>
