<!--
  @description 质控board-区域总览-一致/整合/完整/及时性总览
  @date 2022/05/23
-->
<template>
  <div class="rule-overview">
    <Top ref="top" :projectData="projectData" :icon="typeData.icon" :projectType="typeData.label" :activeId="activeId" :activeProjectData="activeProjectData" @change="projectChange"></Top>
    <el-card :style="getCardStyle">
      <ProTable>
        <template #header>
          <el-input size="small" placeholder="机构名称" v-model="queryParams.orgName" clearable></el-input>
          <el-select size="small" placeholder="执行开始时间-执行结束时间" style="width:300px" v-model="queryParams.runLogId" clearable>
            <el-option v-for="item in selectData" :key="item.id" :value="item.id" :label="dayjs(item.executeStartTime).format('YYYY-MM-DD HH:mm')+'至'+dayjs(item.executeEndTime).format('YYYY-MM-DD HH:mm')"></el-option>
          </el-select>
          <el-input size="small" placeholder="数据范围" class="data-range" v-model="dataRange" disabled></el-input>
        </template>
        <template #actions>
          <el-button size="small" type="primary" @click="search">查询</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </template>
        <template #batchActions>
          <div class="tip">
            <template v-if="dataRange">
              <el-tooltip :content="`单次得分=本次执行任务所得${typeData.label}得分。`">
                <i class="iconfont icon-info-circle-fill"></i>
              </el-tooltip>
              <span>分</span>
              <span class="strong">{{onceScore}}</span>
              <span>周期内{{typeData.label}}得分</span>
              <span class="strong">{{dataRange}}</span>
              <span>家机构</span>
              <span class="strong">{{total}}</span>
              <span>以下</span>
            </template>
            <span v-else>可查询特定周期内多家考核机构的{{typeData.label}}得分</span>
          </div>
        </template>
        <el-table ref="table" tooltip-effect="light" height="0" v-adaptive="{ bottomOffset: 105 }" v-loading="loading" :data="tableData" border stripe>
          <el-table-column label="序号" type="index" width="50">
            <template slot-scope="{$index}">
              <span>{{ $index + 1 + (pageNum - 1) * pageSize }}</span>
            </template>
          </el-table-column>
          <el-table-column label="医疗机构" prop="orgName" min-width="150"></el-table-column>
          <el-table-column label="规则类别" prop="configType">
            <template>{{typeData.label}}</template>
          </el-table-column>
          <el-table-column label="规则条数" prop="configCount"></el-table-column>
          <el-table-column :label="typeData.label+'得分'" prop="configScore"></el-table-column>
          <el-table-column label="总记录数（条）" prop="total"></el-table-column>
          <el-table-column :label="typeData.succLabel" prop="successCount"></el-table-column>
          <el-table-column :label="typeData.failLabel" prop="failCount"></el-table-column>
          <el-table-column label="质量指数" prop="massIndex">
            <template slot-scope="{row}">{{Number(row.massIndex).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="{row}">
              <el-button type="text" @click="show(row)">查看</el-button>
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
import Top from "./Top.vue";
import { getProjects, getOrgRuleData } from "api/qualityControl";
import { getRulePlanRunLogList } from "api/schemeOperationMonitor";

export default {
  components: {
    ProTable,
    Top,
  },
  data() {
    return {
      activeId: "",
      activeProject: {},
      projectData: [{ id: "", name: "", publishTime: "", score: "" }],
      queryParams: {}, // 查询请求参数
      tableData: [], //列表数据
      loading: false,
      pageNum: 1, //当前页数
      pageSize: 10, //每页条数
      total: 0, //总条数
      selectData: [], //执行时间下拉
      selectElement: null, //执行时间下拉框
      selectPageSize: 10,
      activeProjectData: {}, //当前方案右上角内容
      dataRange: "", //数据范围
      onceScore: 0, //单次得分
      isFromOverview: false, //是否从概览跳转
    };
  },
  computed: {
    getCardStyle() {
      return {
        height:
          this.projectData.length > 2
            ? "calc(100% - 97px)"
            : "calc(100% - 90px)",
      };
    },
    typeData() {
      switch (this.$route.params.type) {
        case "1":
          return {
            type: "1",
            label: "一致性",
            icon: "sync",
            succLabel: "一致记录数",
            failLabel: "不一致记录数",
            menuIndex: "institutionRuleType1",
            jumpIndex: "areaRuleType1",
          };
        case "2":
          return {
            type: "2",
            label: "整合性",
            icon: "endless",
            succLabel: "可对照记录数",
            failLabel: "不可对照记录数",
            menuIndex: "institutionRuleType2",
            jumpIndex: "areaRuleType2",
          };
        case "3":
          return {
            type: "3",
            label: "完整性",
            icon: "circular-conn",
            succLabel: "完整记录数",
            failLabel: "不完整记录数",
            menuIndex: "institutionRuleType3",
            jumpIndex: "areaRuleType3",
          };
        case "4":
          return {
            type: "4",
            label: "及时性",
            icon: "flashlamp",
            succLabel: "及时记录数",
            failLabel: "不及时记录数",
            menuIndex: "institutionRuleType4",
            jumpIndex: "areaRuleType4",
          };
      }
    },
  },
  watch: {
    // 从菜单点击
    "$route.params.type": function (val) {
      this.getProjectData(this.$store.state.activeProjectId);
    },
    // 从菜单点击
    "$route.params.from": function (val) {
      this.getProjectData(this.$store.state.activeProjectId);
    },
    activeId: function (val) {
      this.reset();
      this.getSelectData(true);
    },
  },
  mounted() {
    const param = this.$route.params;
    if (param.data) {
      // 从概览跳转
      this.projectData = [param.data];
      this.activeId = param.data.id;
      this.activeProject = param.data;
      this.isFromOverview = true;
    } else {
      // 从菜单点击
      this.getProjectData(this.$store.state.activeProjectId);
    }

    const loadSelectElement = document.querySelector(
      ".el-select-dropdown .el-select-dropdown__wrap"
    );
    this.selectElement = loadSelectElement;
  },
  methods: {
    // 获取发布方案
    getProjectData(id) {
      this.isFromOverview = false;
      getProjects({ configType: this.typeData.type, overviewType: 2 }).then(
        ({ result, code }) => {
          if (code === 0) {
            this.projectData = result;
            let index = 0;
            if (id) {
              index = result.findIndex((item) => item.id == id);
              index = index == -1 ? 0 : index;
            }
            this.activeProject = result[index];
            this.$store.commit("SET_ACTIVEPROJECTID", result[index].id);
            this.$nextTick(() => {
              // 滚动到选中方案
              let top = this.$refs.top;
              let width = top.$el.querySelector(".project").offsetWidth + 10;
              top.$el.scrollTo(width * index, 0);
            });
            // 从其他类型的区域总览点进来id可能不会变
            if (this.activeId == this.projectData[index].id) {
              this.reset();
            } else {
              this.activeId = this.projectData[index].id;
            }
          }
        }
      );
    },
    // 获取总览列表
    getTableData() {
      if (this.activeId == "") {
        this.$message.warning("没有对应的方案");
        return;
      }
      let param = {
        id: this.activeId,
        confgType: this.typeData.type,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...this.queryParams,
      };
      this.loading = true;
      getOrgRuleData(param)
        .then(({ code, result, total }) => {
          if (code === 0) {
            this.tableData = result.orgScoreInfoList;
            this.total = total;
            this.onceScore = result.sumScore;
            this.activeProjectData = {
              total: total,
              rangeStartDate: result.rangeStartDate,
              rangeEndDate: result.rangeEndDate,
            };
            if (this.queryParams.runLogId) {
              this.dataRange =
                result.runLogStartTime + "至" + result.runLogEndTime;
            } else {
              this.dataRange = "";
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取执行时间下拉
    getSelectData(isFirst) {
      let p = {
        rulePlanId: this.activeId,
        runResult: 1,
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
    // 当前方案change
    projectChange(project) {
      this.activeId = project.id;
      this.activeProject = project;
      this.$store.commit("SET_ACTIVEPROJECTID", project.id);
    },
    // 搜索
    search() {
      this.pageNum = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    // 重置
    reset() {
      this.queryParams = {};
      this.pageNum = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    // 查看
    show(row) {
      let param = {
        type: this.typeData.type,
        from: "area",
        data: {
          ...this.activeProject,
          row: row,
        },
      };
      if (this.queryParams.runLogId) {
        param.data.runLogId = this.queryParams.runLogId;
        param.data.selectData = this.selectData;
      }
      if (this.isFromOverview) {
        this.$router.push({
          name: "areaOverviewTypeShow",
          params: param,
        });
      } else {
        this.$router.push({
          name: "areaTypeShow",
          params: param,
        });
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
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
        this.getSelectData();
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
.rule-overview {
  height: 100%;
  padding: 10px;
}

.el-card {
  height: calc(100% - 90px);
  .data-range {
    width: 285px !important;
    ::v-deep .el-input__inner {
      color: #606266;
    }
  }
  .tip {
    margin-left: 0;
    flex-direction: row-reverse;
    color: #494949;
    .strong {
      margin: 0 5px;
      font-weight: 700;
      color: #446abd;
    }
    .el-tooltip {
      margin-left: 10px;
      color: #446abd;
    }
  }
}
</style>