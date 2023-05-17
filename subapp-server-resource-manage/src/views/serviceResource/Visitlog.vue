<!-- 
  @description 服务资源-访问日志
  @date 2022/1/27
 -->
<template>
  <div class="visit-log">
    <div class="protitle">{{proEnv==='heilongjiang'?'数据日志':'访问日志'}}</div>
    <div class="promain">
      <el-card>
        <ProTable>
          <template #header>
            <el-input size="small" placeholder="服务名称/编码" v-model="queryParams.content" clearable></el-input>
            <el-select size="small" placeholder="状态" v-model="queryParams.status" clearable>
              <el-option :value="0" label="成功"></el-option>
              <el-option :value="1" label="失败"></el-option>
            </el-select>
            <el-date-picker size="small" v-model="queryTime" type="daterange" start-placeholder="请求开始日期" end-placeholder="请求结束日期" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
          </template>
          <template #actions>
            <el-button size="small" type="primary" @click="search">搜索</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </template>
          <el-table ref="table" v-adaptive="{ bottomOffset: 105 }" height="0" :data="logData" v-loading="loading" border>
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="请求地址" prop="requestIp" min-width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="请求机构" prop="requestOrgName" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="请求方法" width="80">
              <template slot-scope="{row}">{{getRequestMethod(row.agreementSubType)}}</template>
            </el-table-column>
            <el-table-column label="服务名称" prop="serviceName" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="服务编码" prop="interfaceCode" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="请求开始时间" width="170">
              <template slot-scope="{row}">{{row.startTime | showDate}}</template>
            </el-table-column>
            <el-table-column label="请求结束时间" width="170">
              <template slot-scope="{row}">{{row.endTime | showDate}}</template>
            </el-table-column>
            <el-table-column label="执行状态" width="80">
              <template slot-scope="{row}">{{row.success == '0' ? '成功' : '失败'}}</template>
            </el-table-column>
            <el-table-column label="执行结果描述" prop="message" min-width="150"></el-table-column>
            <el-table-column label="操作" width="80" align="center" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="$refs.show.open(row.traceId)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </ProTable>
      </el-card>
    </div>
    <VisitlogShow ref="show"></VisitlogShow>
  </div>
</template>

<script>
import ProTable from "components/ProTable";
import VisitlogShow from "./components/VisitlogShow.vue";
import { formatDate } from "utils/utils";
import { getLogList } from "api/serviceResource";

export default {
  components: {
    ProTable,
    VisitlogShow,
  },
  data() {
    return {
      queryParams: {}, // 查询请求参数
      queryTime: [],
      logData: [],
      loading: false,
      pageNum: 1, //当前页数
      pageSize: 10, //每页条数
      total: 0, //总条数
      requestMethodData: [
        { value: 1, label: "POST" },
        { value: 2, label: "GET" },
        { value: 3, label: "PUT" },
        { value: 4, label: "PATCH" },
        { value: 5, label: "DELETE" },
      ],
    };
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  mounted() {
    this.getLogData();
  },
  filters: {
    showDate(value) {
      let date = new Date(value);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  methods: {
    // 获取日志列表
    getLogData() {
      if (this.queryTime && this.queryTime.length > 0) {
        this.queryParams.startDate = this.queryTime[0];
        this.queryParams.endDate = this.queryTime[1];
      } else {
        this.queryParams.startDate = "";
        this.queryParams.endDate = "";
      }
      this.queryParams.pageNum = this.pageNum;
      this.queryParams.pageSize = this.pageSize;
      this.loading = true;
      getLogList(this.queryParams)
        .then((res) => {
          this.logData = res.result;
          this.total = res.total;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 搜索
    search() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.getLogData();
    },
    // 重置
    reset() {
      this.queryParams = {};
      this.queryTime = [];
      this.pageNum = 1;
      this.pageSize = 10;
      this.getLogData();
    },
    // 查看
    showDetail(row) {
      console.log(row);
    },
    getRequestMethod(val) {
      return this.requestMethodData.find((item) => item.value == val)?.label;
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getLogData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getLogData();
    },
  },
};
</script>

<style lang="less" scoped>
.visit-log {
  height: 100%;
}
.el-card {
  height: 100%;
  width: 100%;
}
</style>