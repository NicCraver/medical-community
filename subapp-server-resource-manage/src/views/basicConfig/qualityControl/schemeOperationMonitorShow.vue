<!-- 
  @description 方案运行监控-查看
  @date 2022/5/11
 -->
<template>
  <div class="schemeOperationMonitorShow height100" v-loading="loading">
    <div class="protitle">查看</div>
    <div class="promain">
      <el-card class="info">
        <header class="head">基本信息</header>
        <el-row class="info-cont" :gutter="10">
          <el-col :span="item.isHidden ? 0 : item.span || 8" class="info-cont-item" v-for="(item, index) in infoLists" :key="index" v-show="!item.isHidden">
            {{ item.label }}
            {{ showInfoFuc(item) }}
          </el-col>
        </el-row>
      </el-card>
      <el-card class="record">
        <header class="head">运行记录</header>
        <div class="record-cont">
          <ProTable class="ProTable">
            <template #header>
              <el-select v-model="searchValue.runResult" placeholder="状态" size="small" clearable>
                <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-date-picker v-model="searchValue.date" type="datetimerange" range-separator="至" start-placeholder="执行开始日期" end-placeholder="执行结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" clearable>
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
                    <el-button type="text" @click="showLogFuc(scope.row)">
                      日志
                    </el-button>
                    <el-button type="text" @click="downFuc(scope.row)">
                      下载
                    </el-button>
                    <el-button type="text" v-if="
                      scope.row.runResult === '失败' &&
                      params.manualExecute == '1' &&
                      params.publishStatus == '2'
                    " @click="performedManua(scope.row)">
                      重跑
                    </el-button>
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
                  <!-- 数据范围 -->
                  <template v-else-if="item.prop === 'dataRange'">
                    {{
                  scope.row.startTime
                    ? dayjs(scope.row.startTime).format("YYYY-MM-DD HH:mm")
                    : "--"
                }}
                    至
                    {{
                  scope.row.endTime
                    ? dayjs(scope.row.endTime).format("YYYY-MM-DD HH:mm")
                    : "--"
                }}
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
        </div>
      </el-card>
      <el-card class="btn-cont">
        <el-button size="small" @click="backFuc">返回</el-button>
      </el-card>
    </div>

    <!-- 查看日志 -->
    <VisitlogShow ref="show"></VisitlogShow>
    <!-- 执行loading弹框 -->
    <loadingCom :visible.sync="loadingComVisible" :text="loadingComText" width="375px"></loadingCom>
  </div>
</template>

<script>
import ProTable from "components/ProTable.vue";
import loadingCom from "components/loadingCom.vue";
import VisitlogShow from "./VisitlogShow.vue";

import {
  getRulePlanRunLogList,
  rulePlanRun,
} from "api/schemeOperationMonitor.js";
import { exportExcel } from "api/serviceResource";

import { deepClone } from "utils/utils";

let infoListInit = [
  {
    prop: "name",
    label: "方案名称：",
    isHidden: false,
  },
  {
    prop: "publishStatus",
    label: "状态：",
    options: "publishStatusList",
    isHidden: false,
  },
  {
    prop: "effectiveStartDate",
    label: "生效时间：",
    format: "YYYY-MM-DD",
    isHidden: false,
  },
  {
    prop: "publisherName",
    label: "发布人：",
    isHidden: false,
  },
  {
    prop: "createdTime",
    label: "创建日期：",
    format: "YYYY-MM-DD HH:mm",
    isHidden: false,
  },
  {
    prop: "endByName",
    label: "停止人：",
    isHidden: true,
  },
  {
    prop: "endTime",
    label: "停止日期：",
    format: "YYYY-MM-DD HH:mm",
    isHidden: true,
  },
];

export default {
  name: "schemeOperationMonitorShow",
  components: { ProTable, loadingCom, VisitlogShow },
  data() {
    return {
      params: {},
      infoLists: [],
      loading: false,
      infos: {},
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
        { prop: "id", label: "任务ID", width: "160" },
        { prop: "runSource", label: "任务来源", width: "80" },
        { prop: "serverAddress", label: "服务器地址", width: "120" },
        { prop: "dataRange", label: "数据范围", width: "280" },
        {
          prop: "executeStartTime",
          label: "执行开始时间",
          width: "150",
          format: "YYYY-MM-DD HH:mm",
        },
        {
          prop: "executeEndTime",
          label: "执行结束时间",
          width: "150",
          format: "YYYY-MM-DD HH:mm",
        },
        { prop: "runResult", label: "执行结果", width: "90" },
        { prop: "operate", label: "操作", width: "180", fixed: "right" },
      ],
      paginationObj: {
        pageSizes: [20, 100, 200, 300],
        pageSize: 20,
        pageNum: 1,
        layout: "total,sizes,prev,pager,next,jumper",
        total: 0,
      },
      searchValue: {
        runResult: "",
        date: [],
      },
      tableData: [],
      loadingComVisible: false,
      loadingComText: "",
    };
  },
  computed: {},
  created() {
    this.setMenuName();
    this.searchFuc();
  },
  methods: {
    setMenuName() {
      this.params = this.$route.params;
      let infoLists = deepClone(infoListInit);
      let isHidden = this.params?.publishStatus != "4";
      this.$set(infoLists[infoLists.length - 2], "isHidden", isHidden);
      this.$set(infoLists[infoLists.length - 1], "isHidden", isHidden);
      this.infoLists = infoLists;
    },
    backFuc() {
      this.$router.push(
        "/basicConfig/configQualityControl/schemeOperationMonitor"
      );
    },
    // 基本信息数据反显
    showInfoFuc(item) {
      let params = this.params;
      if (!params.hasOwnProperty(item.prop)) {
        return "--";
      }
      let value = params[item.prop];
      if (item.hasOwnProperty("options")) {
        return this.getOptionName(value, item.options);
      } else if (item.prop === "effectiveStartDate") {
        return `${value ? this.dayjs(value).format(item.format) : "--"} 至 ${
          params["effectiveEndDate"]
            ? this.dayjs(params["effectiveEndDate"]).format(item.format)
            : "--"
        }`;
      } else if (item.hasOwnProperty("format")) {
        return value ? this.dayjs(value).format(item.format) : "--";
      }
      return value || "--";
    },
    searchFuc() {
      this.paginationObj.pageNum = 1;
      this.getList();
    },
    resetFuc() {
      this.searchValue = {
        runResult: "",
        date: [],
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
    // 请求记录数据
    async getList() {
      this.loading = true;
      try {
        let date = this.searchValue.date || [];
        let executeStartTime = date.length ? date[0] : "";
        let executeEndTime = date.length ? date[1] : "";
        let params = {
          pageNum: this.paginationObj.pageNum,
          pageSize: this.paginationObj.pageSize,
          runResult: this.searchValue.runResult,
          executeStartTime,
          executeEndTime,
          rulePlanId: this.params?.id,
        };

        let { result, code, total } = await getRulePlanRunLogList(params);
        console.log("查询方案运行监控记录数据：", result);
        if (code === 0) {
          this.paginationObj.total = total;
          this.tableData = result;
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    // 日志
    showLogFuc(row) {
      this.$refs.show.open(row);
    },
    // 下载
    async downFuc(row) {
      try {
        let res = await exportExcel(row.traceId);
        console.log("下载日志下载日志下载日志", res);
        var blob = res;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function (e) {
          var parent = document.getElementsByClassName(
            "schemeOperationMonitorShow"
          )[0];
          var a = document.createElement("a");
          a.setAttribute("id", "billHref");
          a.download = "日志.xls";
          a.href = e.target.result;
          parent.appendChild(a);
          let aDom = document.getElementById("billHref");
          aDom.click();
          parent.removeChild(aDom);
        };
      } catch (error) {}
    },
    // 重跑
    performedManua(row) {
      this.$confirm(
        "您正在重启本执行任务，重跑将立即执行。确认要重跑吗？",
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
            id: row.rulePlanId || this.params?.id,
          });
          console.log("手动执行结果：", { result, code });
          if (code === 0) {
            this.searchFuc();
            this.$message.success("执行成功");
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
.schemeOperationMonitorShow {
  height: 100%;
  overflow: auto;
  ::v-deep .el-card__body {
    padding: 0 10px 10px 0;
  }
  .info {
    height: 140px;
    margin-bottom: 10px;
    .info-cont {
      padding-left: 10px;
      .info-cont-item {
        margin-bottom: 13px;
        color: rgba(48, 49, 51, 100);
        font-size: 14px;
        text-align: left;
        font-family: SourceHanSansSC-regular;
      }
    }
  }
  .record {
    height: calc(100% - 205px);
    margin-bottom: 10px;
    .record-cont {
      padding-left: 10px;
      .errCls {
        color: #ff4d4f;
      }
    }
  }
  .btn-cont {
    height: 45px;
    ::v-deep .el-card__body {
      padding: 0;
      padding-right: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: right;
    }
  }
}
</style>