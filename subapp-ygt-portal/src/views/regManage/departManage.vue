<!--
  @description 注册管理系统-部门注册
  @date 2021/11/02
-->
<template>
  <div class="departManage">
    <div class="protal-title">部门注册</div>
    <div class="protal-main">
      <el-card class="left">
        <header class="protal-header">目录树</header>
        <el-input placeholder="请输入机构名称" v-model="filterText" size="small"></el-input>
        <div class="tree">
          <el-scrollbar>
            <el-tree ref="tree" :data="treeData" :props="treeProps" :filter-node-method="filterTreeNode" :expand-on-click-node="false" highlight-current default-expand-all @node-click="nodeClick">
              <span slot-scope="{ node }" class="custom-tree-node">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-card>
      <el-card class="right">
        <div class="search">
          <el-input v-model="queryParams.patName" clearable size="small" placeholder="关键字" />
          <span class="state">状态：</span>
          <el-select v-model="queryParams.state" size="small">
            <el-option v-for="(item, index) in stateOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <div class="float-right">
            <el-button type="primary" @click="searchFuc">查询</el-button>
            <el-button @click="setOut">导出</el-button>
          </div>
        </div>
        <div class="table-cont">
          <el-table ref="singleTable" :data="tableData" border height="100%" v-loading="loading">
            <el-table-column label="序号" type="index" width="50" />
            <el-table-column v-for="(item, index) in columnParams" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width" />
          </el-table>
        </div>
        <div class="pagination-cont float-right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageParams.pageNum" :page-sizes="[10, 20, 50, 100, 200]" :page-size="pageParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageParams.total">
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getOnQueryOrgsTree,
  getOnQueryOrgs,
  setOutExportOrgExcel,
} from "api/regManage.js";

export default {
  name: "departManage",
  data() {
    return {
      //左侧组织名称搜索input,
      filterText: "",
      treeData: [],
      //左侧树
      treeProps: {
        children: "children",
        label: "label",
      },
      loading: false,
      columnParams: [
        {
          prop: "",
          label: "所属机构",
          width: 80,
        },
        {
          prop: "orgDesc",
          label: "科室名称",
          width: 80,
        },
        {
          prop: "",
          label: "科室代码",
          width: 80,
        },
        {
          prop: "standardDept",
          label: "标准科室",
          width: 80,
        },
        {
          prop: "parentDeptDesc",
          label: "上级科室名",
          width: 120,
        },
        {
          prop: "contactNumber",
          label: "联系电话",
          width: 80,
        },
        {
          prop: "createYear",
          label: "创建时间",
          width: 80,
        },
        {
          prop: "statusDesc",
          label: "状态",
          width: 80,
        },
      ],
      stateOptions: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "已开启",
          value: "1",
        },
        {
          label: "未开启",
          value: "0",
        },
      ],
      queryParams: {
        patName: "",
        state: "",
      },
      tableData: [],
      pageParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getTree();
  },
  methods: {
    // 左侧树过滤函数
    filterTreeNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 查询左侧树
    getTree() {
      getOnQueryOrgsTree({}).then((res) => {
        this.treeData = res.result;
      });
    },
    nodeClick(nodeData) {
      this.currentNode = nodeData;
      this.searchFuc();
    },
    // 查询
    searchFuc() {
      this.pageParams.pageNum = 1;
      this.loadData();
    },
    async loadData() {
      this.loading = true;
      try {
        let params = {
          ...this.queryParams,
          ...this.pageParams,
          parentId: this.currentNode.parentId || "",
        };
        let res = await getOnQueryOrgs(params);
        this.tableData = res.result.records;
        this.pageParams.total = res.result.total;
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 导出
    async setOut() {
      let params = {
        parentId: this.currentNode.parentId || "",
      };
      let res = await setOutExportOrgExcel(params);
      var blob = res;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        var parent = document.getElementsByClassName("departManage")[0];
        var a = document.createElement("a");
        a.setAttribute("id", "billHref");
        a.download = "部门注册.xls";
        a.href = e.target.result;
        parent.appendChild(a);
        let aDom = document.getElementById("billHref");
        aDom.click();
        parent.removeChild(aDom);
      };
    },
    // 分页 pageNum
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.loadData();
    },
    // 分页 pageSize
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.loadData();
    },
  },
};
</script>

<style lang="scss" scoped>
.departManage {
  height: 100%;
}
.float-right {
  float: right;
}
.el-card ::v-deep .el-card__body {
  padding: 0;
}
.left {
  float: left;
  width: 20%;
  height: 100%;
  margin-right: 16px;
  header {
    border-bottom: 1px solid #dfe4eb;
  }
  .el-input {
    margin: 16px 0 0 16px;
    width: calc(100% - 32px);
  }
  .tree {
    height: calc(100% - 98px);
    padding: 10px;
    .el-button {
      padding: 2px;
    }
  }
}
.right {
  height: 100%;
  padding: 16px;
  header {
    border-bottom: 1px solid #dfe4eb;
  }
  .search {
    .el-input,
    .el-select {
      width: 220px;
      margin-right: 32px;
    }
  }
  .table-cont {
    height: calc(100% - 96px);
    margin-top: 16px;
  }
  .pagination-cont {
    height: 50px;
  }
}
</style>