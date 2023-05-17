<!-- 
  @description 服务资源-服务授权-机构白名单
  @date 
 -->
<template>
  <div class="Whitelist" v-loading="loading">
    <div class="protitle">机构白名单</div>
    <div class="promain">
      <el-card class="Whitelist-cards">
        <ProTable class="ProTable">
          <template #header>
            <el-input v-model="searchValue.keyWords" placeholder="医院名称/编码/白名单地址" size="small" clearable></el-input>
            <el-select v-model="searchValue.status" placeholder="状态" size="small" clearable>
              <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker clearable v-model="searchValue.date" type="datetimerange" range-separator="至" start-placeholder="更新开始日期" end-placeholder="更新结束日期" size="small" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </template>
          <template #actions>
            <el-button type="primary" size="small" @click="searchFuc">搜索</el-button>
            <el-button size="small" @click="resetFuc">重置</el-button>
          </template>
          <template #batchActions>
            <el-button size="small" @click="deleteFuc(selections)"><i class="el-icon-delete"></i> 删除</el-button>
            <div class="batchActions-right tip">
              <i class="el-icon-warning"></i>
              <div class="select-info">已选择{{ selections.length || 0 }}项</div>
              <el-button type="text" @click="clearFuc">清空</el-button>
            </div>
          </template>
          <el-table ref="singleTable" highlight-current-row border stripe v-adaptive="{ bottomOffset: 105 }" height="0" :data="tableData" @selection-change="selectionChange">
            <el-table-column type="selection" width="40" :selectable="selectableFuc"></el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column class="overflow-point" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width" :fixed="item.fixed">
              <template slot-scope="scope">
                <template v-if="item.prop === 'operate'">
                  <el-button type="text" @click="editFuc(scope.row)" v-if="scope.row.status == 0">
                    配置
                  </el-button>
                  <el-button type="text" @click="editFuc(scope.row)" v-if="scope.row.status != 0">
                    查看
                  </el-button>
                  <el-button type="text" @click="editFuc(scope.row)" v-if="scope.row.status != 0">
                    编辑
                  </el-button>
                  <el-button type="text" @click="deleteFuc([scope.row])" v-if="scope.row.sId">
                    删除
                  </el-button>
                </template>
                <template v-else-if="item.prop === 'status'">
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
      </el-card>
    </div>
    <configurationCom :visible.sync="configVisible" v-if="configVisible" :show-close="false" :close-on-click-modal="false" :before-close="handleClose" :editData="editData" @closeFuc="closeFuc"></configurationCom>
  </div>
</template>

<script>
import ProTable from "components/ProTable.vue";
import configurationCom from "./components/Whitelist/configurationCom.vue";

import { getDockIpWhiteList, deleDockIpWhiteList } from "api/serviceEmpower.js";

import { deepClone } from "utils/utils";

export default {
  name: "Whitelist",
  components: { ProTable, configurationCom },
  data() {
    return {
      loading: false,
      statusList: [
        {
          label: "待配置",
          value: 0,
        },
        {
          label: "暂存",
          value: 1,
        },
        {
          label: "已配置",
          value: 2,
        },
      ],
      tableColumn: [
        { prop: "orgDesc", label: "机构名称", width: "180" },
        { prop: "orgCode", label: "机构编码", width: "180" },
        { prop: "sIp", label: "白名单地址", width: "180" },
        { prop: "status", label: "状态", width: "100" },
        { prop: "sUserName", label: "操作人", width: "100" },
        { prop: "modDate", label: "更新时间", width: "180" },
        { prop: "operate", label: "操作", width: "180", fixed: "right" },
      ],
      paginationObj: {
        pageSizes: [20, 100, 200, 300],
        pageSize: 20,
        pageNum: 1,
        layout: "total,sizes,prev,pager,next,jumper",
        total: 0,
      },
      searchValue: { keyWords: "", status: "", date: [] },
      tableData: [],
      selections: [],
      editData: {},
      configVisible: false,
    };
  },
  created() {
    this.searchFuc();
  },
  methods: {
    searchFuc() {
      this.paginationObj.pageNum = 1;
      this.getList();
    },
    resetFuc() {
      this.searchValue = { keyWords: "", status: "", date: [] };
      this.searchFuc();
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
    selectableFuc(row) {
      if (!row.sId) {
        return false;
      }
      return true;
    },
    // 请求接口数据
    async getList() {
      this.loading = true;
      try {
        let date = this.searchValue.date || [];
        let startTime = date.length ? date[0] : "";
        let endTime = date.length ? date[1] : "";
        let params = {
          pageNum: this.paginationObj.pageNum,
          pageSize: this.paginationObj.pageSize,
          key: this.searchValue.keyWords,
          status: this.searchValue.status,
          startTime,
          endTime,
        };

        let { result, code, total } = await getDockIpWhiteList(params);
        console.log("查询白名单数据：", result);
        if (code === 0) {
          this.paginationObj.total = total;
          this.tableData = result;
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
          let { result, code } = await deleDockIpWhiteList(arr);
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
    // 操作
    editFuc(row) {
      this.editData = deepClone(row);
      this.configVisible = true;
    },
    // 编辑界面
    handleClose() {
      this.configVisible = false;
    },
    closeFuc(flag) {
      this.configVisible = false;
      flag && this.searchFuc();
    },
    // 状态反显
    getStatusList(val) {
      let list = this.statusList;
      let obj = list.find((item) => {
        return item.value == val;
      });
      return obj.label || "";
    },
  },
};
</script>

<style lang="less" scoped>
.Whitelist {
  height: 100%;
  overflow: hidden;
  .Whitelist-cards {
    height: 100%;
    .ProTable {
      height: 100%;
      .batchActions-right {
        align-items: center;
        .el-icon-warning {
          color: #446abd;
        }
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