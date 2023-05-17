<template>
  <el-card class="colEvents">
    <div class="title">
      <div class="title-info">
        <span>采集事件</span>
      </div>
      <!-- <IconSvg iconClass="more" width="24" height="24"></IconSvg> -->
    </div>
    <div class="cont" v-loading="loading">
      <el-table ref="singleTable" stripe :data="tableData">
        <el-table-column
          class="overflow-point"
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :header-align="item.headerAlign || 'center'"
          :align="item.align || 'center'"
          :fixed="item.fixed"
        >
          <template slot-scope="scope">
            {{ scope.row[item.prop] }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
<script>
export default {
  name: "colEvents",
  data() {
    return {
      loading: false,
      tableColumn: [
        { prop: "index", label: "序号", width: "50" },
        { prop: "orgDesc", label: "事件", width: "150", align: "left" },
        { prop: "time", label: "时间", width: "120" },
        { prop: "emr", label: "说明", width: "100", align: "left" },
      ],
      tableData: [],
    };
  },
  methods: {
    getNatureData() {
      this.loading = true;
    },
  },
};
</script>
<style lang="less" scoped>
.colEvents {
  height: 100%;
  .title {
    height: 30px;
    padding: 0 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(48, 49, 51, 100);
    font-size: 18px;
    font-family: SourceHanSansSC-medium;
    .title-info {
      display: flex;
      align-items: center;
      font-weight: 700;
      img {
        width: 16px;
        height: 16px;
        margin-left: 6px;
        cursor: pointer;
      }
    }
  }
  .cont {
    height: calc(100% - 40px);
    overflow: auto;
    border: 1px solid #e9e9e9;
  }
  ::v-deep .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: 0px solid #e6e6e6;
  }
  ::v-deep .el-table__cell {
    border-right: 1px solid #e9e9e9;
  }
  ::v-deep tr .el-table__cell:last-child {
    border-right: none;
  }
  ::v-deep thead tr .el-table__cell {
    background: #f2f2f2;
  }
  ::v-deep
    .el-table--striped
    .el-table__body
    tr.el-table__row--striped
    td.el-table__cell {
    background: #f2f2f2;
  }
  ::v-deep
    .el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td.el-table__cell {
    background-color: #fff;
  }
  ::v-deep
    .el-table--enable-row-hover
    .el-table__body
    tr.el-table__row--striped:hover
    > td.el-table__cell {
    background-color: #f2f2f2;
  }
  ::v-deep thead tr .el-table__cell {
    border-bottom: none !important;
  }
  ::v-deep thead tr .el-table__cell:nth-last-child(2) {
    border-right: none;
  }
}
</style>