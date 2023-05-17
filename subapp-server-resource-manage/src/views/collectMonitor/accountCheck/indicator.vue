<!-- 
  @description 采集监控-数据对账-对账指标
  @date 2022/3/8
 -->
<template>
  <div class="indicator" v-loading="loading">
    <div class="protitle">对账指标</div>
    <div class="promain">
      <el-card class="indicator-cards">
        <ProTable class="ProTable">
          <template #header>
            <el-select size="small" placeholder="业务分类" v-model="searchValue.bizType" clearable>
              <el-option v-for="(item, index) in bizTypeOptions" :key="index" :value="item.code" :label="item.name"></el-option>
            </el-select>
            <el-input v-model="searchValue.indicatorName" placeholder="业务指标" size="small" clearable></el-input>
            <el-select v-model="searchValue.status" placeholder="状态" size="small" clearable>
              <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker v-model="searchValue.date" type="datetimerange" range-separator="至" start-placeholder="创建开始日期" end-placeholder="创建结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" clearable>
            </el-date-picker>
          </template>
          <template #actions>
            <el-button type="primary" size="small" @click="searchFuc">搜索</el-button>
            <el-button size="small" @click="resetFuc">重置</el-button>
          </template>
          <template #batchActions>
            <el-button type="primary" size="small" @click="editFuc({ status: '1' }, '0')"><i class="el-icon-plus"></i> 新增</el-button>
            <el-button size="small" @click="deleteFuc(selections)"><i class="el-icon-delete"></i> 删除</el-button>
            <div class="batchActions-right tip">
              <i class="el-icon-warning"></i>
              <div class="select-info">已选择{{ selections.length || 0 }}项</div>
              <el-button type="text" @click="clearFuc">清空</el-button>
            </div>
          </template>
          <!-- height="0" -->
          <el-table ref="singleTable" highlight-current-row border stripe v-adaptive="{ bottomOffset: 105 }" height="0" :data="tableData" @selection-change="selectionChange">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column class="overflow-point" v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width" :fixed="item.fixed">
              <template slot-scope="scope">
                <template v-if="item.prop === 'operate'">
                  <el-button type="text" @click="editFuc(scope.row, '1')">
                    查看
                  </el-button>
                  <el-button type="text" @click="editFuc(scope.row, '2')">
                    编辑
                  </el-button>
                  <el-button type="text" @click="deleteFuc([scope.row])">
                    删除
                  </el-button>
                </template>
                <template v-else-if="item.prop === 'status'">
                  {{ getOptionName(scope.row[item.prop], "statusList") }}
                </template>
                <template v-else>
                  {{ scope.row[item.prop] }}
                </template>
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
    <configurationCom :visible.sync="configVisible" :title="
        this.editData.flag === '0'
          ? '新增'
          : this.editData.flag === '1'
          ? '查看'
          : '编辑'
      " v-if="configVisible" :show-close="false" :close-on-click-modal="false" :before-close="handleClose" :editData="editData" :bizTypeOptions="bizTypeOptions" :bizTbEnOptions="bizTbEnOptions" @closeFuc="closeFuc"></configurationCom>
  </div>
</template>

<script>
import ProTable from "components/ProTable.vue";
import configurationCom from "./configurationCom.vue";

import {
  getDockBizIndicatorList,
  getTableInfo,
  deleteDockBizIndicator,
} from "api/indicator.js";

import { deepClone, getCodesListFuc } from "utils/utils";

export default {
  name: "indicator",
  components: { ProTable, configurationCom },
  data() {
    return {
      loading: false,
      statusList: [
        {
          label: "关闭",
          value: 0,
        },
        {
          label: "开启",
          value: 1,
        },
      ],
      tableColumn: [
        { prop: "bizTypeName", label: "业务分类", width: "100" },
        { prop: "indicatorName", label: "指标名称", width: "120" },
        { prop: "bizTbCn", label: "业务表中文名称", width: "120" },
        { prop: "bizTbEn", label: "业务表名", width: "100" },
        { prop: "status", label: "状态", width: "80" },
        { prop: "updatedBy", label: "操作人", width: "100" },
        { prop: "updatedTime", label: "更新时间", width: "180" },
        { prop: "operate", label: "操作", width: "180", fixed: "right" },
      ],
      paginationObj: {
        pageSizes: [20, 100, 200, 300],
        pageSize: 20,
        pageNum: 1,
        layout: "total,sizes,prev,pager,next,jumper",
        total: 0,
      },
      // 业务分类options
      bizTypeOptions: [],
      // 业务表名options
      bizTbEnOptions: [],
      searchValue: { bizType: "", indicatorName: "", status: "", date: [] },
      tableData: [],
      selections: [],
      editData: {},
      configVisible: false,
    };
  },
  created() {
    this.getOptions();
    this.getBizTbEnOptions();
    this.searchFuc();
  },
  methods: {
    // 获取业务分类options
    getOptions() {
      let list = getCodesListFuc("BIZ_TYPE");
      this.bizTypeOptions = deepClone(list);
    },
    // 获取业务表名options
    async getBizTbEnOptions() {
      try {
        let { code, result } = await getTableInfo();
        if (code === 0) {
          console.log("获取业务表名：", result);
          this.bizTbEnOptions = result;
        }
      } catch (error) {}
    },
    searchFuc() {
      this.paginationObj.pageNum = 1;
      this.getList();
    },
    resetFuc() {
      this.searchValue = {
        bizType: "",
        indicatorName: "",
        status: "",
        date: [],
      };
      this.paginationObj.pageNum = 1;
      this.getList();
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
        let date = this.searchValue.date || [];
        let startTime = date.length ? date[0] : "";
        let endTime = date.length ? date[1] : "";
        let params = {
          pageNum: this.paginationObj.pageNum,
          pageSize: this.paginationObj.pageSize,
          orgId: "",
          bizType: this.searchValue.bizType,
          indicatorName: this.searchValue.indicatorName,
          status: this.searchValue.status,
          startTime,
          endTime,
          orgId: "",
        };

        let { result, code, total } = await getDockBizIndicatorList(params);
        console.log("查询对账指标数据：", result);
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
      // 验证是否有开启状态的，不允许删除
      let arr = list.filter((item) => {
        return item.status === "1";
      });
      console.log(arr);
      if (arr.length) {
        this.$message.info("开启状态指标,无法删除。");
        return;
      }
      this.$confirm("此操作将永久删除该指标，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        this.loading = true;
        try {
          let arr = list.map((item) => {
            return item.id;
          });
          let { result, code } = await deleteDockBizIndicator(arr);
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
    editFuc(row, flag) {
      this.editData = {
        ...deepClone(row),
        flag,
      };
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
    getOptionName(val, listName) {
      let list = this[listName];
      let obj = list.find((item) => {
        return item.value == val;
      });
      return obj?.label || "";
    },
  },
};
</script>

<style lang="less" scoped>
.indicator {
  height: 100%;
  overflow: hidden;
  .indicator-cards {
    height: 100%;
    .ProTable {
      height: 100%;
      .batchActions-right {
        // width: 100%;
        // height: 32px;
        // margin-left: 10px;
        // padding: 0 10px;
        // line-height: 32px;
        // border-radius: 1px;
        // background-color: rgba(235, 241, 253, 100);
        // border: 1px solid rgba(68, 106, 189, 100);
        // display: flex;
        // flex-direction: row;
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