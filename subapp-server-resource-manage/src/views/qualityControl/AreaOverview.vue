<!--
  @description 质控board-区域总览
  @date 2022-04-01
-->
<template>
  <div class="area-overview">
    <navBar :projectData="projectData" />
    <!-- <el-button
      slot="reference"
      class="search-btn"
      size="small"
      icon="el-icon-search"
      @click="popVisible = !popVisible"
      round
      >搜索</el-button
    >
    <el-popover placement="bottom" trigger="manual" v-model="popVisible">
      <div class="title">
        <span>搜索</span>
        <i class="el-icon-close fr" @click="popVisible = false"></i>
      </div>
      <el-row>
        <el-select
          size="small"
          v-model="queryParams.rulePlanId"
          placeholder="方案名称"
          filterable
          clearable
        >
          <el-option
            v-for="item in projectData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-date-picker
          size="small"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="发布开始日期"
          end-placeholder="发布结束日期"
          range-separator="至"
          v-model="queryParams.date"
          clearable
        ></el-date-picker>
        <el-button size="small" class="fr" @click="reset">重置</el-button>
        <el-button size="small" class="fr" type="primary" @click="search"
          >搜索</el-button
        >
      </el-row>
    </el-popover> -->
    <Project
      ref="top"
      :projectData="projectData"
      :activeId="activeId"
      @change="projectChange"
      v-loading="projectLoading"
    ></Project>
    <div class="project-score">
      <ProjectScore :id="activeId" :project="activeProject"></ProjectScore>
    </div>
    <div class="data-count">
      <DataCount :id="activeId" :cellStyle="cellStyle"></DataCount>
    </div>
    <div class="ranking">
      <Ranking :id="activeId"></Ranking>
    </div>
    <div class="loading" v-show="popVisible"></div>
  </div>
</template>

<script>
import navBar from "@/views/navBar/index.vue";
import Project from "./areaOverview/Project.vue";
import ProjectScore from "./areaOverview/ProjectScore.vue";
import DataCount from "./areaOverview/DataCount.vue";
import Ranking from "./areaOverview/Ranking.vue";
import { getProjects } from "api/qualityControl";
import { mapActions } from "vuex";

export default {
  components: { Project, ProjectScore, DataCount, Ranking, navBar },
  data() {
    return {
      activeId: "",
      activeProject: {},
      projectData: [{ id: "", name: "", publishTime: "" }],
      projectLoading: false,
      popVisible: false,
      queryParams: {},
    };
  },
  computed: {
    // getCountStyle() {
    //   return {
    //     height:
    //       this.projectData.length > 3
    //         ? "calc(100% - 487px)"
    //         : "calc(100% - 480px)",
    //   };
    // },
    // getRankStyle() {
    //   return {
    //     height:
    //       this.projectData.length > 3
    //         ? "calc(100% - 97px)"
    //         : "calc(100% - 90px)",
    //   };
    // },
  },
  watch: {
    $route(to, from) {
      console.log("刷新了");
      this.searchFuc();
    },
  },
  created() {
    this.searchFuc();
  },
  mounted() {},
  methods: {
    ...mapActions({
      setRulePlanIdList: "setRulePlanIdList",
    }),
    // 搜索
    search() {
      this.popVisible = false;
      let param = {
        rulePlanId: this.queryParams.rulePlanId,
        startDate: this.queryParams.date?.[0] ?? "",
        endDate: this.queryParams.date?.[1] ?? "",
      };
      this.getProjectData(param);
    },
    // 重置
    reset() {
      this.popVisible = false;
      this.queryParams = {};
      this.getProjectData();
    },
    //初始化方法
    searchFuc() {
      let params = {};
      let queryParams = this.$route.query;
      params.name = queryParams?.name || "";
      params.orgIdList = queryParams?.orgIdList || "";
      params.startDate = queryParams?.queryTime
        ? queryParams?.queryTime.split(",")[0]
        : "";
      params.endDate = queryParams?.queryTime
        ? queryParams?.queryTime.split(",")[1]
        : "";
      let rulePlanIdList = this.$store.state.rulePlanIdList || "";
      console.log("rulePlanIdList", rulePlanIdList);
      params.rulePlanIdList = rulePlanIdList;
      this.setRulePlanIdList("");
      this.getProjectData(params, this.$store.state.activeProjectId);
    },
    // 获取发布方案
    getProjectData(param, id) {
      this.projectLoading = true;
      getProjects({ ...param, configType: 0, overviewType: 2 })
        .then(({ result, code }) => {
          if (code === 0) {
            if (result.length == 0) {
              this.projectData = result;
              this.$message("未查到质控方案，请更换搜索条件");
            } else {
              this.projectData = result;             
              let index = 0;
              if (id) {
                index = result.findIndex((item) => item.id == id);
                index = index == -1 ? 0 : index;
              }
              this.projectChange(result[index]);
              this.$nextTick(() => {
                this.$refs.top.$refs.carousel.setActiveItem(index);
              });
            }
          }
          this.projectLoading = false;
        })
        .catch(() => {
          this.projectLoading = false;
        });
    },
    // 当前方案change
    projectChange(project) {
      this.activeId = project.id;
      this.activeProject = project;
      this.$store.commit("SET_ACTIVEPROJECTID", project.id);
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0 && columnIndex == 0) {
        return "color:#F19192";
      } else if (rowIndex == 1 && columnIndex == 0) {
        return "color:#F2BB42";
      } else if (rowIndex == 2 && columnIndex == 0) {
        return "color:#66B9C4";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.area-overview {
  position: relative;
  height: 100%;
  padding: 10px;
  padding-top: 0;
  ::v-deep .el-popover {
    position: absolute;
    top: -1px;
    left: 10px;
    right: 10px;
    .title {
      height: 40px;
      line-height: 40px;
      font-weight: 700;
      font-size: 16px;
      color: #303133;
      i {
        margin-top: 10px;
        cursor: pointer;
      }
    }
    .el-row {
      margin-bottom: 30px;
      .el-input {
        width: 300px;
        margin-left: 40px;
        margin-right: 10px;
      }
      .el-button {
        margin-left: 10px;
      }
    }
  }
  .search-btn {
    position: absolute;
    top: 95px;
    right: 20px;
    background-color: #f5f5f5;
    color: #919191;
    border: 1px solid #f5f5f5;
    width: 300px;
    text-align: left;
    opacity: 0.8;
    z-index: 10;
    &:focus,
    &:hover {
      color: #134796;
      border-color: #b8c8e0;
      background-color: #e7edf5;
    }
  }
  .project-score {
    float: left;
    width: calc(66.6% - 4px);
    height: 380px;
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .data-count {
    float: left;
    width: calc(66.6% - 4px);
    height: calc(100% - 480px);
  }
  .ranking {
    height: calc(100% - 90px);
  }
  .loading {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
}
</style>
