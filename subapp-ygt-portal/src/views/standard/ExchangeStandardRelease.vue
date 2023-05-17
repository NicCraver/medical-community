<!-- 
  @description 标准管理-交换标准-交换标准发布
  @date 2021/9/23
 -->
<template>
  <div class="exchange-release">
    <div class="protal-title">交换标准发布</div>
    <div class="protal-main">
      <div class="search">
        <el-input v-model="search" placeholder="编码/标准名称" size="small" clearable></el-input>
        <el-button type="primary" @click="getTableData">搜索</el-button>
      </div>
      <el-card>
        <el-tabs v-model="activeName" @tab-click="getTableData">
          <el-tab-pane label="待发布" name="unrelease" class="unrelease">
            <el-button type="primary" @click="batchPublish">批量发布</el-button>
            <div class="table">
              <el-table border stripe size="small" height="100%" ref="unrTable" v-loading="unrLoading" :data="unrTableData" @selection-change="unrTableSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="code" label="交换标准编码"></el-table-column>
                <el-table-column prop="name" label="交换标准名称"></el-table-column>
                <el-table-column prop="modifyDate" label="修改日期"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="{row}">
                    <el-button type="text" @click="rowPublish(row)">发布</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination class="fr" layout="total, sizes, prev, pager, next, jumper" :current-page="unrCurrentPage" :page-sizes="[10, 20, 50, 100]" :page-size="unrPageSize" :total="unrTableDataTotal" @size-change="unrSizeChange" @current-change="unrCurrentChange"></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="已发布" name="released" class="released">
            <el-button type="primary" @click="batchStop">批量停用</el-button>
            <div class="table">
              <el-table border stripe size="small" height="100%" ref="rtable" v-loading="rLoading" :data="rTableData" @selection-change="rTableSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="code" label="交换标准编码"></el-table-column>
                <el-table-column prop="name" label="交换标准名称"></el-table-column>
                <el-table-column prop="publishDate" label="发布日期"></el-table-column>
                <el-table-column prop="version" label="发布版本号" width="120"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                  <template slot-scope="{row}">
                    <el-button type="text" @click="$refs.detail.open(row.id)">详情</el-button>
                    <el-button type="text" @click="rowStop(row)">停用</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination class="fr" layout="total, sizes, prev, pager, next, jumper" :current-page="rCurrentPage" :page-sizes="[10, 20, 50, 100]" :page-size="rPageSize" :total="rTableDataTotal" @size-change="rSizeChange" @current-change="rCurrentChange"></el-pagination>
          </el-tab-pane>
          <el-tab-pane label="已停用" name="stopped" class="stop">
            <div class="table">
              <el-table border stripe size="small" height="100%" ref="stopTable" v-loading="stopLoading" :data="stopTableData">
                <el-table-column type="index" width="50" label="序号"></el-table-column>
                <el-table-column prop="code" label="交换标准编码"></el-table-column>
                <el-table-column prop="name" label="交换标准名称"></el-table-column>
                <el-table-column prop="publishDate" label="发布日期"></el-table-column>
                <el-table-column prop="version" label="发布版本号" width="120"></el-table-column>
                <el-table-column prop="deactivateDate" label="停用日期"></el-table-column>
              </el-table>
            </div>
            <el-pagination class="fr" layout="total, sizes, prev, pager, next, jumper" :current-page="stopCurrentPage" :page-sizes="[10, 20, 50, 100]" :page-size="stopPageSize" :total="stopTableDataTotal" @size-change="stopSizeChange" @current-change="stopCurrentChange"></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <detail ref="detail"></detail>
  </div>
</template>

<script>
import detail from "./exchangeStandard/ExchangeConfigDetail.vue";

import {
  getExchangeList,
  publishExchangeList,
  stopExchangeList,
  getDeactivateExchangeList,
} from "api/standard.js";

export default {
  components: { detail },
  data() {
    return {
      search: "", //搜索条件
      activeName: "unrelease",
      unrTableData: [], //待发布表格数据
      unrTableSelection: [], //待发布表格被选中的内容
      unrTableDataTotal: 0,
      unrCurrentPage: 1, //待发布-当前页
      unrPageSize: 10, //待发布-每页多少条
      unrLoading: false,
      rTableData: [], //已发布表格数据
      rTableSelection: [], //已发布表格被选中的内容
      rTableDataTotal: 0,
      rCurrentPage: 1, //已发布-当前页
      rPageSize: 10, //已发布-每页多少条
      rLoading: false,
      stopTableData: [], //已停用表格数据
      stopTableDataTotal: 0,
      stopCurrentPage: 1, //已发布-当前页
      stopPageSize: 10, //已发布-每页多少条
      stopLoading: false,
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      if (this.activeName === "unrelease") {
        this.unrLoading = true;
        getExchangeList({
          content: this.search,
          publishStatus: "0",
          pageNum: this.unrCurrentPage.toString(),
          pageSize: this.unrPageSize.toString(),
        })
          .then((res) => {
            if (res.code == 0) {
              this.unrTableData = res.result;
              this.unrTableDataTotal = res.total;
            }
            this.unrLoading = false;
          })
          .catch((err) => {
            this.unrLoading = false;
          });
      } else if (this.activeName === "released") {
        this.rLoading = true;
        getExchangeList({
          content: this.search,
          publishStatus: "1",
          pageNum: this.rCurrentPage.toString(),
          pageSize: this.rPageSize.toString(),
        })
          .then((res) => {
            if (res.code == 0) {
              this.rTableData = res.result;
              this.rTableDataTotal = res.total;
            }
            this.rLoading = false;
          })
          .catch((err) => {
            this.rLoading = false;
          });
      } else {
        this.stopLoading = true;
        getDeactivateExchangeList({
          content: this.search,
          pageNum: this.stopCurrentPage,
          pageSize: this.stopPageSize,
        })
          .then((res) => {
            if (res.code == 0) {
              this.stopTableData = res.result;
              this.stopTableDataTotal = res.total;
            }
            this.stopLoading = false;
          })
          .catch((err) => {
            this.stopLoading = false;
          });
      }
    },
    // 批量发布
    batchPublish() {
      if (this.unrTableSelection.length === 0) {
        this.$message("请选择一条数据");
      } else {
        this.$confirm("是否确认发布选中的数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let param = [];
            this.unrTableSelection.forEach((item) => {
              param.push(item.id);
            });
            this.publish(param);
          })
          .catch(() => {});
      }
    },
    // 行内发布
    rowPublish(data) {
      this.$confirm("是否确认发布选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.publish([data.id]);
        })
        .catch(() => {});
    },
    // 发布接口
    publish(param) {
      this.unrLoading = true;
      publishExchangeList(param)
        .then((res) => {
          if (res.code == 0) {
            this.getTableData();
            this.$message.success("发布成功");
          } else {
            this.unrLoading = false;
          }
        })
        .catch((err) => {
          this.unrLoading = false;
        });
    },
    // 批量停用
    batchStop() {
      if (this.rTableSelection.length === 0) {
        this.$message("请选择一条数据");
      } else {
        this.$confirm("是否确认停用选中的数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let param = [];
            this.rTableSelection.forEach((item) => {
              param.push(item.id);
            });
            this.stop(param);
          })
          .catch(() => {});
      }
    },
    // 行内停用
    rowStop(data) {
      this.$confirm("是否确认停用选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.stop([data.id]);
        })
        .catch(() => {});
    },
    // 停用接口
    stop(param) {
      this.rLoading = true;
      stopExchangeList(param)
        .then((res) => {
          if (res.code == 0) {
            this.getTableData();
            this.$message.success("停用成功");
          } else {
            this.rLoading = false;
          }
        })
        .catch((err) => {
          this.rLoading = false;
        });
    },

    // 待发布-table选择项发生变化事件
    unrTableSelectionChange(selection) {
      this.unrTableSelection = selection;
    },
    // 待发布-分页
    unrSizeChange(val) {
      this.unrPageSize = val;
      this.getTableData();
    },
    unrCurrentChange(val) {
      this.unrCurrentPage = val;
      this.getTableData();
    },
    // 已发布-table选择项发生变化事件
    rTableSelectionChange(selection) {
      this.rTableSelection = selection;
    },
    // 已发布-table行点击事件
    rTableRowClick(row) {
      this.$refs.rtable.toggleRowSelection(row);
    },
    // 已发布-分页
    rSizeChange(val) {
      this.rPageSize = val;
      this.getTableData();
    },
    rCurrentChange(val) {
      this.rCurrentPage = val;
      this.getTableData();
    },
    // 已停用-分页
    stopSizeChange(val) {
      this.stopPageSize = val;
      this.getTableData();
    },
    stopCurrentChange(val) {
      this.stopCurrentPage = val;
      this.getTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
.exchange-release {
  height: 100%;
  .protal-main {
    padding: 0;
  }
}
.search {
  height: 50px;
  line-height: 50px;
  padding: 0 16px;
  background-color: #fff;
  .el-input {
    width: 220px;
    margin-right: 32px;
  }
}
.el-card {
  height: calc(100% - 82px);
  width: calc(100% - 32px);
  margin: 16px;
  .el-tabs {
    height: 100%;
    ::v-deep .el-tabs__header {
      margin-bottom: 16px;
    }
    ::v-deep .el-tabs__item {
      height: 32px;
      line-height: 32px;
    }
    ::v-deep .el-tabs__content {
      height: calc(100% - 48px);
    }
    .unrelease,
    .released {
      height: 100%;
      > .el-button {
        margin-bottom: 16px;
      }
      .table {
        height: calc(100% - 98px);
      }
    }
    .stop {
      height: 100%;
      .table {
        height: calc(100% - 48px);
      }
    }
    .el-pagination {
      margin-top: 16px;
    }
  }
}
</style>