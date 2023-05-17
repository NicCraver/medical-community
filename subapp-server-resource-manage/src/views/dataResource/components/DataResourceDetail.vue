<!-- 
  @description 数据资源-概览-查看详情
  @date 2022/03/01
 -->
<template>
  <div class="detail">
    <div class="protitle">查看详情</div>
    <div class="promain">
      <el-card>
        <el-alert title="基本信息" type="info" :closable="false"></el-alert>
        <el-descriptions>
          <el-descriptions-item label="资源名称">{{basicInfo.resourceName}}</el-descriptions-item>
          <el-descriptions-item label="实例名称">{{basicInfo.dbInstance}}</el-descriptions-item>
          <el-descriptions-item label="实例地址">{{basicInfo.dbUrl}}</el-descriptions-item>
          <el-descriptions-item label="数据库名">{{basicInfo.dbName}}</el-descriptions-item>
          <el-descriptions-item label="数据库类型">{{basicInfo.dbType}}</el-descriptions-item>
          <el-descriptions-item label="创建日期">{{basicInfo.dbCreateDate}}</el-descriptions-item>
          <el-descriptions-item label="更新日期">{{basicInfo.dbUpdate}}</el-descriptions-item>
          <el-descriptions-item label="描述说明" :span="2">{{basicInfo.description}}</el-descriptions-item>
        </el-descriptions>
        <el-alert title="表信息" type="info" :closable="false"></el-alert>
        <el-table ref="table" height="0" v-adaptive="{bottomOffset: 62}" :data="tableData" border stripe>
          <el-table-column label="序号" type="index" width="50"></el-table-column>
          <el-table-column label="表名" prop="tableName" width="200"></el-table-column>
          <el-table-column label="字符集" prop="characterset"></el-table-column>
          <el-table-column label="行数" prop="rowNum"></el-table-column>
          <el-table-column label="容量(MB)" prop="capacity"></el-table-column>
          <el-table-column label="所有人" prop="owner"></el-table-column>
          <el-table-column label="环境" prop="environment"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-button type="text" @click="$refs.tableDetail.open(basicInfo.id, row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <footer>
          <el-button size="small" class="fr" @click="back">返回</el-button>
        </footer>
      </el-card>
    </div>
    <tableDetail ref="tableDetail"></tableDetail>
  </div>
</template>

<script>
import tableDetail from "./DataResourceTableDetail.vue";
import { getDatabaseDetail, getDatabaseTable } from "api/dataResource.js";

export default {
  data() {
    return {
      params: {},
      basicInfo: {}, //基本信息
      tableData: [], //表信息
    };
  },
  components: { tableDetail },
  computed: {},
  mounted() {
    this.params = this.$route.params;

    getDatabaseDetail({ id: this.params.id }).then((res) => {
      this.basicInfo = res.result;
    });
    getDatabaseTable({ id: this.params.id }).then((res) => {
      this.tableData = res.result;
    });
  },
  methods: {
    // 返回
    back() {
      this.$router.push({ name: "dataResource" });
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  height: 100%;
}
.el-card {
  height: 100%;
  .el-alert {
    color: #101010;
    margin-bottom: 10px;
  }
  footer {
    margin-top: 10px;
  }
}
</style>
