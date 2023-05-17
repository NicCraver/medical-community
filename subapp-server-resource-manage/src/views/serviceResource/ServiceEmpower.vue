<!-- 
  @description 服务资源-服务授权
  @date 
 -->
<template>
  <div class="ServiceEmpower" v-loading="loading">
    <div class="protitle">{{proEnv==='heilongjiang'?'数据授权':'服务授权'}}</div>
    <div class="promain">
      <el-card class="ServiceEmpower-cards">
        <ProTable class="ProTable">
          <template #header>
            <el-cascader size="small" placeholder="目录" v-model="searchValue.direcId" :options="catalogData" :props="cascaderProps" :show-all-levels="false" clearable></el-cascader>
            <el-input v-model="searchValue.relateInfo" placeholder="服务名称/编码/发布方" size="small"></el-input>
            <el-select v-model="searchValue.authorizeStatus" placeholder="状态" size="small" clearable>
              <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker v-model="searchValue.date" type="datetimerange" range-separator="至" start-placeholder="授权开始日期" end-placeholder="授权结束日期" size="small" value-format="yyyy-MM-dd hh:mm:ss">
            </el-date-picker>
          </template>
          <template #actions>
            <el-button type="primary" size="small" @click="searchFuc">搜索</el-button>
            <el-button size="small" @click="resetFuc">重置</el-button>
          </template>
          <template #batchActions>
            <el-button size="small" @click="batchEmpFuc">批量授权</el-button>
            <el-button size="small" @click="deleteFuc(selections)"><i class="el-icon-delete"></i> 删除</el-button>
            <div class="batchActions-right tip">
              <i class="el-icon-warning"></i>
              <div class="select-info">已选择{{ selections.length || 0 }}项</div>
              <el-button type="text" @click="clearFuc">清空</el-button>
            </div>
          </template>
          <el-table ref="singleTable" highlight-current-row border stripe v-adaptive="{ bottomOffset: 105 }" height="0" :data="tableData" @selection-change="selectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column class="overflow-point" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width" :fixed="item.fixed">
              <template slot-scope="scope">
                <template v-if="item.prop === 'operate'">
                  <el-button type="text" @click="showFuc(scope.row)">查看</el-button>
                  <!-- <el-button type="text" size="small" @click="showFuc(scope.row)"
                  >编辑</el-button
                > -->
                  <el-button type="text" @click="deleteFuc([scope.row])">删除</el-button>
                  <el-button type="text" @click="showEmpower(scope.row)">授权</el-button>
                </template>
                <template v-else-if="item.prop === 'iAuthorizeStatus'">
                  {{ getStatusList(scope.row[item.prop]) }}
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-cont">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationObj.pageNum" :page-sizes="paginationObj.pageSizes" :page-size="paginationObj.pageSize" :layout="paginationObj.layout" :total="paginationObj.total">
            </el-pagination>
          </div>
        </ProTable>
        <!-- 授权抽屉 -->
        <template v-if="empowerDrawer">
          <empower :visible.sync="empowerDrawer" title="授权" direction="rtl" size="520px" :editData="editData" @closeFuc="handleClose"></empower>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script>
import ProTable from "components/ProTable.vue";
import empower from "./components/ServiceEmpower/empower.vue";

import {
  getServiceEpmList,
  getServiceEpm,
  deleServiceEpm,
} from "api/serviceEmpower.js";
import { getCatalog } from "api/serviceResource";

export default {
  name: "ServiceEmpower",
  components: { ProTable, empower },
  data() {
    return {
      catalogData: [], //目录下拉
      cascaderProps: {
        expandTrigger: "hover",
        value: "id",
        label: "name",
        children: "childNodes",
        checkStrictly: true,
        emitPath: false,
      },
      statusList: [
        {
          label: "未授权",
          value: 0,
        },
        {
          label: "已授权",
          value: 1,
        },
      ],
      tableColumn: [
        { prop: "sBelongDirec", label: "所属目录", width: "120" },
        { prop: "sService", label: "服务名称", width: "120" },
        { prop: "sCode", label: "服务编码", width: "180" },
        { prop: "iAuthorizeStatus", label: "状态", width: "90" },
        { prop: "iAuth", label: "操作人", width: "100" },
        { prop: "sBelongDirec", label: "发布方", width: "100" },
        { prop: "sPublishTime", label: "发布时间", width: "150" },
        { prop: "orgStr", label: "授权机构", width: "120" },
        { prop: "iAuthorizeTime", label: "授权时间", width: "150" },
        { prop: "operate", label: "操作", width: "150", fixed: "right" },
      ],
      paginationObj: {
        pageSizes: [20, 100, 200, 300],
        pageSize: 20,
        pageNum: 1,
        layout: "total,sizes,prev,pager,next,jumper",
        total: 0,
      },
      loading: false,
      searchValue: {
        direcId: "",
        relateInfo: "",
        authorizeStatus: "",
        date: [],
      },
      tableData: [],
      selections: [],
      editData: {},
      // 授权
      empowerDrawer: false,
    };
  },
  computed: {
    proEnv() {
      return window.g.VUE_APP_ENVIRONMENT;
    },
  },
  created() {
    // 获取目录下拉
    getCatalog().then((res) => {
      this.catalogData = this.formatCatalog(res.result);
    });

    this.searchFuc();
  },
  methods: {
    searchFuc() {
      this.paginationObj.pageNum = 1;
      this.getList();
    },
    resetFuc() {
      this.searchValue = {
        direcId: "",
        relateInfo: "",
        authorizeStatus: "",
        date: [],
      };
    },
    clearFuc() {
      this.$refs.singleTable && this.$refs.singleTable.clearSelection();
    },
    handleSizeChange(val) {
      this.paginationObj.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.paginationObj.pageNum = val;
      this.getList();
    },
    selectionChange(selections) {
      this.selections = selections;
    },
    // 请求接口数据
    async getList() {
      this.loading = true;
      try {
        let date = this.searchValue.date;
        let startTime = date.length ? date[0] : "";
        let endTime = date.length ? date[1] : "";
        let params = {
          pageNum: this.paginationObj.pageNum,
          pageSize: this.paginationObj.pageSize,
          direcId: this.searchValue.direcId ?? "",
          relateInfo: this.searchValue.relateInfo,
          authorizeStatus: this.searchValue.authorizeStatus,
          startTime,
          endTime,
        };
        let { result, code, total } = await getServiceEpmList(params);
        console.log("服务授权list：", result);
        if (code === 0) {
          this.tableData = result;
          this.paginationObj.total = total;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 删除接口
    deleteFuc(list) {
      if (!list.length) {
        return;
      }
      this.$confirm("此操作将删除机构记录，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        this.loading = true;
        try {
          let arr = list.map((item) => {
            return item.sId;
          });
          let { result, code } = await deleServiceEpm(arr);
          if (code === 0) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.searchFuc();
          }
        } catch (error) {
        } finally {
          this.loading = false;
        }
      });
    },
    async getDetailFuc(row) {
      this.loading = true;
      try {
        let params = {
          sId: row.sId,
        };
        let { result, code } = await getServiceEpm(params);
        console.log("服务授权详情：", result);
        if (code === 0) {
          this.editData = result;
        } else {
          this.$message.error("请求失败！");
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 查看事件
    async showFuc(row) {
      await this.getDetailFuc(row);
      this.$router.push({
        name: "serviceEmpowerDetail",
        params: {
          from: "empower",
          row: { ...this.editData },
          id: this.editData.sId,
        },
      });
    },
    // 批量授权
    batchEmpFuc() {
      if (!this.selections.length) {
        return;
      }
      this.$router.push({
        name: "batchEmpower",
        params: {
          from: "empower",
          selections: JSON.stringify(this.selections),
        },
      });
    },
    // 授权抽屉
    async showEmpower(row) {
      await this.getDetailFuc(row);
      this.empowerDrawer = true;
    },
    handleClose() {
      this.empowerDrawer = false;
      this.searchFuc();
    },
    // 状态反显
    getStatusList(val) {
      let list = this.statusList;
      let obj = {};
      obj = list.find((item) => {
        return item.value == val;
      });
      return obj.hasOwnProperty("label") ? obj.label || "" : "";
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
  },
};
</script>

<style lang="less" scoped>
.ServiceEmpower {
  height: 100%;
  overflow: hidden;
  .ServiceEmpower-cards {
    height: 100%;
    .ProTable {
      height: 100%;
      .batchActions-right {
        align-items: center;
        .el-icon-warning,
        .select-info {
          margin-right: 10px;
        }
      }
      .pagination-cont {
        height: 32px;
        display: flex;
        justify-content: right;
      }
    }
  }
}
</style>