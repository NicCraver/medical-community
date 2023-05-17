<!--
  @description 采集监控-基础配置-质控方案-已发布
  @date 2022/03/14
-->
<template>
  <div class="released">
    <el-card>
      <ProTable>
        <template #header>
          <el-input size="small" placeholder="方案名称" v-model="queryParams.name" clearable></el-input>
          <el-input size="small" placeholder="机构名称" v-model="queryParams.orgName" clearable></el-input>
          <el-date-picker size="small" v-model="queryTime" type="daterange" start-placeholder="发布开始日期" end-placeholder="发布结束日期" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
        </template>
        <template #actions>
          <el-button size="small" type="primary" @click="search">搜索</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </template>
        <template #batchActions>
          <el-button size="small" @click="backBtnClick">批量撤回</el-button>
          <div class="tip">
            <i class="iconfont icon-info-circle-fill"></i>
            <span>已选择 {{multipleSelection.length}} 项</span>
            <el-button type="text" @click="clearSelection">清空</el-button>
          </div>
        </template>
        <el-table ref="table" tooltip-effect="light" height="0" v-adaptive="{ bottomOffset: 105 }" v-loading="loading" :data="tableData" @selection-change="handleSelectionChange" border stripe>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" type="index" width="50">
            <template slot-scope="{$index}">
              <span>{{ $index + 1 + (pageNum - 1) * pageSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="方案名称" prop="name" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column label="发布机构" prop="publishOrgName" min-width="120"></el-table-column>
          <el-table-column label="方案来源">
            <template slot-scope="{row}">{{row.source===1?'内部':'国家标准'}}</template>
          </el-table-column>
          <el-table-column label="机构范围" min-width="180" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{row.orgNames.toString()}}
            </template>
          </el-table-column>
          <el-table-column label="发布状态">
            <template slot-scope="{row}">{{row.publishStatus===2?'已发布':'已停止'}}</template>
          </el-table-column>
          <el-table-column label="发布人员" prop="updateByName"></el-table-column>
          <el-table-column label="发布时间" prop="publishTime" min-width="170"></el-table-column>
          <el-table-column label="创建人员" prop="createByName"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="170"></el-table-column>
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="{row}">
              <el-button type="text" @click="showScheme(row.id)">查看</el-button>
              <!-- <el-button type="text" @click="backByRow(row)" :disabled="row.publishStatus==4">撤回</el-button> -->
              <el-button type="text" @click="stop(row)" :disabled="row.publishStatus==4">停止</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </ProTable>
    </el-card>
  </div>
</template>

<script>
import ProTable from "components/ProTable";
import { getQualityControlList, statusChange } from "api/basicConfig";

export default {
  components: {
    ProTable,
  },
  data() {
    return {
      queryParams: {}, // 查询请求参数
      queryTime: [], //创建日期
      tableData: [], //列表数据
      multipleSelection: [], //列表被选中的内容
      loading: false,
      pageNum: 1, //当前页数
      pageSize: 10, //每页条数
      total: 0, //总条数
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取质控方案列表
    getList() {
      let param = {
        // publishStatus: 2,
        listStatus: 2,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...this.queryParams,
      };
      if (this.queryTime && this.queryTime.length > 0) {
        param.startDate = this.queryTime[0];
        param.endDate = this.queryTime[1];
      }
      this.loading = true;
      getQualityControlList(param)
        .then(({ code, result, total }) => {
          if (code === 0) {
            this.tableData = result;
            this.total = total;
          }
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
      this.getList();
    },
    // 重置
    reset() {
      this.queryParams = {};
      this.queryTime = [];
      this.pageNum = 1;
      this.pageSize = 10;
      this.getList();
    },
    // 清空
    clearSelection() {
      this.$refs.table && this.$refs.table.clearSelection();
    },
    // 批量撤回
    backBtnClick() {
      if (this.multipleSelection.length === 0) {
        this.$message("请选择一条数据");
      } else {
        this.$confirm(
          "该方案正在运行中，撤回将导致board无法查看数据，确认要撤回吗?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            let param = [];
            this.multipleSelection.forEach((item) => {
              param.push(item.id);
            });
            this.loading = true;
            statusChange({ ids: param, batchType: 3 })
              .then((res) => {
                if (res.code == 0) {
                  this.getList();
                  this.$message.success("操作成功");
                }
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      }
    },
    // 查看
    showScheme(id) {
      this.$router.push({
        name: "configQualityControlShow",
        params: { id: id, projectState: "release" },
      });
    },
    // 撤回
    backByRow(row) {
      this.$confirm(
        "该方案正在运行中，撤回将导致board无法查看数据，确认要撤回吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          statusChange({ ids: [row.id], batchType: 3 })
            .then((res) => {
              if (res.code == 0) {
                this.getList();
                this.$message.success("方案撤回成功");
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    // 停止
    stop(row) {
      this.$confirm(
        "该方案正在运行中，停止将导致board无法查看数据，且停止后方案无法再次发布。确认要停止吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading = true;
          statusChange({ ids: [row.id], batchType: 4 })
            .then((res) => {
              if (res.code == 0) {
                this.getList();
                this.$message.success("方案停止成功");
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    // table选择项发生变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.released {
  height: 100%;
}
.el-card {
  height: 100%;
  width: 100%;
}
</style>