<!--
  @description 区域质控-各个总览-上面部分
  @date 2022/03/30
-->
<template>
  <div class="projects">
    <div class="project" :style="getProjectStyle(project.id == activeId)" v-for="(project,index) in projectData" :key="index" @click="projectChange(project,index)">
      <div class="publish-date">
        <span>{{project.publishTime}}&nbsp;&nbsp;发布</span>
        <span class="fr" v-show="project.id == activeId">{{activeProjectData.rangeStartDate?activeProjectData.rangeStartDate+'至'+activeProjectData.rangeEndDate:'累计'}}</span>
        <span class="fr gray">考核周期</span>
        <span class="fr" v-show="project.id == activeId">{{activeProjectData.total}}</span>
        <span class="fr gray">考核机构</span>
      </div>
      <div class="left">
        <div class="icon">
          <IconSvg icon-class="project" width="20" height="20"></IconSvg>
        </div>
        <span class="name">{{project.name}}</span>
        <i class="iconfont icon-ellipsis fr" @click.stop="$refs.show.open(project)"></i>
      </div>
      <div class="right">
        <div class="icon">
          <IconSvg :icon-class="icon"></IconSvg>
        </div>
        <span class="type">{{projectType}}</span>
        <div class="score-circle" :style="{backgroundColor:project.id == activeId?'#5d7dc0':'#e2ebfe'}">
          <span class="score">{{project.score}}</span>
          <span :style="{color:project.id == activeId?'#b9c7e4':'#5d7dc0'}">分</span>
        </div>
        <span class="desc" :style="{color:project.id == activeId?'#b9c7e4':'#5d7dc0'}">总得分=机构{{projectType}}得分总和除以机构数量。</span>
      </div>
      <el-image :src="project.id == activeId?require('img/qualityControl/top-rise.png'):require('img/qualityControl/top-rise-gray.png')"></el-image>
    </div>

    <Show ref="show"></Show>
  </div>
</template>

<script>
import Show from "../areaOverview/Show.vue";

export default {
  components: { Show },
  props: {
    activeId: String,
    projectData: Array,
    activeProjectData: Object,
    icon: {
      type: String,
      default: "sync",
    },
    projectType: {
      type: String,
      default: "一致性",
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    projectChange(project, index) {
      let width = this.$el.querySelector(".project").offsetWidth + 10;
      this.$el.scrollTo(width * index - 50, 0);
      this.$emit("change", project);
    },
    // 根据方案数量改变方案宽度
    getProjectStyle(active) {
      let style = {
        color: active ? "#fff" : "#5D7DC0",
        backgroundColor: active ? "#446abd" : "#fff",
      };
      if (this.projectData.length == 1) {
        style.width = "100%";
      } else {
        style.width = "95%";
      }
      return style;
    },
    getProjectLeftStyle(active) {
      if (active) {
        return {};
      } else {
        return {};
      }
    },
  },
};
</script>

<style lang="less" scoped>
.projects {
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 5px;
  .project {
    display: inline-block;
    position: relative;
    height: 80px;
    border-radius: 8px;
    background-color: #446abd;
    color: #fff;
    overflow: hidden;
    cursor: pointer;
    &:nth-child(n + 2) {
      margin-left: 10px;
    }
    .publish-date {
      height: 24px;
      line-height: 24px;
      padding: 0 10px;
      background-color: #5d7dc0;
      border-radius: 8px 8px 0 0;
      color: #fff;
      .gray {
        color: #abbce0;
        margin-left: 20px;
        margin-right: 10px;
      }
    }
    .left,
    .right {
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 20px;
    }
    .left {
      float: left;
      width: 30%;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 15px;
        right: 0;
        width: 1px;
        height: 26px;
        background-color: #5d7dc0;
      }
      .name {
        font-size: 16px;
        flex-grow: 2;
        padding-left: 5px;
        overflow: hidden;
      }
      .iconfont {
        font-size: 18px;
        font-weight: 700;
        &::before {
          display: inline-block;
          transform: rotate(90deg);
        }
      }
    }
    .right {
      float: left;
      width: 60%;
      .type {
        flex-grow: 1;
        font-size: 16px;
        text-align: center;
      }
      .score-circle {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        background-color: #5d7dc0;
        height: 34px;
        .score {
          font-size: 28px;
          margin-right: 6px;
        }
      }
      .desc {
        color: #b9c7e4;
        flex-grow: 3;
        padding-left: 20px;
      }
    }
    .icon {
      background-color: #e2ebfe;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .el-image {
      position: absolute;
      top: 19px;
      right: 20px;
    }
  }
}
</style>