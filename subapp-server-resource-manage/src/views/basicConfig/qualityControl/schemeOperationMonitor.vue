<!-- 
  @description 方案运行监控
  @date 2022/5/11
 -->
<template>
  <div class="schemeOperationMonitor" v-loading="loading">
    <div class="protitle">方案运行监控</div>
    <div class="promain">
      <el-card class="schemeOperationMonitor-cards">
        <ProTable class="ProTable">
          <template #header>
            <el-input v-model="searchValue.name" placeholder="方案名称" size="small" clearable></el-input>
            <el-select v-model="searchValue.runResult" placeholder="状态" size="small" clearable>
              <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker v-model="searchValue.date" type="datetimerange" range-separator="至" start-placeholder="执行开始日期" end-placeholder="执行结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" clearable>
            </el-date-picker>
            <el-date-picker v-model="searchValue.date1" type="datetimerange" range-separator="至" start-placeholder="发布开始日期" end-placeholder="发布结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" clearable>
            </el-date-picker>
          </template>
          <template #actions>
            <el-button type="primary" size="small" @click="searchFuc">搜索</el-button>
            <el-button size="small" @click="resetFuc">重置</el-button>
          </template>
          <el-table ref="singleTable" highlight-current-row border stripe v-adaptive="{ bottomOffset: 105 }" height="0" :data="tableData">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column v-for="(item, index) in tableColumn" :key="index" :prop="item.prop" :label="item.label" :align="item.align || 'left'" :min-width="item.width" :fixed="item.fixed">
              <template slot-scope="scope">
                <template v-if="item.prop === 'operate'">
                  <el-button type="text" @click="showFuc(scope.row)">
                    查看
                  </el-button>
                  <!-- 手动执行manualExecute(0-关闭 1-开启) -->
                  <el-button type="text" v-if="
                    scope.row.manualExecute == '1' &&
                    scope.row.publishStatus == '2'
                  " @click="performedManua(scope.row)">
                    手工执行
                  </el-button>
                </template>
                <!-- 发布状态 -->
                <template v-else-if="item.prop === 'publishStatus'">
                  {{
                  getOptionName(scope.row[item.prop] || "", "publishStatusList")
                }}
                </template>
                <!-- 生效时间 -->
                <template v-else-if="item.prop === 'date'">
                  {{
                  scope.row.effectiveStartDate
                    ? dayjs(scope.row.effectiveStartDate).format("YYYY-MM-DD")
                    : "--"
                }}
                  至
                  {{
                  scope.row.effectiveEndDate
                    ? dayjs(scope.row.effectiveEndDate).format("YYYY-MM-DD")
                    : "--"
                }}
                </template>
                <!-- 有日期格式要求的 -->
                <template v-else-if="item.format">
                  {{
                  scope.row[item.prop]
                    ? dayjs(scope.row[item.prop]).format(item.format)
                    : "--"
                }}
                </template>
                <!-- 执行结果 -->
                <template v-else-if="item.prop === 'runResult'">
                  <span :class="{ errCls: scope.row[item.prop] === '失败' }">
                    {{ scope.row[item.prop] }}
                  </span>
                </template>
                <template v-else>
                  {{ scope.row[item.prop] || "--" }}
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
    <!-- 执行loading弹框 -->
    <loadingCom :visible.sync="loadingComVisible" :text="loadingComText" width="375px"></loadingCom>
  </div>
</template>

<script>
import ProTable from "components/ProTable.vue";
import loadingCom from "components/loadingCom.vue";

import { getListRulePlan, rulePlanRun } from "api/schemeOperationMonitor.js";

import { deepClone } from "utils/utils";

export default {
  name: "schemeOperationMonitor",
  components: { ProTable, loadingCom },
  data() {
    return {
      loading: false,
      statusList: [
        {
          label: "成功",
          value: "1",
        },
        {
          label: "失败",
          value: "0",
        },
        {
          label: "全部",
          value: "",
        },
      ],
      publishStatusList: [
        {
          label: "待发布",
          value: "1",
        },
        {
          label: "运行中",
          value: "2",
        },
        {
          label: "已撤回",
          value: "3",
        },
        {
          label: "已停止",
          value: "4",
        },
        {
          label: "已完成",
          value: "5",
        },
      ],
      tableColumn: [
        { prop: "name", label: "方案名称", width: "150" },
        { prop: "cron", label: "执行周期", width: "150" },
        { prop: "publishStatus", label: "状态", width: "80" },
        { prop: "date", label: "生效时间", width: "180" },
        {
          prop: "executeTime",
          label: "最近执行时间",
          width: "130",
          format: "YYYY-MM-DD HH:mm",
        },
        { prop: "runResult", label: "最近执行结果", width: "100" },
        { prop: "publisherName", label: "发布人员", width: "90" },
        {
          prop: "publishTime",
          label: "发布时间",
          width: "130",
          format: "YYYY-MM-DD HH:mm",
        },
        { prop: "operate", label: "操作", width: "120", fixed: "right" },
      ],
      paginationObj: {
        pageSizes: [20, 100, 200, 300],
        pageSize: 20,
        pageNum: 1,
        layout: "total,sizes,prev,pager,next,jumper",
        total: 0,
      },
      searchValue: {
        name: "",
        runResult: "",
        date: [],
        date1: [],
      },
      tableData: [],
      loadingComVisible: false,
      loadingComText: "",
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
      this.searchValue = {
        name: "",
        runResult: "",
        date: [],
        date1: [],
      };
      this.paginationObj.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.paginationObj.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.paginationObj.pageNum = val;
      this.getList();
    },
    // 请求接口数据
    async getList() {
      this.loading = true;
      try {
        let date = this.searchValue.date || [];
        let date1 = this.searchValue.date1 || [];
        let executeStartTime = date.length ? date[0] : "";
        let executeEndTime = date.length ? date[1] : "";
        let publishStartTime = date1.length ? date1[0] : "";
        let publishEndTime = date1.length ? date1[1] : "";
        let params = {
          pageNum: this.paginationObj.pageNum,
          pageSize: this.paginationObj.pageSize,
          name: this.searchValue.name,
          runResult: this.searchValue.runResult,
          executeStartTime,
          executeEndTime,
          publishStartTime,
          publishEndTime,
        };

        let { result, code, total } = await getListRulePlan(params);
        console.log("查询方案运行监控数据：", result);
        if (code === 0) {
          this.paginationObj.total = total;
          this.tableData = result;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 查看
    showFuc(row) {
      this.$router.push({
        name: "schemeOperationMonitorShow",
        params: deepClone(row),
      });
    },
    // 手动执行
    performedManua(row) {
      this.$confirm(
        "您正在发起手工执行任务，系统将立即执行一次运行任务。确认要执行吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(async () => {
        this.loadingComVisible = true;
        this.loadingComText = "正在执行，请稍后";

        try {
          let { result, code } = await rulePlanRun({
            id: row.id,
          });
          console.log("手动执行结果：", { result, code });
          if (code === 0) {
            this.$message.success("执行成功");
            this.searchFuc();
          }
        } catch (error) {
        } finally {
          this.loadingComVisible = false;
          this.loadingComText = "";
        }
      });
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
.schemeOperationMonitor {
  height: 100%;
  overflow: hidden;
  .schemeOperationMonitor-cards {
    height: 100%;
    .ProTable {
      height: 100%;
      .errCls {
        color: #ff4d4f;
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