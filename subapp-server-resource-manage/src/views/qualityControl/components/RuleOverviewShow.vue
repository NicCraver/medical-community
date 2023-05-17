<!--
  @description 质控board-区域总览-一致/整合/完整/及时性总览-查看
  @date 2022/05/23
-->
<template>
  <div class="rule-overview-show">
    <div class="protitle">{{title}}</div>
    <div class="promain">
      <ShowTop ref="top" :info="info" :echartData="echartData" :isMultiple="isMultiple" @projectChange="projectChange"></ShowTop>
      <el-card class="main">
        <ProTable>
          <template #header>
            <el-input size="small" placeholder="规则名称" v-model="queryParams.configName" clearable></el-input>
            <el-select size="small" placeholder="请选择表名" style="width:300px" v-model="queryParams.bussinessTable" clearable filterable>
              <el-option v-for="(item,index) in tableNameData" :key="index" :value="item"></el-option>
            </el-select>
            <el-select size="small" style="width:300px" placeholder="执行开始时间-执行结束时间" v-model="queryParams.runLogId" clearable>
              <el-option v-for="item in selectData" :key="item.id" :value="item.id" :label="dayjs(item.executeStartTime).format('YYYY-MM-DD HH:mm')+'至'+dayjs(item.executeEndTime).format('YYYY-MM-DD HH:mm')"></el-option>
            </el-select>
          </template>
          <template #actions>
            <el-button size="small" type="primary" @click="getTableData">搜索</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </template>
          <template #batchActions>
            <div class="illustrate">
              <span>规则条数：</span>
              <span class="blue">{{total}}</span>
              <span style="margin-right: 20px;"> 条</span>
              <span>时间范围：</span>
              <span class="blue">{{queryTime&&queryTime.length>0?queryTime[0]+' ~ '+queryTime[1]:'累计'}}</span>
            </div>
          </template>
          <div class="tt">
            <el-table ref="table" tooltip-effect="light" height="0" v-adaptive="{ bottomOffset: 70 }" v-loading="loading" :data="tableData" :style="getTableWidth" :expand-row-keys="expands" row-key="configId" border stripe>
              <el-table-column label="序号" type="index" width="50" :resizable="false"></el-table-column>
              <!-- 展开内容 -->
              <el-table-column type="expand">
                <template slot-scope="{row}">
                  <el-table :data="row.configRunResults" :style="{'margin-left':expandShow?0:'280px',width:expandShow?'1260px':'980px'}" border>
                    <el-table-column label="执行时间" width="280" v-if="expandShow">
                      <template slot-scope="props">{{props.row.executeStart?dayjs(props.row.executeStart).format('YYYY-MM-DD HH:mm')+'至'+dayjs(props.row.executeEnd).format('YYYY-MM-DD HH:mm'):''}}</template>
                    </el-table-column>
                    <el-table-column label="业务表名称" prop="businessTable" width="180"></el-table-column>
                    <el-table-column label="字段名称" prop="businessVariableName" width="100"></el-table-column>
                    <el-table-column label="执行结果" prop="runResult" width="100">
                      <template slot-scope="props">
                        <span v-if="props.row.runResult==1">成功</span>
                        <span v-else style="color:#ff2525">失败</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="typeData.label+'得分'" prop="configScore" width="150">
                      <template slot-scope="props">{{props.row.configScore == null? '--':props.row.configScore}}</template>
                    </el-table-column>
                    <el-table-column label="总记录数（条）" prop="total" width="150"></el-table-column>
                    <el-table-column :label="typeData.succLabel" prop="successCount" width="150"></el-table-column>
                    <el-table-column :label="typeData.failLabel" prop="failCount" width="150">
                      <template slot-scope="props">
                        <template v-if="props.row.failCount == 0">{{props.row.failCount}}</template>
                        <el-button v-else type="text" @click="showDetail(row,props.row)">{{props.row.failCount}}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <!-- 展开内容end -->
              <el-table-column label="规则名称" prop="configName" width="280" :resizable="false"></el-table-column>
              <el-table-column label="业务表" prop="businessTableCount" width="180" :resizable="false"></el-table-column>
              <el-table-column label="执行结果" prop="runResult" width="100" :resizable="false">
                <template slot-scope="{row}">
                  <span v-if="row.runResult==1">成功</span>
                  <span v-else style="color:#ff2525">失败</span>
                </template>
              </el-table-column>
              <el-table-column v-if="ifUseWeight" label="计算权重(%)" prop="ruleWeight" width="150" :resizable="false"></el-table-column>
              <el-table-column label="质量指数" prop="massIndex" width="100" :resizable="false">
                <template slot-scope="{row}">{{Number(row.massIndex).toFixed(2)}}</template>
              </el-table-column>
              <el-table-column prop="configScore" width="150" :resizable="false">
                <template slot="header">
                  {{typeData.label}}得分
                  <el-tooltip placement="top" :content="ifUseWeight?`计算公式：${typeData.label}规则得分*计算权重。`:`计算公式：${typeData.label}规则得分。`">
                    <i class="iconfont icon-info-circle"></i>
                  </el-tooltip>
                </template>
                <template slot-scope="{row}">{{row.configScore == null? '--':row.configScore}}</template>
              </el-table-column>
              <el-table-column label="总记录数（条）" prop="total" width="150" :resizable="false"></el-table-column>
              <el-table-column :label="typeData.succLabel" prop="successCount" width="150" :resizable="false"></el-table-column>
              <el-table-column :label="typeData.failLabel" prop="failCount" width="150" :resizable="false"></el-table-column>
              <el-table-column label="规则得分" prop="noWeightMassIndex"></el-table-column>
            </el-table>
            <div class="sum" :style="getSumWidth">
              <div>合计</div>
              <div v-show="ifUseWeight"> {{this.scores.sumWeight}}</div>
              <div>
                {{this.scores.sumScore}}
                <el-tooltip>
                  <div slot="content" v-if="ifUseWeight">计算方式：总计。<br />计算公式：所有{{typeData.label}}得分的总和。</div>
                  <div slot="content" v-else>计算方式：平均分。<br />计算公式：所有{{typeData.label}}得分的总和/项数。</div>
                  <i class="iconfont icon-info-circle"></i>
                </el-tooltip>
              </div>
              <div>
                {{this.scores.sumTotalCount}}
                <el-tooltip>
                  <div slot="content">计算方式：总计。<br />计算公式：列表中所有总记录数的合计。</div>
                  <i class="iconfont icon-info-circle"></i>
                </el-tooltip>
              </div>
              <div>
                {{this.scores.sumSuccessCount}}
                <el-tooltip>
                  <div slot="content">计算方式：总计。<br />计算公式：列表中所有{{typeData.succLabel}}的合计。</div>
                  <i class="iconfont icon-info-circle"></i>
                </el-tooltip>
              </div>
              <div>
                {{this.scores.sumFailCount}}
                <el-tooltip>
                  <div slot="content">计算方式：总计。<br />计算公式：列表中所有{{typeData.failLabel}}的合计。</div>
                  <i class="iconfont icon-info-circle"></i>
                </el-tooltip>
              </div>
            </div>
          </div>
        </ProTable>
      </el-card>
    </div>

    <showDetail ref="show"></showDetail>
  </div>
</template>

<script>
import ProTable from "components/ProTable";
import ShowTop from "./ShowTop.vue";
import showDetail from "./ShowDetail.vue";
import {
  getOrgScoreTrend,
  getOrgRuleDetailData,
  getOrgScore,
  getTableSelectData,
} from "api/qualityControl";
import { getRulePlanRunLogList } from "api/schemeOperationMonitor";

export default {
  components: { ProTable, ShowTop, showDetail },
  data() {
    return {
      queryTime: [], //时间范围
      info: { icon: "" },
      echartData: {
        dates: [],
        orgScores: [],
        areaScore: [],
        scoreType: 1, //1小数 2整数
      },
      queryParams: {}, // 查询请求参数
      tableNameData: [], //表名下拉
      tableData: [], //列表数据
      loading: false,
      total: 0, //总条数
      isMultiple: false, //是否为多个方案
      ifUseWeight: false, //是否使用权重
      scores: {}, //表尾合计
      selectData: [], //执行时间下拉
      selectElement: null, //执行时间下拉框
      selectPageSize: 10,
      expandShow: false, //展开行是否显示执行时间列
      expands: [], //Table 目前的展开行
      title: "查看",
    };
  },
  computed: {
    typeData() {
      switch (this.$route.params.type) {
        case "1":
          return {
            type: "1",
            label: "一致性",
            icon: "sync",
            succLabel: "一致记录数",
            failLabel: "不一致记录数",
            scoreField: "consistencyScore",
          };
        case "2":
          return {
            type: "2",
            label: "整合性",
            icon: "endless",
            succLabel: "可对照记录数",
            failLabel: "不可对照记录数",
            scoreField: "integrationScore",
          };
        case "3":
          return {
            type: "3",
            label: "完整性",
            icon: "circular-conn",
            succLabel: "完整记录数",
            failLabel: "不完整记录数",
            scoreField: "completeScore",
          };
        case "4":
          return {
            type: "4",
            label: "及时性",
            icon: "flashlamp",
            succLabel: "及时记录数",
            failLabel: "不及时记录数",
            scoreField: "timelinessScore",
          };
      }
    },
    getTableWidth() {
      return this.ifUseWeight
        ? { "min-width": "1610px" }
        : { "min-width": "1460px" };
    },
    getSumWidth() {
      return this.ifUseWeight
        ? { "min-width": "1610px" }
        : { "min-width": "1460px" };
    },
  },
  mounted() {
    const param = this.$route.params;
    if (param.data) {
      // 从其他页面跳转
      this.title = "查看";
      let data = param.data;
      this.info = {
        id: data.id,
        name: data.name,
        orgId: data.row.orgId,
        orgName: data.row.orgName,
        score: data.row.configScore ?? data.row.score ?? "--",
        label: this.typeData.label,
        icon: this.typeData.icon,
      };
      if (data.runLogId) {
        this.selectData = data.selectData;
        this.queryParams.runLogId = data.runLogId;
      }
      this.getChartData();
      this.getTableData();
      this.getSelectData();
      this.getExecSelectData(true);
    } else {
      this.init(param.type);
    }

    const loadSelectElement = document.querySelectorAll(
      ".el-select-dropdown .el-select-dropdown__wrap"
    );
    this.selectElement = loadSelectElement[1];
  },
  watch: {
    "$route.params.type": function (val) {
      this.init(val);
    },
    "$route.params.from": function (val) {
      this.init(this.$route.params.type);
    },
  },
  methods: {
    // 从菜单点击
    init(type) {
      this.title = this.typeData.label + "总览";
      this.isMultiple = true;
      this.queryTime = [];
      this.queryParams = {};
      this.echartData = {};
      this.tableData = [];
      this.total = 0;
      this.info = {
        orgName: "--",
        score: "--",
        label: this.typeData.label,
        icon: this.typeData.icon,
      };
      this.$refs.top.getProjectData(type, this.$store.state.activeProjectId);
    },
    // 切换方案
    projectChange(id, name) {
      this.info.id = id;
      this.info.name = name;
      this.$store.commit("SET_ACTIVEPROJECTID", id);
      this.queryParams = {};
      this.getExecSelectData(true);
      // 方案得分
      getOrgScore({ id: id }).then(({ result, code }) => {
        if (code === 0 && result) {
          this.info.orgId = result.orgId;
          this.info.orgName = result.orgName;
          this.info.score = result[this.typeData.scoreField] ?? "--";
          this.getChartData();
          this.getTableData();
          this.getSelectData();
        }
      });
    },
    // 获取表名下拉
    getSelectData() {
      getTableSelectData({
        id: this.info.id,
        configType: this.typeData.type,
      }).then(({ code, result }) => {
        if (code === 0) {
          this.tableNameData = result;
        }
      });
    },
    // 得分趋势
    getChartData() {
      getOrgScoreTrend({
        id: this.info.id,
        configType: this.typeData.type,
        orgId: this.info.orgId,
      }).then(({ code, result }) => {
        if (code === 0) {
          this.echartData = result;
        }
      });
    },
    // 获取列表数据
    getTableData() {
      if (this.info.id == "" || this.info.orgId == "") {
        this.$message.warning("没有对应的方案或医疗机构");
        return;
      }
      let param = {
        id: this.info.id,
        configType: this.typeData.type,
        orgId: this.info.orgId,
        ...this.queryParams,
      };
      this.loading = true;
      getOrgRuleDetailData(param)
        .then(({ code, result, total }) => {
          if (code === 0) {
            this.tableData = result.orgConfigResult;
            this.total = total;
            this.expands = total == 1 ? [this.tableData[0].configId] : [];
            this.ifUseWeight = result.weight;
            this.scores = {
              sumWeight: result.sumWeight ?? "--",
              sumScore: result.sumScore ?? "--",
              sumTotalCount: result.sumTotalCount ?? "--",
              sumSuccessCount: result.sumSuccessCount ?? "--",
              sumFailCount: result.sumFailCount ?? "--",
            };
            if (result.rangeStartDate) {
              this.queryTime = [result.rangeStartDate, result.rangeEndDate];
            } else {
              this.queryTime = [];
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
      this.expandShow = this.queryParams.runLogId ? true : false;
    },
    // 获取执行时间下拉
    getExecSelectData(isFirst) {
      let p = {
        rulePlanId: this.info.id,
        pageNum: 1,
        pageSize: isFirst ? 10 : this.selectPageSize,
      };
      getRulePlanRunLogList(p).then(({ result, code, total }) => {
        if (code === 0) {
          this.selectData = result;
          if (isFirst) {
            this.selectPageSize = 10;
            if (total > 10) {
              this.selectElement.addEventListener(
                "scroll",
                this.scrollLoadData
              );
            }
          } else if (this.selectPageSize >= total) {
            //如果已加载完全部数据，取消监听
            this.selectElement.removeEventListener(
              "scroll",
              this.scrollLoadData
            );
          }
        }
      });
    },
    // 重置
    reset() {
      this.queryParams = {};
      this.getTableData();
    },
    // 查看
    showDetail(row, expandRow) {
      let param = {
        rulePlanId: this.info.id,
        runLogId: expandRow.runLogId,
        ruleConfigId: row.configId,
        orgId: this.info.orgId,
        refSqlId: expandRow.refSqlId,
      };
      row.businessTable = expandRow.businessTable;
      row.failLabel = this.typeData.failLabel;
      this.$refs.show.open(param, row);
    },
    // 无限滚动
    scrollLoadData() {
      const scrollDistance =
        this.selectElement.scrollHeight -
        this.selectElement.scrollTop -
        this.selectElement.clientHeight;
      // 非搜索
      if (scrollDistance <= 0) {
        //页码依次加1
        this.selectPageSize += 5;
        this.getExecSelectData();
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    this.selectElement.removeEventListener("scroll", this.scrollLoadData);
    next();
  },
};
</script>

<style lang="less" scoped>
.rule-overview-show {
  height: 100%;
}

.main {
  height: calc(100% - 185px);
  .illustrate {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #f5f5f5;
    padding: 0 10px;
    .blue {
      color: #446abd;
      font-weight: 700;
    }
  }
  .tt {
    overflow-x: auto;
    overflow-y: hidden;
    .el-table {
      .el-tooltip.iconfont {
        color: #446abd;
        font-weight: 400;
      }
      .el-button {
        text-decoration: underline;
      }
      ::v-deep .el-table__body-wrapper {
        overflow-x: hidden;
      }
      ::v-deep .el-table__footer-wrapper .el-table__cell {
        font-weight: 700;
        background-color: #fff;
        &:nth-child(n + 4) .cell {
          color: #446abd;
        }
      }
      ::v-deep .el-table__expanded-cell {
        background-color: #f5f5f5;
        padding-left: 97px;
        padding-right: 10px;
        .el-table {
          width: 1260px;
        }
      }
    }
    .sum {
      height: 50px;
      line-height: 50px;
      border-left: 1px solid #e6e6e6;
      border-right: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      padding-left: 440px;
      font-weight: 700;
      div {
        display: inline-block;
        padding: 0 10px;
        width: 150px;
        color: #446abd;
        .el-tooltip.iconfont {
          font-weight: 400;
        }
      }
      div:first-child {
        width: 220px;
        margin-right: 100px;
        color: #303133;
      }
    }
  }
}
</style>