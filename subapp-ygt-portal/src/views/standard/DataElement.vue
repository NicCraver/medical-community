<!-- 
  @description 标准管理-数据元标准
  @date 2021/8/23
 -->
<template>
  <div class="data-element">
    <div class="protal-title">数据元标准</div>
    <div class="protal-main">
      <el-card>
        <header>
          <span>数据元列表</span>
        </header>
        <!-- 搜索行 -->
        <el-row class="search">
          <el-input placeholder="数据元名称/标识符" size="small" v-model="tableSearchName" clearable></el-input>
          <el-button type="primary" @click="getTableData">搜索</el-button>
        </el-row>
        <!-- 操作行 -->
        <el-row class="operate">
          <el-button icon="iconfont icon-plus" @click="$refs.add.open('新增')">新增</el-button>
          <el-button icon="iconfont icon-edit" @click="tableEdit">编辑</el-button>
          <el-button icon="iconfont icon-delete" @click="tableDelete">删除</el-button>
        </el-row>

        <div class="table">
          <el-table border stripe height="100%" ref="table" size="small" :data="tableData" @row-click="tableRowClick" @selection-change="tableSelectionChange" v-loading="loading" element-loading-text="加载中..." tooltip-effect="light">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="standardName" label="标准名称" show-overflow-tooltip min-width="120"></el-table-column>
            <el-table-column prop="dataElementCode" label="数据元标识符" min-width="150"></el-table-column>
            <el-table-column prop="customCode" label="自定义标识符" min-width="120"></el-table-column>
            <el-table-column prop="dataElementName" label="数据元名称" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="数据类型" min-width="120">
              <template slot-scope="{row}">{{dataType(row.dataType)}}</template>
            </el-table-column>
            <el-table-column prop="representationFormat" label="表示格式" min-width="120"></el-table-column>
            <el-table-column prop="valueDomainName" label="值域名称" min-width="150"></el-table-column>
            <el-table-column prop="allowValue" label="允许值" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" fixed="right" width="80">
              <template slot-scope="{row}"><span :style="{color: row.status == '1' ? '#606266' : '#EE0C00'}">{{row.status == '1' ? '已启用' : '已关闭'}}</span></template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination class="fr" layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="tableDataLength" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </el-card>
    </div>

    <add ref="add" :standardTypeData="standardTypeData" :domainData="domainData" @addSubmit="getTableData"></add>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Add from "./dataElement/Add.vue";

import {
  getDataElement,
  getDataElementStandardType,
  deleteDataElement,
  getDomainSelect,
} from "api/standard.js";

export default {
  components: {
    Add,
  },
  computed: {
    ...mapGetters(["dataType"]),
  },
  data() {
    return {
      tableSearchName: "", //数据元名称/标识符
      tableData: [],
      tableDataLength: 0,
      standardTypeData: [], //标准类型下拉选项
      domainData: [], //值域下拉选项
      multipleSelection: [], // 表格被选中的内容
      loading: false,
      currentPage: 1, //当前页
      pageSize: 10, //每页多少条
    };
  },
  mounted() {
    // 获取标准类型下拉选项
    this.getTableData();
    getDataElementStandardType().then((res) => {
      this.standardTypeData = res.result;
    });
    // 获取值域下拉选项
    getDomainSelect().then((res) => {
      this.domainData = res.result;
      this.domainData.unshift({ code: "", name: "-" });
    });
  },
  methods: {
    //编辑button click
    tableEdit() {
      if (this.multipleSelection.length === 1) {
        this.$refs.add.open(
          "编辑",
          JSON.parse(JSON.stringify(this.multipleSelection[0]))
        );
      } else {
        this.$message("请选择一条数据");
      }
    },
    //删除button click
    tableDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message("请选择一条数据");
      } else {
        this.$confirm("是否确认删除选中的数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let param = [];
            this.multipleSelection.forEach((item) => {
              param.push(item.dataElementCode);
            });
            deleteDataElement(param).then((res) => {
              if (res.code == 0) {
                this.getTableData();
                this.$message.success("删除成功");
              }
            });
          })
          .catch(() => {});
      }
    },

    // 获取数据元列表数据
    getTableData() {
      this.loading = true;
      getDataElement({
        content: this.tableSearchName,
        pageNum: this.currentPage.toString(),
        pageSize: this.pageSize.toString(),
      })
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.result;
            this.tableDataLength = res.total;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //table行点击事件
    tableRowClick(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    //table选择项发生变化事件
    tableSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
.data-element {
  height: 100%;
}

.el-card {
  height: 100%;
  width: 100%;
  ::v-deep .el-card__body {
    padding: 0;
  }
  header {
    position: relative;
    height: 50px;
    line-height: 50px;
    padding: 0 16px;
    &::before {
      content: "";
      position: absolute;
      top: 15px;
      left: 0;
      width: 3px;
      height: 20px;
      background-color: #134796;
    }
    span {
      font-size: 16px;
      font-weight: 700;
    }
  }
  .el-row {
    height: 32px;
    line-height: 32px;
    margin-bottom: 16px;
    padding: 0 16px;
  }
  .search {
    .el-input {
      width: 220px;
      margin-right: 32px;
    }
  }
  .table {
    height: calc(100% - 162px - 48px);
    padding: 0 16px;
  }
  .el-pagination {
    margin: 16px 16px 0 0;
  }
}
</style>