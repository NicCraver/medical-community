<!--
  @description 采集监控-基础配置-质控方案-查看
  @date 2022/03/21
-->

<template>
  <div class="quality-control-show">
    <div class="protitle">查看</div>
    <div class="promain">
      <el-card>
        <div class="main">
          <el-scrollbar>
            <el-collapse v-model="activeNames">
              <el-collapse-item title="发布信息" name="1" v-show="$route.params.projectState=='release'">
                <el-descriptions>
                  <el-descriptions-item label="数据对象">{{data.targetData}}</el-descriptions-item>
                  <el-descriptions-item label="数据范围">
                    <el-date-picker v-if="data.timeRange.length>0" size="small" v-model="data.timeRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" disabled></el-date-picker>
                    <span v-else>累计</span>
                    <el-tooltip content="数据范围：指质控方案生效的采集时间周期。" placement="right">
                      <i class="iconfont icon-info-circle"></i>
                    </el-tooltip>
                  </el-descriptions-item>
                  <el-descriptions-item label="生效时间">{{data.effectiveStartDate}} - {{data.effectiveEndDate}}</el-descriptions-item>
                  <el-descriptions-item label="执行配置">{{data.cron}}
                    <!-- <el-button type="text" @click="$refs.config.open(data.name,data.cron,'show')">查看</el-button> -->
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item title="基本信息" name="2">
                <el-descriptions>
                  <el-descriptions-item label="方案名称">{{data.name}}</el-descriptions-item>
                  <el-descriptions-item label="发布机构">{{data.publishOrgName}}</el-descriptions-item>
                  <el-descriptions-item label="方案来源">{{data.source==1? '内部':'国家标准'}}</el-descriptions-item>
                  <el-descriptions-item label="方案说明" :span="2">{{data.description}}</el-descriptions-item>
                  <el-descriptions-item label="方案状态">
                    <el-switch v-model="data.enableStatus" active-text="开启" inactive-text="关闭" :active-value="1" :inactive-value="0" disabled></el-switch>
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
              <el-collapse-item title="规则信息" name="3">
                <el-descriptions>
                  <el-descriptions-item label="机构范围">
                    <el-button type="text" @click="$refs.orgNameShow.open(data.orgTree)">查看</el-button>
                  </el-descriptions-item>
                </el-descriptions>
                <el-divider></el-divider>
                <p>规则设置</p>
                <ProTable>
                  <template #header>
                    <el-input size="small" placeholder="规则编号/规则名称" v-model="ruleQueryParams.content" clearable></el-input>
                    <el-select size="small" placeholder="请选择分级" v-model="ruleQueryParams.grade" clearable>
                      <el-option v-for="(item, index) in ruleGradeData" :key="index" :value="item.code"></el-option>
                    </el-select>
                    <el-select size="small" placeholder="规则类型" v-model="ruleQueryParams.type" clearable>
                      <el-option v-for="item in $store.state.ruleConfigTypeData" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                  </template>
                  <template #actions>
                    <el-button size="small" type="primary" @click="search">搜索</el-button>
                    <el-button size="small" @click="reset">重置</el-button>
                  </template>
                  <el-table ref="table" size="small" height="300" :data="ruleConfigList" border stripe>
                    <el-table-column label="序号" type="index" width="50"></el-table-column>
                    <el-table-column label="规则类型" min-width="100">
                      <template slot-scope="{row}">{{ruleConfigType(row.type)}}</template>
                    </el-table-column>
                    <el-table-column label="规则分级" min-width="100">
                      <template slot-scope="{row}">{{row.ruleLevel=='-1'?'无':row.ruleLevel}}</template>
                    </el-table-column>
                    <el-table-column label="业务目录" prop="roleBizName" min-width="170"></el-table-column>
                    <el-table-column label="规则编号" prop="code" min-width="120"></el-table-column>
                    <el-table-column label="规则名称" prop="name" min-width="180"></el-table-column>
                    <el-table-column label="计算方式" min-width="100">
                      <template>自动计算</template>
                    </el-table-column>
                    <el-table-column label="规则权重(%)" prop="ruleWeight" min-width="110">
                      <template slot-scope="{row}">{{row.ruleWeight=='-1'?'--':row.ruleWeight}}</template>
                    </el-table-column>
                  </el-table>
                </ProTable>
              </el-collapse-item>
              <el-collapse-item title="得分信息" name="4" class="mark">
                <el-row>
                  <span class="title">得分设置:</span>
                  <el-radio-group v-model="data.score" disabled>
                    <el-radio :label="1">小数</el-radio>
                    <el-tooltip content="质控得分将直接使用质量指数(满分为1 .00), 非满分展示如0.85。" placement="bottom">
                      <i class="iconfont icon-info-circle"></i>
                    </el-tooltip>
                    <el-radio :label="2">整数</el-radio>
                    <el-tooltip content="质控得分将使用质量指数乘以100，如0.85展示为85.00。" placement="bottom">
                      <i class="iconfont icon-info-circle"></i>
                    </el-tooltip>
                  </el-radio-group>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
        </div>
        <footer>
          <el-button size="small" @click="close">关闭</el-button>
        </footer>
      </el-card>
    </div>

    <PublishConfig ref="config"></PublishConfig>
    <OrgNameShow ref="orgNameShow"></OrgNameShow>
  </div>
</template>

<script>
import ProTable from "components/ProTable";
import PublishConfig from "./PublishConfig.vue";
import OrgNameShow from "./OrgNameShow.vue";
import { mapGetters } from "vuex";
import { getDictList, getQualityControlDetail } from "api/basicConfig";
import { deepClone } from "utils/utils";

export default {
  components: { ProTable, OrgNameShow, PublishConfig },
  data() {
    return {
      activeNames: ["1", "2", "3", "4"], //展开的折叠面板
      data: {
        targetData: "",
        timeRange: [],
        executeTime: "",
        execConfig: "", //执行配置
        name: "",
        publishOrgName: "",
        source: 1,
        description: "",
        enableStatus: 1,
        orgIds: [], //机构范围
        score: 1, //得分设置
      },
      ruleQueryParams: {}, //规则设置过滤条件
      ruleGradeData: [], //分级下拉
      ruleConfigList: [], //规则设置-列表数据
      ruleConfigListData: [], //规则设置-列表数据-原始数据
      dataTypeData: [
        { value: "0", label: "全部" },
        ...this.$store.state.ruleConfigTypeData,
      ], //数据对象下拉
    };
  },
  computed: { ...mapGetters(["ruleConfigType"]) },
  mounted() {
    // 获取规则分级下拉
    getDictList({ codes: "RULE_LEVEL" }).then(({ code, result }) => {
      if (code === 0) {
        this.ruleGradeData = [{ code: "无" }, ...result];
      }
    });
    // 获取详情
    getQualityControlDetail({ id: this.$route.params.id }).then(
      ({ code, result }) => {
        if (code === 0) {
          this.data = result;
          this.data.targetData = this.dataTypeData.find(
            (item) => item.value == result.targetData
          )?.label;
          this.data.timeRange = result.dataRangeStartTime
            ? [result.dataRangeStartTime, result.dataRangeEndTime]
            : [];
          this.ruleConfigListData = result.rulePlanConfigList;
          this.ruleConfigList = deepClone(result.rulePlanConfigList);
        }
      }
    );
  },
  methods: {
    // 规则设置-搜索
    search() {
      let { content, grade, type } = this.ruleQueryParams;
      this.ruleConfigList = this.ruleConfigListData.filter((item) => {
        return (
          (!content ||
            item.code.indexOf(content) !== -1 ||
            item.name.indexOf(content) !== -1) &&
          (!grade ||
            (grade == "无" && item.ruleLevel == -1) ||
            grade == item.ruleLevel) &&
          (!type || type == item.type)
        );
      });
    },
    // 规则设置-重置
    reset() {
      this.ruleQueryParams = {};
      this.ruleConfigList = deepClone(this.ruleConfigListData);
    },
    // 关闭
    close() {
      this.data = {};
      let projectState = this.$route.params?.projectState || "";
      if (projectState === "searchRes") {
        this.$router.push({ name: "searchRes" });
        return;
      }
      this.$router.push({ name: "configQualityControl" });
    },
  },
};
</script>

<style lang="less" scoped>
.quality-control-show {
  height: 100%;
}
.el-card {
  position: relative;
  height: 100%;
  width: 100%;
  .main {
    height: calc(100% - 40px);
    .el-collapse {
      height: 100%;
      border-top: none;
      .el-collapse-item {
        &:not(.is-active) {
          margin-bottom: 10px;
        }
        ::v-deep .el-collapse-item__header {
          border-bottom: none;
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          background-color: #f5f5f5;
          font-weight: 700;
          margin-bottom: 10px;
        }
        ::v-deep .el-collapse-item__wrap {
          border-bottom: none;
          .el-collapse-item__content {
            padding: 0;
          }
        }
      }
      .el-descriptions {
        ::v-deep .el-descriptions-item__container {
          height: 32px;
          line-height: 32px;
          color: #303133;
        }
        .el-date-editor {
          width: 250px;
        }
        .el-switch {
          height: 32px;
        }
        .el-radio,
        .el-button {
          line-height: 32px;
        }
      }
      .mark {
        .el-row {
          margin-bottom: 12px;
          line-height: 32px;
          height: 32px;
        }
        .title {
          margin-right: 10px;
        }
        .el-radio {
          margin-right: 5px;
        }
        .el-tooltip.iconfont {
          margin-right: 30px;
        }
      }
      .el-tooltip {
        color: #446abd;
        line-height: 32px;
        margin-left: 10px;
      }
      .el-divider {
        margin: 0;
      }
      p {
        height: 32px;
        line-height: 32px;
      }
      .el-table {
        margin-bottom: 10px;
      }
    }
  }

  footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    .el-button {
      float: right;
      margin-top: 9px;
      margin-right: 10px;
    }
  }
}
</style>