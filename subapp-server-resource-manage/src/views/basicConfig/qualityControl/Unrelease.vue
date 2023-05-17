<!--
  @description 采集监控-基础配置-质控方案-待发布
  @date 2022/03/14
-->
<template>
  <div class="unrelease">
    <el-card>
      <ProTable>
        <template #header>
          <el-input size="small" placeholder="方案名称" v-model="queryParams.name" clearable></el-input>
          <el-input size="small" placeholder="机构名称" v-model="queryParams.orgName" clearable></el-input>
          <el-select size="small" placeholder="方案状态" v-model="queryParams.status" clearable>
            <el-option :value="1" label="开启"></el-option>
            <el-option :value="0" label="停用"></el-option>
          </el-select>
          <el-date-picker size="small" v-model="queryTime" type="daterange" start-placeholder="创建开始日期" end-placeholder="创建结束日期" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
        </template>
        <template #actions>
          <el-button size="small" type="primary" @click="search">搜索</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </template>
        <template #batchActions>
          <el-button size="small" type="primary" @click="addBtnClick">新增</el-button>
          <el-button size="small" @click="stopBtnClick">批量停用</el-button>
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
          <el-table-column label="方案状态" width="100">
            <template slot-scope="{row}">
              <el-switch v-model="row.enableStatus" :active-value="1" :inactive-value="0" @change="enableStatusChange(row)"></el-switch>
              {{row.enableStatus===1?'开启':'停用'}}
            </template>
          </el-table-column>
          <el-table-column label="发布状态">
            <template slot-scope="{row}">{{row.publishStatus===1?'待发布':'已撤回'}}</template>
          </el-table-column>
          <el-table-column label="创建人员" prop="createByName"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="170"></el-table-column>
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="{row}">
              <el-button type="text" @click="showScheme(row.id)">查看</el-button>
              <el-button type="text" @click="editScheme(row.id)">编辑</el-button>
              <el-button type="text" :disabled="row.enableStatus===0" @click="$refs.publish.open(row)">发布</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </ProTable>
    </el-card>

    <Publish ref="publish" @publishSave="getList"></Publish>
  </div>
</template>

<script>
import ProTable from "components/ProTable";
import Publish from "./Publish.vue";
import { getQualityControlList, statusChange } from "api/basicConfig";

export default {
  components: {
    ProTable,
    Publish,
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
        // publishStatus: 1,
        listStatus: 1,
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
    // 新增
    addBtnClick() {
      this.$router.push({
        name: "configQualityControlAdd",
        params: { state: "add" },
      });
    },
    // 批量停用
    stopBtnClick() {
      if (this.multipleSelection.length === 0) {
        this.$message("请选择一条数据");
      } else {
        this.$confirm("是否确认停用选中的数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let param = [];
            this.multipleSelection.forEach((item) => {
              param.push(item.id);
            });
            this.loading = true;
            statusChange({ ids: param, batchType: 0 })
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
    // 清空
    clearSelection() {
      this.$refs.table && this.$refs.table.clearSelection();
    },
    // 编辑
    editScheme(id) {
      this.$router.push({
        name: "configQualityControlEdit",
        params: { state: "edit", id: id },
      });
    },
    // 查看
    showScheme(id) {
      this.$router.push({
        name: "configQualityControlShow",
        params: { id: id },
      });
    },
    // 方案状态 change
    enableStatusChange(row) {
      let state = row.enableStatus;
      let s = state === 1 ? "开启" : "停用";
      row.enableStatus = state === 1 ? 0 : 1; //滑块状态先不变
      this.$confirm("此操作将" + s + "方案, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          statusChange({ ids: [row.id], batchType: state })
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
.unrelease {
  height: 100%;
}
.el-card {
  height: 100%;
  width: 100%;
}
</style>