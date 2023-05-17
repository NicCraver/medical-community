<!--
  @description 注册管理系统-人员注册
  @date 2021/11/02
-->
<template>
  <div class="peopleManage">
    <div class="protal-title">人员注册</div>
    <div class="protal-main">
      <el-card>
        <div class="search">
        <el-input v-model="queryParams.name" clearable size="small" placeholder="关键字" />
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
import { getOnQueryUsers, setOutExportUserExcel } from "api/regManage.js";

export default {
  name: "peopleManage",
  data() {
    return {
      loading: false,
      columnParams: [
        {
          prop: "name",
          label: "姓名",
          width: 80,
        },
        {
          prop: "sexDesc",
          label: "性别",
          width: 80,
        },
        {
          prop: "birthday",
          label: "出生日期",
          width: 100,
        },
        {
          prop: "maritalStatusDesc",
          label: "婚姻状况",
          width: 120,
        },
        {
          prop: "citizenship",
          label: "国籍",
          width: 80,
        },
        {
          prop: "nation",
          label: "民族",
          width: 150,
        },
        {
          prop: "politicalLandscape",
          label: "政治面貌",
          width: 120,
        },
        {
          prop: "highestDiploma",
          label: "学历",
          width: 80,
        },
        {
          prop: "degree",
          label: "学位",
          width: 80,
        },
        {
          prop: "",
          label: "毕业学校",
          width: 120,
        },
        {
          prop: "career",
          label: "职业",
          width: 120,
        },
        {
          prop: "telephone",
          label: "电话号码",
          width: 120,
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
        name: "",
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
  created() {
    this.searchFuc();
  },
  methods: {
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
        };
        let res = await getOnQueryUsers(params);
        this.tableData = res.result.records;
        this.pageParams.total = res.result.total;
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 导出
    async setOut() {
      let res = await setOutExportUserExcel({});
      var blob = res;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        var parent = document.getElementsByClassName("peopleManage")[0];
        var a = document.createElement("a");
        a.setAttribute("id", "billHref");
        a.download = "人员注册.xls";
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
.peopleManage {
  height: 100%;
}
.float-right {
  float: right;
}
.el-card {
  height: 100%;
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
</style>