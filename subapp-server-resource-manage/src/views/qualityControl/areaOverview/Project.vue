<!--
  @description 质控board-区域总览-方案卡片
  @date 2022/04/01
-->
<template>
  <div class="projects">
    <el-carousel ref="carousel" trigger="click" height="80px" indicator-position="none" v-loading="projectLoading" :autoplay="false" :loop="false" @change="projectChange">
      <el-carousel-item v-for="(project,index) in projectData" :key="index">
        <div class="publish-date">
          <span>{{project.publishTime}}&nbsp;&nbsp;发布</span>
          <span class="fr">{{project.rangeStartDate?project.rangeStartDate+' 至 '+project.rangeEndDate:'累计'}}</span>
          <span class="fr gray">考核周期</span>
          <span class="fr">{{project.orgCounts}}</span>
          <span class="fr gray">考核机构</span>
        </div>
        <div class="left">
          <div class="icon">
            <IconSvg icon-class="project" width="20" height="20"></IconSvg>
          </div>
          <span class="name">{{project.name}}</span>
          <i class="iconfont icon-ellipsis fr" @click.stop="$refs.show.open(project)"></i>
        </div>
        <el-image :src="require('img/qualityControl/top-shield.png')"></el-image>
      </el-carousel-item>
    </el-carousel>

    <Show ref="show"></Show>
  </div>
</template>

<script>
import Show from "./Show.vue";

export default {
  components: { Show },
  props: {
    activeId: String,
    projectData: Array,
    projectLoading: Boolean,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    projectChange(index) {
      this.$emit("change", this.projectData[index]);
    },
  },
};
</script>

<style lang="less" scoped>
.projects {
  margin-bottom: 10px;
  .el-carousel {
    position: relative;
    border-radius: 8px;
    background-color: #446abd;
    color: #fff;
    overflow: hidden;
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
    .left {
      width: 30%;
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 20px;
      .name {
        font-size: 16px;
        flex-grow: 2;
        padding-left: 5px;
        overflow: hidden;
      }
      .iconfont {
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        &::before {
          display: inline-block;
          transform: rotate(90deg);
        }
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
      top: 25px;
      right: 20px;
    }
    ::v-deep .el-carousel__arrow {
      margin-top: 10px;
      height: 32px;
      width: 32px;
      background-color: #3c507b;
    }
  }
}
</style>