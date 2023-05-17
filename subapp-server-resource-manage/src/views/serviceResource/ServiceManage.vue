<!-- 
  @description 服务资源-服务管理
  @date 2022/1/25
 -->
<template>
  <div class="service-manage">
    <div class="protitle">{{proEnv==='heilongjiang'?'数据管理':'服务管理'}}</div>
    <div class="promain">
      <el-card>
        <ProTable>
          <template #header>
            <el-cascader size="small" placeholder="目录" v-model="queryParams.direcId" :options="catalogData" :props="cascaderProps" clearable></el-cascader>
            <el-input size="small" placeholder="服务名称/编码/发布方" v-model="queryParams.relateInfo" clearable></el-input>
            <el-select size="small" placeholder="状态" v-model="queryParams.publicStatus" clearable>
              <el-option v-for="item in statusData" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
            <el-date-picker size="small" v-model="queryTime" type="daterange" start-placeholder="发布开始日期" end-placeholder="发布结束日期" range-separator="至" value-format="yyyy-MM-dd"></el-date-picker>
          </template>
          <template #actions>
            <el-button size="small" type="primary" @click="search">搜索</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </template>
          <template #batchActions>
            <el-button size="small" type="primary" icon="iconfont icon-plus" @click="addBtnClick">新增</el-button>
            <el-button size="small" icon="iconfont icon-delete" @click="deleteBtnClick">删除</el-button>
            <div class="tip">
              <i class="iconfont icon-info-circle-fill"></i>
              <span>已选择 {{multipleSelection.length}} 项</span>
              <el-button type="text" @click="clearSelection">清空</el-button>
            </div>
          </template>
          <el-table ref="table" height="0" tooltip-effect="light" v-adaptive="{ bottomOffset: 105 }" v-loading="loading" :data="serviceData" @selection-change="handleSelectionChange" border stripe>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="所属目录" prop="belongDirec" min-width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="服务名称" prop="serviceName" min-width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="服务编码" prop="code" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="地址" prop="path" min-width="200" show-overflow-tooltip>
              <template slot-scope="{row}">
                <el-button type="text" icon="iconfont icon-file-copy" v-clipboard:copy="row.path" v-clipboard:success="onCopy" v-clipboard:error="onError"></el-button>
                <span>{{row.path}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template slot-scope="{row}">{{getStatusLabel(row.publishStatus)}}</template>
            </el-table-column>
            <el-table-column label="发布人" prop="publisher" width="100"></el-table-column>
            <el-table-column label="发布方" prop="publishOrg" min-width="120"></el-table-column>
            <el-table-column label="发布时间" prop="publishTime" min-width="170"></el-table-column>
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template slot-scope="{row}">
                <el-button type="text" @click="showDetail(row)">查看</el-button>
                <el-button type="text" v-show="row.publishStatus!==1" @click="editClick(row)">编辑</el-button>
                <el-button type="text" @click="deleteByRow(row)">删除</el-button>
                <el-button type="text" v-if="row.publishStatus==1" @click="stop(row)">停用</el-button>
                <el-button type="text" v-else @click="publish(row)">发布</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </ProTable>
      </el-card>
    </div>
  </div>
</template>

<script>
import ProTable from "components/ProTable";
import {
  getCatalog,
  getServiceList,
  deleteService,
  publishService,
  stopService,
} from "api/serviceResource";

export default {
  components: {
    ProTable,
  },
  data() {
    return {
      queryParams: {}, // 查询请求参数
      queryTime: [], //发布日期
      catalogData: [], //目录下拉
      cascaderProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "childNodes",
        checkStrictly: true,
        emitPath: false,
      },
      statusData: [
        { value: 1, label: "发布" },
        { value: 2, label: "停用" },
        { value: 0, label: "暂存" },
      ], //状态下拉
      serviceData: [], //列表数据
      multipleSelection: [], //列表被选中的内容
      loading: false,
      pageNum: 1, //当前页数
      pageSize: 10, //每页条数
      total: 0, //总条数
    };
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  mounted() {
    // 获取目录下拉
    getCatalog().then((res) => {
      this.catalogData = this.formatCatalog(res.result);
    });
    this.getServiceData();
  },
  methods: {
    // 获取服务列表数据
    getServiceData() {
      if (this.queryTime && this.queryTime.length > 0) {
        this.queryParams.startTime = this.queryTime[0];
        this.queryParams.endTime = this.queryTime[1];
      } else {
        this.queryParams.startTime = "";
        this.queryParams.endTime = "";
      }
      this.queryParams = {
        ...this.queryParams,
        direcId: this.queryParams.direcId ?? "",
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.loading = true;
      getServiceList(this.queryParams)
        .then((res) => {
          this.serviceData = res.result;
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
      this.getServiceData();
    },
    // 重置
    reset() {
      this.queryParams = {};
      this.queryTime = [];
      this.pageNum = 1;
      this.pageSize = 10;
      this.getServiceData();
    },
    // 清空
    clearSelection() {
      this.$refs.table && this.$refs.table.clearSelection();
    },
    // 新增
    addBtnClick() {
      this.$router.push({ name: "serviceManageAdd", params: { state: "add" } });
    },
    // 删除
    deleteBtnClick() {
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
              param.push(item.id);
            });
            this.deleteService(param);
          })
          .catch(() => {});
      }
    },
    // 查看
    showDetail(row) {
      this.$router.push({
        name: "serviceManageShow",
        params: { from: "manage", id: row.id },
      });
    },
    // 编辑
    editClick(row) {
      this.$router.push({
        name: "serviceManageEdit",
        params: { state: "edit", id: row.id },
      });
    },
    // 行内删除
    deleteByRow(row) {
      this.$confirm("是否确认删除选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteService([row.id]);
        })
        .catch(() => {});
    },
    // 发布
    publish(row) {
      if (row.publishStatus == 0) {
        this.$confirm("您有必填项未填写，现在就去完善吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.editClick(row);
          })
          .catch(() => {});
      } else {
        this.$confirm("您正在进行服务发布操作，确认要发布吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.loading = true;
            publishService(row.id)
              .then((res) => {
                if (res.code == 0) {
                  this.getServiceData();
                  this.$message.success("发布成功");
                } else {
                  this.loading = false;
                }
              })
              .catch(() => {
                this.loading = false;
              });
          })
          .catch(() => {});
      }
    },
    // 停用
    stop(row) {
      this.$confirm("您正在进行服务发布操作，确认要发布吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          stopService(row.id)
            .then((res) => {
              if (res.code == 0) {
                this.getServiceData();
                this.$message.success("停用成功");
              } else {
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    // 删除接口
    deleteService(p) {
      this.loading = true;
      deleteService(p)
        .then((res) => {
          if (res.code == 0) {
            this.getServiceData();
            this.$message.success("删除成功");
          } else {
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取状态值
    getStatusLabel(val) {
      return this.statusData.find((item) => item.value == val)?.label;
    },
    // table选择项发生变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getServiceData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getServiceData();
    },
    //格式化目录列表: 去掉空的childNodes
    formatCatalog(data) {
      data.forEach((item) => {
        if (item.childNodes.length == 0) {
          delete item.childNodes;
        } else {
          this.formatCatalog(item.childNodes);
        }
      });
      return data;
    },
    onCopy() {
      this.$message.success("复制成功");
    },
    onError() {
      this.$message.error("无可复制的内容");
    },
  },
};
</script>

<style lang="less" scoped>
.service-manage {
  height: 100%;
}
.el-card {
  height: 100%;
  width: 100%;
  .el-cascader {
    width: 200px;
  }
}
</style>